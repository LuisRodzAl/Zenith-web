from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
import google.generativeai as genai
from config import Config
from models import Emotion, Note, ChatMessage, Psicologo, Consejo
from datetime import datetime, timedelta

app = Flask(__name__)
app.config.from_object(Config)
# Configuración de CORS para permitir solicitudes desde el frontend de Next.js
CORS(
    app,
    origins=[
        "http://localhost:5173"  # Origen del frontend en desarrollo
    ],
    supports_credentials=True,
)

# Initialize Firebase
db = None
try:
    if app.config["FIREBASE_CREDENTIALS"]:
        cred_val = app.config["FIREBASE_CREDENTIALS"]

        # Check if it's a file path
        if os.path.exists(cred_val) and cred_val.endswith(".json"):
            cred = credentials.Certificate(cred_val)
            print(f"✓ Firebase initialized from file: {cred_val}")
        else:
            # Try to parse as JSON string (for Vercel env vars)
            import json

            try:
                cred_dict = json.loads(cred_val)
                cred = credentials.Certificate(cred_dict)
                print("✓ Firebase initialized from JSON environment variable")
            except json.JSONDecodeError:
                print(
                    "⚠ Warning: FIREBASE_CREDENTIALS is not a valid file path nor a valid JSON string."
                )
                raise Exception("Invalid FIREBASE_CREDENTIALS format")

        firebase_admin.initialize_app(cred)
        db = firestore.client()
    else:
        print(
            "⚠ Warning: FIREBASE_CREDENTIALS not set. Firebase features will be disabled."
        )
except Exception as e:
    print(f"⚠ Warning: Could not initialize Firebase: {e}")
    print("Firebase features will be disabled.")

# Initialize Gemini
try:
    if app.config["GEMINI_API_KEY"]:
        genai.configure(api_key=app.config["GEMINI_API_KEY"])
        model = genai.GenerativeModel("gemini-2.5-flash")
        print("✓ Gemini AI initialized successfully (gemini-2.5-flash)")
    else:
        print("⚠ Warning: GEMINI_API_KEY not set. Chat features will be disabled.")
        model = None
except Exception as e:
    print(f"⚠ Warning: Could not initialize Gemini: {e}")
    print(f"   Error details: {str(e)}")
    model = None


# Auth middleware
def verify_token(token):
    if not db:
        return None
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        return None


def check_firebase():
    if not db:
        return jsonify(
            {
                "error": "Firebase not configured. Please set FIREBASE_CREDENTIALS in .env"
            }
        ), 503
    return None


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Zenith API is running"})


# Emotions endpoints
@app.route("/api/emotions", methods=["GET"])
def get_emotions():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(Emotion.get_all())


# Chat endpoints
@app.route("/api/chat/history", methods=["GET"])
def get_chat_history():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["uid"]
    limit = int(request.args.get("limit", 10))

    messages_ref = (
        db.collection("conversaciones").document(user_id).collection("mensajes")
    )
    messages = (
        messages_ref.order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )

    history = []
    for msg in messages:
        data = msg.to_dict()
        history.insert(0, data)

    return jsonify(history)


@app.route("/api/chat/send", methods=["POST"])
def send_message():
    error = check_firebase()
    if error:
        return error

    if not model:
        return jsonify(
            {"error": "Gemini AI not configured. Please set GEMINI_API_KEY in .env"}
        ), 503

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["uid"]
    user_name = user.get("name", "Usuario")
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Save user message
    user_msg = ChatMessage(user_id, user_message, True)
    db.collection("conversaciones").document(user_id).collection("mensajes").add(
        user_msg.to_dict()
    )

    # Get conversation context
    messages_ref = (
        db.collection("conversaciones").document(user_id).collection("mensajes")
    )
    recent_messages = (
        messages_ref.order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(5)
        .stream()
    )

    context = f"Mi nombre es Zenith, un asistente psicológico virtual. Estoy hablando con {user_name}. "
    for msg in reversed(list(recent_messages)):
        msg_data = msg.to_dict()
        sender = user_name if msg_data["is_user_message"] else "Zenith"
        context += f"{sender}: {msg_data['text']}. "

    context += f"Responde al último mensaje: {user_message}"

    # Generate AI response
    try:
        print(f"Generating response for user: {user_name}")
        response = model.generate_content(context)
        ai_message = response.text
        print(f"Response generated successfully")

        # Save AI message
        ai_msg = ChatMessage(user_id, ai_message, False)
        db.collection("conversaciones").document(user_id).collection("mensajes").add(
            ai_msg.to_dict()
        )

        return jsonify({"response": ai_message})
    except Exception as e:
        print(f"❌ Error generating response: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": f"Error al generar respuesta: {str(e)}"}), 500


