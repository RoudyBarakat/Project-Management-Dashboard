# config.py

import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Only the database URL is needed now
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Create an instance of your settings
settings = Settings()