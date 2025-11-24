#!/usr/bin/env python3
"""
Script para probar la conexión con Gemini AI
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def list_models():
    """Lista los modelos disponibles"""
    print("\n📋 Modelos disponibles:")
    try:
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"   - {model.name}")
    except Exception as e:
        print(f"   Error listando modelos: {e}")

def test_gemini():
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ GEMINI_API_KEY no está configurada en .env")
        return False
    
    print(f"✓ API Key encontrada: {api_key[:20]}...")
    
    try:
        print("\n🔄 Configurando Gemini...")
        genai.configure(api_key=api_key)
        
        list_models()
        
        # Probar con diferentes modelos
        models_to_try = [
            'gemini-2.5-flash',
            'gemini-2.0-flash-exp',
            'models/gemini-2.5-flash',
            'models/gemini-2.0-flash-exp',
            'gemini-flash-latest',
            'gemini-pro-latest'
        ]
        
        for model_name in models_to_try:
            try:
                print(f"\n🔄 Probando modelo: {model_name}")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content("Hola, responde con un saludo breve")
                
                print(f"\n✅ ¡Modelo {model_name} funciona!")
                print(f"Respuesta: {response.text}")
                return model_name
                
            except Exception as e:
                print(f"   ❌ {model_name} no funciona: {str(e)[:100]}")
                continue
        
        print("\n❌ Ningún modelo funcionó")
        return False
        
    except Exception as e:
        print(f"\n❌ Error al conectar con Gemini:")
        print(f"   Tipo: {type(e).__name__}")
        print(f"   Mensaje: {str(e)}")
        
        if "API_KEY_INVALID" in str(e):
            print("\n💡 Solución: La API key no es válida")
            print("   1. Ve a https://makersuite.google.com/app/apikey")
            print("   2. Genera una nueva API key")
            print("   3. Actualiza GEMINI_API_KEY en .env")
        
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 Prueba de conexión con Gemini AI")
    print("=" * 60)
    working_model = test_gemini()
    
    if working_model:
        print("\n" + "=" * 60)
        print(f"💡 Usa este modelo en app.py: '{working_model}'")
        print("=" * 60)
