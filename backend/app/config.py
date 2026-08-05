from pathlib import Path
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
print(BACKEND_DIR)

class Settings(BaseSettings):
    ENV: Literal["dev", "prod"] = "dev"
    DATABASE_URL: str
    FRONTEND_URL: str

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR/".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def db_sslmode(self) -> str:
        return "require" if self.ENV=="prod" else "disable"

settings = Settings()

#load_dotenv()
