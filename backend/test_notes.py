#!/usr/bin/env python3
"""
Script para verificar las notas en Firestore
"""
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

def test_notes():
    try:
        # Initialize Firebase
        cred_path = os.getenv('FIREBASE_CREDENTIALS')
        if not cred_path or not os.path.exists(cred_path):
            print("❌ Archivo de credenciales no encontrado")
            return
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        
        print("=" * 60)
        print("📝 Verificando notas en Firestore")
        print("=" * 60)
        
        # Obtener todas las notas
        notes_ref = db.collection('notas')
        notes = notes_ref.stream()
        
        notes_list = []
        for note in notes:
            note_data = note.to_dict()
            note_data['id'] = note.id
            notes_list.append(note_data)
        
        print(f"\n✓ Total de notas en la base de datos: {len(notes_list)}")
        
        if notes_list:
            print("\n📋 Notas encontradas:")
            for i, note in enumerate(notes_list, 1):
                print(f"\n{i}. ID: {note['id']}")
                print(f"   Email: {note.get('email', 'N/A')}")
                print(f"   Título: {note.get('title', 'N/A')}")
                print(f"   Emoción: {note.get('emotion_emoji', 'N/A')} {note.get('emotion_name', 'N/A')}")
                print(f"   Timestamp: {note.get('timestamp', 'N/A')}")
        else:
            print("\n⚠️ No hay notas en la base de datos")
            print("\nPara crear una nota de prueba, usa la aplicación web.")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_notes()
