import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/orangecat")
    
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # API
    API_V1_STR = "/api/v1"
    PROJECT_NAME = "OrangeCat"
    
    # Bitcoin
    BITCOIN_ADDRESS = os.getenv("BITCOIN_ADDRESS", "bc1qgsup75ajy4rln08j0te9wpdgrf46ctx6w94xzq")
    MEMPOOL_API = "https://mempool.space/api"
    COINGECKO_API = "https://api.coingecko.com/api/v3"
    
    # CORS
    BACKEND_CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://orangecat.xyz",
    ]
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # File Storage
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # Email
    SMTP_TLS = True
    SMTP_PORT = 587
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL = os.getenv("EMAILS_FROM_EMAIL", "noreply@orangecat.xyz")
    EMAILS_FROM_NAME = os.getenv("EMAILS_FROM_NAME", "OrangeCat")

config = Config() 