from flask import Flask, render_template, g, request, redirect, url_for, Response, abort, session, jsonify, make_response, send_file
from hamlish_jinja import HamlishExtension
from werkzeug.datastructures import ImmutableDict
import os
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user

# from user import User
from collections import defaultdict
from datetime import timedelta
import datetime
from flask_bootstrap import Bootstrap
import json
import csv
import requests
from bs4 import BeautifulSoup
import collections
from janome.tokenizer import Tokenizer
from wordcloud import WordCloud
from pip._vendor import cachecontrol

import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from google_auth_oauthlib.flow import Flow
import pathlib


from oauthlib.oauth2 import WebApplicationClient

import openai


class FlaskWithHamlish(Flask):
    jinja_options = ImmutableDict(
        extensions=[HamlishExtension]
    )
app = FlaskWithHamlish(__name__)
bootstrap = Bootstrap(app)

login_manager = LoginManager()
login_manager.init_app(app)

app.secret_key = "kiyonagi.herokuapp.com"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# 設定情報
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)
client = WebApplicationClient(GOOGLE_CLIENT_ID)

openai.api_key = os.environ.get("OPENAI_API_KEY") #os.environ["OPENAI_API_KEY"]

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")


@login_manager.user_loader
def load_user(user_id):
  return users.get(int(user_id))




# scrapeAndMining
@app.route('/scrapeAndMining', methods=["GET"])
def openWindowScrapeAndMining():
    return render_template("scrapeAndMining.haml")


@app.route('/getMiningResult/<id>')
def getMiningResult(id):
    
    res = requests.get('http://kiyonagi.jp/?p=' + str(id))
    soup = BeautifulSoup(res.text, 'html.parser')
    c_word = ""
    if soup.find(class_="post-full post-full-summary") is not None:
    #     title_text = soup.find(class_='entry-title').get_text()
        body_text = soup.find(class_='entry-content').get_text()
        #     cate_text = soup.find(class_='cat-links').get_text()
        #     date_text = ""
        #     if soup.find(class_='entry-date') is not None:
        #       date_text = formatDate(soup.find(class_='entry-date').get_text())

        #     # 文字の整形（改行削除）
        text = "".join(body_text.splitlines())

        # 単語ごとに抽出
        docs=[]
        t = Tokenizer()
        tokens = t.tokenize(text)
        for token in tokens:
            if len(token.base_form) > 2:
                docs.append(token.surface)
        
        c_word = ' '.join(docs)
    
    #     filepath = ''
    #     filename = ''
    #     if c_word != '':
    #       wordcloud = WordCloud(background_color='white',
    #                           font_path='NotoSansJP-Regular.otf',
    #                           width=800, height=400).generate(c_word)
    #       ## 結果を画像に保存
    #       timestamp = datetime.datetime.now()
    #       timestampStr = timestamp.strftime('%Y%m%d%H%M%S%f')
    #       filename = "wordcloud_" + timestampStr + "_" + kijiId + ".png"
    #       filepath = "./static/image/" + filename
    #       wordcloud.to_file(filepath)

    #     dictId["aaData"].append( \
    #       {"id":kijiId, \
    #         "title":title_text.replace("\n",""), \
    #         "kaiseki": c_word, \
    #           "filepath": filename, \
    #           "category": cate_text.replace("\n",""), \
    #             "tokoDate": date_text, \
    #               "honbun": body_text.replace("\n","")} 
    #         )
    #   # kijiId+=1

    dictId = {}
    dictId['aaData']=[]
    dictId["aaData"].append( \
        {
            "words": c_word
        } 
    )
    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)

@app.route('/tryScrapeTop')
def tryScrapeTop():

    dictId = {}
    dictId['aaData']=[]

    #res = requests.get('http://kiyonagi.jp/?p=' + str(kijiId))
    res = requests.get('http://kiyonagi.jp/')
    soup = BeautifulSoup(res.text, 'html.parser')

    for article in soup.find_all('article'):
        # post-5003
        tmpArr = article.attrs.get("id").split("-")
        if len(tmpArr) == 2:
            dictId["aaData"].append( \
                {
                    "id":tmpArr[1], \
                    "title": article.find(class_="entry-title").find("a").contents[0]
                } 
            )


    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)




# gpt3 api 
@app.route('/gpt3AtOpenAIApi', methods=["GET"])
def openWindowGpt3AtOpenAIApi():
    return render_template("gpt3AtOpenAIApi.haml")

@app.route('/sendMessageAndGetAnswer/<message>/<tone>')
def sendMessageAndGetAnswer(message, tone):
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    max_tokens=100,
    messages=[
        {"role": "system", "content": tone + "で回答してください。"},
        {"role": "user", "content": message},
    ],
    )

    answer = response.choices[0]["message"]["content"].strip()
    tmp = {}
    tmp['aaData']=[]
    tmp["aaData"].append( \
      {"answer":answer} 
    )
    return json.dumps(tmp, skipkeys=True, ensure_ascii=False)



# GoogleOAuth 
@app.route('/loginAtGoogleAuth', methods=["GET"])
def openWindowLoginAtGoogleAuth():
    return render_template("loginAtGoogleAuth.haml")


@app.route('/startLoginAtGoogleAuth', methods=["GET"])
def startLoginAtGoogleAuth():
    
    # 認証用のエンドポイントを取得する
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # ユーザプロファイルを取得するログイン要求
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )

    tmp = {}
    tmp['aaData']=[]
    tmp["aaData"].append( \
      {"url":request_uri} 
    )

    return json.dumps(tmp, skipkeys=True, ensure_ascii=False)
    # return redirect(request_uri)
    
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@app.route("/startLoginAtGoogleAuth/callback")
def callback():
    status = "failed"
    try:
        # Googleから返却された認証コードを取得する
        code = request.args.get("code")

        #トークンを取得するためのURLを取得する
        google_provider_cfg = get_google_provider_cfg()
        token_endpoint = google_provider_cfg["token_endpoint"]

        # トークンを取得するための情報を生成し、送信する
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url, 
            redirect_url=request.base_url,
            code=code,
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )

        # トークンをparse
        client.parse_request_body_response(json.dumps(token_response.json()))

        # トークンができたので、GoogleからURLを見つけてヒットした、
        # Googleプロフィール画像やメールなどのユーザーのプロフィール情報を取得
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)

        # メールが検証されていれば、名前、email、プロフィール画像を取得します
        tmp = []
        if userinfo_response.json().get("email_verified"):

            tmp.append({"attr":"unique_id", "value":userinfo_response.json()["sub"]})
            tmp.append({"attr":"email", "value":userinfo_response.json()["email"]})
            tmp.append({"attr":"picture", "value":userinfo_response.json()["picture"]})
            tmp.append({"attr":"given_name", "value":userinfo_response.json()["given_name"]})
            tmp.append({"attr":"email_verified", "value":userinfo_response.json()["email_verified"]})
            status = "success"
        else:
            status = "failed"

    except:
        status = "failed"

    return render_template("loginAtGoogleAuth.haml",status=status, responseJson=json.dumps(tmp,ensure_ascii=False))



# ルートパス
@app.route('/', methods=["GET", "POST"])
def main():
  return render_template('index.haml')


if __name__ == "__main__":
    app.run(debug=True)
