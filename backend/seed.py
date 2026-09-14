"""
初期データ投入スクリプト。
テーブルが空のときだけ、サンプルの「パ辞書」「クイズ」データを入れる。
main.py の起動時に呼ばれる。
"""

from sqlmodel import Session, select

from models import Pas, QuizQuestion


def seed_pas(session: Session):
    existing = session.exec(select(Pas)).first()
    if existing:
        return

    pas_list = [
        Pas(
            french="Plié",
            japanese="プリエ",
            meaning="膝を曲げる基本動作",
            movement="膝とつま先を同じ方向に向けながら、ゆっくり膝を曲げて伸ばす",
            caution="かかとが浮かないように、膝とつま先の向きを揃える",
            used_scene="バーレッスンの最初、ジャンプの着地・踏み切り",
            sample_video_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
        ),
        Pas(
            french="Tendu",
            japanese="タンデュ",
            meaning="足を伸ばして床を滑らせる動作",
            movement="軸足に体重を残したまま、動足のつま先を床につけて前後横に伸ばす",
            caution="足の甲を最後まで伸ばしきる。腰が動かないようにする",
            used_scene="バーレッスン、センターレッスンの基礎練習",
            sample_video_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
        ),
        Pas(
            french="Pirouette",
            japanese="ピルエット",
            meaning="片足軸で体を回転させるターン",
            movement="プレパレーションから軸足に乗り込み、腕とスポッティングを使って回る",
            caution="軸をまっすぐに保つこと。回転前に肩と腰の高さを揃える",
            used_scene="センターレッスン、バリエーション",
            sample_video_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
        ),
    ]
    session.add_all(pas_list)
    session.commit()


def seed_quiz(session: Session):
    existing = session.exec(select(QuizQuestion)).first()
    if existing:
        return

    questions = [
        QuizQuestion(
            question="「プリエ」の意味として正しいものは？",
            choices=["膝を曲げる動作", "回転する動作", "跳ぶ動作", "腕を回す動作"],
            answer_index=0,
        ),
        QuizQuestion(
            question="「タンデュ」で特に意識することは？",
            choices=["膝を曲げること", "足の甲を伸ばしきること", "高くジャンプすること", "速く回転すること"],
            answer_index=1,
        ),
        QuizQuestion(
            question="「ピルエット」とはどんな動きか？",
            choices=["片足軸で回転するターン", "足を横に伸ばす動作", "両足で跳ぶ動作", "腕だけを動かす動作"],
            answer_index=0,
        ),
    ]
    session.add_all(questions)
    session.commit()


def seed_all(session: Session):
    seed_pas(session)
    seed_quiz(session)
