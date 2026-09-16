"""
初期データ投入スクリプト。
テーブルが空のときだけ、サンプルの「パ辞書」「クイズ」データを入れる。
main.py の起動時に呼ばれる。
"""

import os

from sqlmodel import Session, select

from models import Pas, QuizQuestion

# main.pyと同じベースURL（ローカル開発ではlocalhost、公開後はRenderのURL）
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000")


def seed_pas(session: Session):
    existing = session.exec(select(Pas)).first()
    if existing:
        return

    pas_list = [
        Pas(
            french="Plié",
            japanese="プリエ",
            french_meaning="フランス語で「曲げられた・折りたたまれた」という意味（plier「曲げる」の過去分詞）",
            meaning="膝を曲げる基本動作",
            movement="膝とつま先を同じ方向に向けながら、ゆっくり膝を曲げて伸ばす",
            caution="かかとが浮かないように、膝とつま先の向きを揃える",
            used_scene="ジャンプの着地・踏み切りの緩衝動作として、『白鳥の湖』群舞の入りなどほぼ全ての作品で使われる",
            sample_video_url=f"{PUBLIC_BASE_URL}/static/videos/Plie_Ex.mp4",
        ),
        Pas(
            french="Tendu",
            japanese="タンデュ",
            french_meaning="フランス語で「伸ばされた・張られた」という意味（tendre「伸ばす」の過去分詞）",
            meaning="足を伸ばして床を滑らせる動作",
            movement="軸足に体重を残したまま、動足のつま先を床につけて前後横に伸ばす",
            caution="足の甲を最後まで伸ばしきる。腰が動かないようにする",
            used_scene="『くるみ割り人形』金平糖の精のヴァリエーションなど、繊細な足さばきを見せる場面で多用される",
            sample_video_url=f"{PUBLIC_BASE_URL}/static/videos/tanjyu_Ex.mp4",
        ),
        Pas(
            french="Dégagé",
            japanese="デガジェ",
            french_meaning="フランス語で「解放された・自由になった」という意味（dégager「解放する」の過去分詞）",
            meaning="タンデュからさらに足を床から離して伸ばす動作",
            movement="タンデュの位置から、足の甲を保ったまま床から数センチ離して鋭く伸ばす",
            caution="足が床から離れすぎないように。軸足の骨盤が動かないように意識する",
            used_scene="ジャンプの踏み切り前の準備動作として、多くのアレグロ（跳躍系のステップ）の基礎になる",
            sample_video_url=f"{PUBLIC_BASE_URL}/static/videos/jyutte_Ex.mp4",
        ),
        Pas(
            french="Rond de jambe à terre",
            japanese="ロン・ド・ジャンブ・ア・テール",
            french_meaning="フランス語で「床の上での脚の円」という意味（rond「円」・jambe「脚」・à terre「床の上で」）",
            meaning="床の上で足で円を描く動作",
            movement="つま先で床をなぞりながら、前→横→後ろ（またはその逆）と半円を描くように動かす",
            caution="骨盤を動かさず、股関節から足を回すことを意識する。スピードを一定に保つ",
            used_scene="バーレッスンの定番種目で、股関節の可動域や軸の安定性を養う場面で使われる",
            sample_video_url=f"{PUBLIC_BASE_URL}/static/videos/ronde_Ex.mp4",
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
            question="「デガジェ」の動きとして正しいものは？",
            choices=["足を床から数センチ離して鋭く伸ばす", "膝を深く曲げる", "片足で回転する", "腕を大きく振る"],
            answer_index=0,
        ),
    ]
    session.add_all(questions)
    session.commit()


def seed_all(session: Session):
    seed_pas(session)
    seed_quiz(session)
