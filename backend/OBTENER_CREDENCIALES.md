# ⚠️ IMPORTANTE: Obtener Credenciales de Firebase Admin

El archivo `firebase-credentials.json` actual es un placeholder. Necesitas obtener las credenciales reales del Service Account.

## Pasos para obtener las credenciales:

### Opción 1: Desde Firebase Console (RECOMENDADO)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **myzenith-db12d**
3. Haz clic en el ícono de engranaje ⚙️ y selecciona **Project Settings**
4. Ve a la pestaña **Service Accounts**
5. Haz clic en **Generate new private key**
6. Se descargará un archivo JSON
7. **Reemplaza** el archivo `firebase-credentials.json` con el archivo descargado
8. Reinicia el servidor Flask

### Opción 2: Si ya tienes el archivo

Si ya tienes el archivo de credenciales del proyecto Android:
1. Busca un archivo similar a `myzenith-db12d-firebase-adminsdk-xxxxx.json`
2. Cópialo a `zenith-web/backend/firebase-credentials.json`
3. Reinicia el servidor Flask

## Verificación

Después de configurar las credenciales, ejecuta:

```bash
python app.py
```

Deberías ver:
```
✓ Firebase initialized successfully
✓ Gemini AI initialized successfully
```

## Configuración Actual

Ya configuré:
- ✅ API Key de Firebase: AIzaSyAgmEcY9dcSy14_lLV_NEdQrgZBAHy7iyg
- ✅ API Key de Gemini: AIzaSyC2pB2tZAuf6OgWR_B05-yVhQcgEb41OiY
- ✅ Project ID: myzenith-db12d
- ⚠️ Service Account Credentials: **PENDIENTE**

Solo falta el archivo de credenciales del Service Account para que todo funcione.
