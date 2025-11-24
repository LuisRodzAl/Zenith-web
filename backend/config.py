import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FIREBASE_CREDENTIALS = os.getenv('FIREBASE_CREDENTIALS')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5713').split(',')