@app.route("/api/chat/clear", methods=["DELETE"])
def clear_chat():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["uid"]
    messages_ref = (
        db.collection("conversaciones").document(user_id).collection("mensajes")
    )

    # Delete all messages
    messages = messages_ref.stream()
    for msg in messages:
        msg.reference.delete()

    return jsonify({"message": "Chat history cleared"})


# Notes endpoints
@app.route("/api/notes", methods=["GET"])
def get_notes():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user_email = user["email"]
        print(f"📝 Getting notes for user: {user_email}")

        # Obtener notas sin order_by para evitar necesidad de índice
        notes_ref = db.collection("notas").where("email", "==", user_email)
        notes = notes_ref.stream()

        notes_list = []
        for note in notes:
            note_data = note.to_dict()
            note_data["id"] = note.id

            # Convert timestamp to ISO format for frontend
            if "timestamp" in note_data and note_data["timestamp"]:
                try:
                    note_data["timestamp"] = note_data["timestamp"].isoformat()
                except:
                    pass

            notes_list.append(note_data)

        # Ordenar en Python en lugar de Firestore
        notes_list.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

        print(f"✓ Found {len(notes_list)} notes")
        return jsonify(notes_list)

    except Exception as e:
        print(f"❌ Error getting notes: {str(e)}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/notes", methods=["POST"])
def create_note():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.json
        print(f"📝 Creating note for user: {user['email']}")
        print(f"   Title: {data.get('title', '')}")
        print(f"   Emotion: {data.get('emotion_emoji', '')}")

        note_data = {
            "email": user["email"],
            "title": data.get("title", ""),
            "content": data.get("content", ""),
            "emotion_name": data.get("emotion_name", ""),
            "emotion_emoji": data.get("emotion_emoji", ""),
            "timestamp": firestore.SERVER_TIMESTAMP,
        }

        doc_ref = db.collection("notas").add(note_data)
        note_id = doc_ref[1].id
        print(f"✓ Note created with ID: {note_id}")

        return jsonify({"id": note_id, "message": "Note created successfully"}), 201

    except Exception as e:
        print(f"❌ Error creating note: {str(e)}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/notes/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    db.collection("notas").document(note_id).delete()
    return jsonify({"message": "Note deleted successfully"})


# Calendar endpoints
@app.route("/api/calendar/emotions", methods=["GET"])
def get_calendar_emotions():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_email = user["email"]
    notes_ref = db.collection("notas").where("email", "==", user_email)
    notes = notes_ref.stream()

    emotions_by_day = {}
    for note in notes:
        note_data = note.to_dict()
        if "timestamp" in note_data and "emotion_emoji" in note_data:
            timestamp = note_data["timestamp"]
            if timestamp:
                date_str = timestamp.strftime("%Y-%m-%d")
                emotions_by_day[date_str] = note_data["emotion_emoji"]

    return jsonify(emotions_by_day)


# Psychologists endpoints
@app.route("/api/psychologists", methods=["GET"])
def get_psychologists():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        print("📋 Getting psychologists list")
        psicologos_ref = db.collection("psicologos")
        psicologos = psicologos_ref.stream()

        psicologos_list = []
        for psicologo in psicologos:
            psicologo_data = psicologo.to_dict()
            psicologo_data["id"] = psicologo.id
            psicologos_list.append(psicologo_data)

        print(f"✓ Found {len(psicologos_list)} psychologists")
        return jsonify(psicologos_list)

    except Exception as e:
        print(f"❌ Error getting psychologists: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/psychologists", methods=["POST"])
def create_psychologist():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.json
        print(f"👨‍⚕️ Creating psychologist: {data.get('nombre', '')}")

        psicologo_data = {
            "nombre": data.get("nombre", ""),
            "especialidad": data.get("especialidad", ""),
            "telefonoCelular": data.get("telefonoCelular", ""),
            "telefonoOficina": data.get("telefonoOficina", ""),
            "correoElectronico": data.get("correoElectronico", ""),
            "direccion": data.get("direccion", ""),
            "ubicacionUrl": data.get("ubicacionUrl", ""),
            "fotoUrl": data.get("fotoUrl", ""),
        }

        doc_ref = db.collection("psicologos").add(psicologo_data)
        psicologo_id = doc_ref[1].id
        print(f"✓ Psychologist created with ID: {psicologo_id}")

        return jsonify(
            {"id": psicologo_id, "message": "Psychologist created successfully"}
        ), 201

    except Exception as e:
        print(f"❌ Error creating psychologist: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/psychologists/<psicologo_id>", methods=["DELETE"])
def delete_psychologist(psicologo_id):
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        db.collection("psicologos").document(psicologo_id).delete()
        print(f"✓ Psychologist deleted: {psicologo_id}")
        return jsonify({"message": "Psychologist deleted successfully"})
    except Exception as e:
        print(f"❌ Error deleting psychologist: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Motivational tips endpoints
@app.route("/api/tips", methods=["GET"])
def get_tips():
    error = check_firebase()
    if error:
        return error

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(Consejo.get_all())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
