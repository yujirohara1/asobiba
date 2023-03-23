from api.database import db, ma

## 実テーブル
class WeblogArticle(db.Model): 
    __tablename__ = "weblog_article"
    article_id = db.Column(db.Integer, primary_key=True) 
    text_body = db.Column(db.String(), primary_key=False) 

class WeblogArticleSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = WeblogArticle
            load_instance = True

# kiyonagi::DATABASE=> \d weblog_article
#                         テーブル"public.weblog_article"
#      列     |          タイプ          | 照合順序 | Null 値を許容 | デフォルト
# ------------+--------------------------+----------+---------------+------------
#  article_id | integer                  |          |               |
#  text_body  | character varying(10000) |          |               |
