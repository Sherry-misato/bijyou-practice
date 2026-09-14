from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import create_db_and_tables, get_session, engine
from models import (
    Pas,
    Log,
    LogCreate,
    Todo,
    TodoCreate,
    TodoUpdate,
    QuizQuestion,
    QuizAnswerRequest,
    QuizAnswerResult,
)
from seed import seed_all


@asynccontextmanager
async def lifespan(app: FastAPI):
    # アプリ起動時：テーブル作成 + 初期データ投入
    create_db_and_tables()
    with Session(engine) as session:
        seed_all(session)
    yield


app = FastAPI(title="bijyou API", lifespan=lifespan)

# Next.js(localhost:3000)からのアクセスを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "bijyou API is running"}


# ==============================
# パ辞書
# ==============================
@app.get("/pas", response_model=List[Pas])
def get_pas_list(session: Session = Depends(get_session)):
    return session.exec(select(Pas)).all()


@app.get("/pas/{pas_id}", response_model=Pas)
def get_pas(pas_id: int, session: Session = Depends(get_session)):
    pas = session.get(Pas, pas_id)
    if not pas:
        raise HTTPException(status_code=404, detail="パが見つかりません")
    return pas


# ==============================
# レッスン日記
# ==============================
@app.get("/logs", response_model=List[Log])
def get_logs(session: Session = Depends(get_session)):
    logs = session.exec(select(Log).order_by(Log.date.desc())).all()
    return logs


@app.post("/logs", response_model=Log)
def create_log(log: LogCreate, session: Session = Depends(get_session)):
    new_log = Log.model_validate(log)
    session.add(new_log)
    session.commit()
    session.refresh(new_log)
    return new_log


@app.delete("/logs/{log_id}")
def delete_log(log_id: int, session: Session = Depends(get_session)):
    log = session.get(Log, log_id)
    if not log:
        raise HTTPException(status_code=404, detail="日記が見つかりません")
    session.delete(log)
    session.commit()
    return {"message": "削除しました"}


# ==============================
# TODO
# ==============================
@app.get("/todos", response_model=List[Todo])
def get_todos(session: Session = Depends(get_session)):
    todos = session.exec(select(Todo).order_by(Todo.created_at.desc())).all()
    return todos


@app.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate, session: Session = Depends(get_session)):
    new_todo = Todo(content=todo.content)
    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)
    return new_todo


@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo: TodoUpdate, session: Session = Depends(get_session)):
    db_todo = session.get(Todo, todo_id)
    if not db_todo:
        raise HTTPException(status_code=404, detail="TODOが見つかりません")

    if todo.content is not None:
        db_todo.content = todo.content
    if todo.done is not None:
        db_todo.done = todo.done

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, session: Session = Depends(get_session)):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="TODOが見つかりません")
    session.delete(todo)
    session.commit()
    return {"message": "削除しました"}


# ==============================
# クイズ
# ==============================
@app.get("/quiz", response_model=List[QuizQuestion])
def get_quiz_questions(session: Session = Depends(get_session)):
    return session.exec(select(QuizQuestion)).all()


@app.post("/quiz", response_model=QuizAnswerResult)
def answer_quiz(answer: QuizAnswerRequest, session: Session = Depends(get_session)):
    question = session.get(QuizQuestion, answer.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="問題が見つかりません")

    is_correct = answer.selected_index == question.answer_index
    return QuizAnswerResult(correct=is_correct, correct_index=question.answer_index)
