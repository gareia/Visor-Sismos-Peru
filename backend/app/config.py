from pathlib import Path
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
import logging

BACKEND_DIR = Path(__file__).resolve().parent.parent
print(BACKEND_DIR)

class Settings(BaseSettings):
    ENV: Literal["dev", "prod"] = "dev"
    DATABASE_URL: str
    FRONTEND_URL: str

    @property
    def db_sslmode(self) -> str:
        return "require" if self.ENV=="prod" else "disable"
    
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR/".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    logging.basicConfig(
        level=logging.DEBUG if ENV == "dev" else logging.INFO
    )


settings = Settings()

#load_dotenv()
