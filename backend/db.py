from pathlib import Path
from dotenv import dotenv_values
import mysql.connector


# Load .env directly from backend folder
ENV_FILE = Path(__file__).resolve().parent / ".env"
config = dotenv_values(ENV_FILE)


def get_db_connection():
    return mysql.connector.connect(
        host=config.get("MYSQL_HOST", "127.0.0.1"),
        port=int(config.get("MYSQL_PORT", "3306")),
        user=config.get("MYSQL_USER", "root"),
        password=config.get("MYSQL_PASSWORD"),
        database=config.get("MYSQL_DATABASE", "farmnexa_db")
    )