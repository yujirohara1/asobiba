from api.database import db, ma

## 実テーブル
class AutoSaveInterval(db.Model): 
    __tablename__ = "auto_save_interval"
    session_id = db.Column(db.String(), primary_key=True) 
    item_id = db.Column(db.String(), primary_key=True) 
    item_value = db.Column(db.String(), primary_key=False) 

class AutoSaveIntervalSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = AutoSaveInterval
            load_instance = True

# kiyonagi::DATABASE=> \d feed
#                              テーブル"public.feed"
#       列       |         タイプ         | 照合順序 | Null 値を許容 | デフォルト
# ---------------+------------------------+----------+---------------+------------
#  feed_code     | integer                |          | not null      |
#  feed_name     | character varying(500) |          |               |
#  nutrient_code | integer                |          | not null      |
#  amount        | numeric(10,6)          |          |               |
# インデックス:
#     "feed_pkey" PRIMARY KEY, btree (feed_code, nutrient_code)

