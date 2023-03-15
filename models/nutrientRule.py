from api.database import db, ma

## 実テーブル
class NutrientRule(db.Model): 
    __tablename__ = "nutrient_rule"
    nutrient_code = db.Column(db.Integer, primary_key=True) 
    nutrient_name = db.Column(db.String(), primary_key=False) 
    amount_division = db.Column(db.String(), primary_key=False) 
    sex = db.Column(db.String(), primary_key=True) 
    age_low_limit   = db.Column(db.Integer, nullable=True) 
    age_high_limit   = db.Column(db.Integer, nullable=True) 
    amount = db.Column(db.Float , primary_key=False) 
    unit = db.Column(db.String(), primary_key=False) 
    effect = db.Column(db.String(), primary_key=False) 

class NutrientRuleSchema(ma.SQLAlchemyAutoSchema):
      class Meta:
            model = NutrientRule
            load_instance = True



# kiyonagi::DATABASE=> \d nutrient_rule
#                           テーブル"public.nutrient_rule"
#        列        |         タイプ         | 照合順序 | Null 値を許容 | デフォルト
# -----------------+------------------------+----------+---------------+------------
#  nutrient_code   | character varying(100) |          | not null      |
#  nutrient_name   | character varying(100) |          |               |
#  amount_division | character varying(100) |          |               |
#  sex             | character varying(100) |          | not null      |
#  age_low_limit   | integer                |          | not null      |
#  age_high_limit  | integer                |          | not null      |
#  amount          | numeric(10,6)          |          |               |
#  unit            | character varying(20)  |          |               |
#  effect          | character varying(20)  |          |               |
# インデックス:
#     "nutrient_rule_pkey" PRIMARY KEY, btree (nutrient_code, sex, age_low_limit, age_high_limit)
