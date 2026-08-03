import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
IS_ENV_DEV=os.getenv("IS_ENV_DEV", "False").strip().lower() == "true"
DB_SSLMODE=os.getenv("DB_SSLMODE")