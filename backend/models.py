from datetime import date, datetime
from typing import Optional, List

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON


# ==============================
# パ辞書（バレエの技）
# ==============================
class Pas(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    french: str                     # フランス語名（例: Plié）
    japanese: str                   # 日本語名（例: プリエ）
    french_meaning: str = ""        # フランス語の単語自体の意味（例: 「曲げられた」）
    meaning: str                    # バレエ用語としての意味
    movement: str                   # 動き方
    caution: str                    # 注意点
    used_scene: str                 # 使用場面
    sample_video_url: Optional[str] = None  # お手本動画URL


# ==============================
# レッスン日記
# ==============================
class LogBase(SQLModel):
    date: date
    content: str                    # 今日の練習内容・気づき等


class Log(LogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class LogCreate(LogBase):
    pass


# ==============================
# TODO
# ==============================
class TodoBase(SQLModel):
    content: str
    done: bool = False


class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TodoCreate(SQLModel):
    content: str


class TodoUpdate(SQLModel):
    content: Optional[str] = None
    done: Optional[bool] = None


# ==============================
# クイズ
# ==============================
class QuizQuestion(SQLModel, table=True):
    __tablename__ = "quiz_questions"

    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    choices: List[str] = Field(sa_column=Column(JSON))  # 選択肢（4択など）
    answer_index: int  # 正解のインデックス（choicesの何番目か）


class QuizAnswerRequest(SQLModel):
    question_id: int
    selected_index: int


class QuizAnswerResult(SQLModel):
    correct: bool
    correct_index: int
