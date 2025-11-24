# Configuración del Backend

## 1. Configurar Firebase

### Paso 1: Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Authentication** (Email/Password y Google)
4. Habilita **Firestore Database**

### Paso 2: Obtener credenciales
1. En Firebase Console, ve a **Project Settings** (⚙️)
2. Ve a la pestaña **Service Accounts**
3. Haz clic en **Generate new private key**
4. Descarga el archivo JSON
5. Guarda el archivo como `firebase-credentials.json` en la carpeta `backend/`

### Paso 3: Obtener API Key de Gemini
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la API key

## 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
SECRET_KEY=tu-clave-secreta-aqui-genera-una-aleatoria
FIREBASE_CREDENTIALS=firebase-credentials.json
GEMINI_API_KEY=tu-api-key-de-gemini-aqui
CORS_ORIGINS=http://localhost:3000
```

## 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 4. Ejecutar el servidor

```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`

## Verificación

Si todo está configurado correctamente, verás:
```
✓ Firebase initialized successfully
✓ Gemini AI initialized successfully
 * Running on http://127.0.0.1:5000
```

Si ves advertencias, revisa que:
- El archivo `firebase-credentials.json` existe y es válido
- La API key de Gemini es correcta
- El archivo `.env` está en la carpeta correcta
