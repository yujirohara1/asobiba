from api.database import db, ma

## 実テーブル
class Feed(db.Model): 
    __tablename__ = "feed"
    feed_code = db.Column(db.Integer, primary_key=True) 
    feed_name = db.Column(db.String(), primary_key=False) 
    nutrient_code = db.Column(db.Integer, primary_key=True) 
    amount = db.Column(db.Float , primary_key=False) 

class FeedSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = Feed
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

