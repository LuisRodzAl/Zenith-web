#!/usr/bin/env python3
"""
Script para verificar la configuración del backend de Zenith
"""
import os
from pathlib import Path

def check_file(filepath, name):
    """Verifica si un archivo existe"""
    if os.path.exists(filepath):
        print(f"✅ {name}: Encontrado")
        return True
    else:
        print(f"❌ {name}: NO encontrado")
        return False

def check_env_var(var_name):
    """Verifica si una variable de entorno está configurada"""
    from dotenv import load_dotenv
    load_dotenv()
    
    value = os.getenv(var_name)
    if value and value.strip():
        print(f"✅ {var_name}: Configurado")
        return True
    else:
        print(f"❌ {var_name}: NO configurado")
        return False

def main():
    print("=" * 60)
    print("🔍 Verificando configuración de Zenith Backend")
    print("=" * 60)
    print()
    
    # Verificar archivos
    print("📁 Archivos:")
    env_exists = check_file(".env", "Archivo .env")
    creds_exists = check_file("firebase-credentials.json", "Credenciales Firebase")
    print()
    
    # Verificar variables de entorno
    if env_exists:
        print("🔑 Variables de entorno:")
        secret_ok = check_env_var("SECRET_KEY")
        firebase_ok = check_env_var("FIREBASE_CREDENTIALS")
        gemini_ok = check_env_var("GEMINI_API_KEY")
        print()
    else:
        print("⚠️  No se puede verificar variables sin archivo .env")
        print()
        secret_ok = firebase_ok = gemini_ok = False
    
    # Verificar contenido de credenciales
    if creds_exists:
        print("📄 Contenido de credenciales:")
        try:
            import json
            with open("firebase-credentials.json", "r") as f:
                creds = json.load(f)
                if "PLACEHOLDER" in str(creds):
                    print("❌ Las credenciales contienen PLACEHOLDER")
                    print("   Necesitas reemplazar con credenciales reales")
                    creds_valid = False
                else:
                    print("✅ Las credenciales parecen válidas")
                    creds_valid = True
        except Exception as e:
            print(f"❌ Error al leer credenciales: {e}")
            creds_valid = False
        print()
    else:
        creds_valid = False
    
    # Resumen
    print("=" * 60)
    print("📊 RESUMEN")
    print("=" * 60)
    
    all_ok = env_exists and creds_exists and secret_ok and firebase_ok and gemini_ok and creds_valid
    
    if all_ok:
        print("✅ ¡Todo configurado correctamente!")
        print("   Puedes ejecutar: python app.py")
    else:
        print("⚠️  Configuración incompleta")
        print()
        print("📝 Pasos pendientes:")
        if not env_exists:
            print("   1. Crear archivo .env (usa .env.example como base)")
        if not creds_exists or not creds_valid:
            print("   2. Obtener credenciales de Firebase Admin")
            print("      Lee: OBTENER_CREDENCIALES.md")
        if not gemini_ok:
            print("   3. Configurar GEMINI_API_KEY en .env")
    
    print()

if __name__ == "__main__":
    main()
