import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/bijyou_db",
)

# Neon/Renderなど、外部サービスが発行するURLは "postgresql://" 形式で
# 渡されることが多いが、psycopg(v3)ドライバを使うには "postgresql+psycopg://"
# にする必要があるため、ここで自動変換する
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# echo=Falseにしておく（学習用にログを見たい場合はTrueにしてOK）
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    """テーブルが無ければ作成する"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPIのDependsで使うDBセッション"""
    with Session(engine) as session:
        yield session
