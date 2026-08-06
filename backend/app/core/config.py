import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    APP_NAME: str = "Procura Backend API"
    APP_VERSION: str = "1.0"
    APP_ENV: str = "development"  # development, testing, production
    
    SECRET_KEY: str = "supersecretkeyplaceholderforlocalsignings"
    JWT_SECRET: str = "jwtsecretkeyplaceholderforlocalsignings"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/procura"
    
    LOG_LEVEL: str = "INFO"

settings = Settings()
