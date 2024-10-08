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
from marshmallow_sqlalchemy import ModelSchema
from api.database import db, ma
from sqlalchemy.sql import text
from sqlalchemy import distinct
from sqlalchemy import asc
from models.nutrientRule import NutrientRule, NutrientRuleSchema
from models.feed import Feed, FeedSchema
from models.autoSaveInterval import AutoSaveInterval, AutoSaveIntervalSchema
from models.weblogArticle import WeblogArticle, WeblogArticleSchema
from decimal import Decimal

import platform
import cv2
import random
import numpy as np
from matplotlib import pyplot as plt

# import torch
# from torchvision import models, transforms
# from PIL import Image
import pkgutil
import pkg_resources
import pandas as pd
import openpyxl

from newsapi import NewsApiClient

# import MeCab
# import matplotlib.pyplot as plt
# import re
# import nlplot
# from plotly.offline import iplot

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
mapDirectionsApiKey = os.environ.get("MAP_DIRECTIONS_API_KEY") 
newsApiKey = os.environ.get("NEWS_API_KEY") 



# db_uri = "postgresql://postgres:yjrhr1102@localhost:5432/newdb3" #開発用
db_uri = os.environ.get('DATABASE_URL') #本番用
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
ma.init_app(app)


@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")


@login_manager.user_loader
def load_user(user_id):
  return users.get(int(user_id))


class User(UserMixin):
    def __init__(self, id, user_id, user_nm, password):
        self.id = id
        self.user_id = user_id
        self.user_nm = user_nm
        self.password = password

users = {}





# coOccurrenceNetwork
@app.route('/mriData2024Aug', methods=["GET"])
def openWindowMriData2024Aug():
    # url = 'https://newsapi.org/v2/everything'
    # params = {
    # sources = newsapi.get_sources()

    return render_template("mriData2024Aug.haml")



# coOccurrenceNetwork
@app.route('/newsApi', methods=["GET"])
def openWindowNewsApi():
    # url = 'https://newsapi.org/v2/everything'
    # params = {
    #     'q': 'コロナウイルス AND ワクチン',
    #     'sortBy': 'publishedAt',
    #     'pageSize': 100
    # }

    # response = requests.get(url, headers=headers, params=params)
    # print(response.json())

    # return render_template("newsApi.haml")
    # # Init
    # newsapi = NewsApiClient(api_key=newsApiKey)

    # # /v2/top-headlines
    # top_headlines = newsapi.get_top_headlines(
    #                                         country='jp',
    #                                         language=None)

    # # /v2/everything
    # all_articles = newsapi.get_everything(q='コロナ',
    #                                     from_param='2023-03-14',
    #                                     to='2023-03-24',
    #                                     language=None,
    #                                     sort_by='relevancy')

    # # /v2/top-headlines/sources
    # sources = newsapi.get_sources()

    return render_template("newsApi.haml")


@app.route('/getHeadlines/<country>/<language>', methods=["GET"])
def getHeadlines(country, language):
    
    if language=='None':
        language = None

    newsapi = NewsApiClient(api_key=newsApiKey)
    top_headlines = newsapi.get_top_headlines(country=country, language=language)
    return json.dumps(top_headlines, skipkeys=True, ensure_ascii=False)




# coOccurrenceNetwork
@app.route('/coOccurrenceNetwork', methods=["GET"])
def openWindowCoOccurrenceNetwork():
    return render_template("coOccurrenceNetwork.haml")

@app.route('/getCoOccurrenceNetworkImage', methods=["GET"])
def getCoOccurrenceNetworkImage():
    dictId = {}
    dictId['aaData']=[]
    dictId["aaData"].append(  { 
        "is_authenticated" : "str(current_user.is_authenticated)", 
    } )
    
    docs=[]
    words=[]
    
    datalist = WeblogArticle.query.all()
    # fullText = ""
    for d in datalist:
        #words = words + " " + d.text_body
        tmp = d.text_body.split(" ")
        for w in tmp:
            if isExclusion(w)==False:
                words.append(w)

    c_word = ' '.join(words)

    wordcloud = WordCloud(background_color='white',
                        font_path='NotoSansJP-Regular.otf',
                        width=1200, height=800).generate(c_word)
    ## 結果を画像に保存
    timestamp = datetime.datetime.now()
    timestampStr = timestamp.strftime('%Y%m%d%H%M%S%f')
    filename = getRandomKey() + ".png"
    #filename = "wordcloud_" + timestampStr + "_" + kijiId + ".png"
    filepath = "./tmp/" + filename
    wordcloud.to_file(filepath)
    imgPath = 'tmp/' + filename
    return send_file(imgPath, as_attachment=True, mimetype='image/png', attachment_filename = filename)

def isExclusion(word):
    exclusionList = ["という", "こういう", "それでも","において","すぎ",
        "ちゃんと", "こうした", "どうして", "いろいろ", "しかし", "", "", "",
        "もらう", "っぽい", "かかる", "とりあえず", "ばかり", "わかり", "", "",
        "にとって", "くれ", "わかり", "感じ", "あたり", "やすい", "もらっ", "",
        "ちょっと", "ところが", "たくさん", "本当は", "やすい", "", "", "",
        "そして", "まずは", "どうやら", "とおり", "つまり", 
        "ちなみに", "たぶん", "それら", "なくなっ", "それ", 
        "かけ", "そもそも", "つけ", "そうした", "こっち", 
        "いろんな", "どっち", "とにかく", "くれる", "", 
        "できる", "みたい", "そういう", "むしろ", "こんな","による","あまり",
        "として", "ところ", "といった", "どんな","について","たとえば",
        "くらい", "らしい", "ほしい", "でき", "わから","ほとんど",
        "しまう", "いつも", "しれ", "られ", "いけ", "しまっ", "あるいは",
        "もちろん", "みんな", "られる", "ながら", "に対して", "すぎる",
        "やっぱり", "わかる", "そんな", "わかっ", "だって", "だから",
        "なんか", "なんて", "すべて", "もっと", "だけど", "ものの","けども"]
    if word in exclusionList:
        return True
    else:
        return False

# directionsApiOfGoogleMap
@app.route('/directionsApiOfGoogleMap', methods=["GET"])
def openWindowDirectionsApiOfGoogleMap():
    return render_template("directionsApiOfGoogleMap.haml")

@app.route('/getDirectionP2Pinfo/<pointA>/<pointB>', methods=["GET"])
def getDirectionP2Pinfo(pointA, pointB):
    res = requests.get("https://maps.googleapis.com/maps/api/directions/json?origin=" + pointA + "&destination=" + pointB + "&mode=walking&key=" + mapDirectionsApiKey)
    return json.dumps(res.text, skipkeys=True, ensure_ascii=False)




# blendModeOfCss
@app.route('/blendModeOfCss', methods=["GET"])
def openWindowBlendModeOfCss():
    return render_template("blendModeOfCss.haml")

# bulkChangeOfExcelSheetName
@app.route('/bulkChangeOfExcelSheetName', methods=["GET"])
def openWindowBulkChangeOfExcelSheetName():
    return render_template("bulkChangeOfExcelSheetName.haml")

@app.route('/modifiedExcelDownload', methods=["PUT"])
def modifiedExcelDownload():
    
    files = request.files['excelFile']
    filenameOrg = files.filename
    idx = len(files.filename.split("."))-1
    extention = files.filename.split(".")[idx]
    filenameKey = getRandomKey()
    filename = filenameKey + "." + extention
    files.save('tmp/' + filename)

    wb = openpyxl.load_workbook('tmp/' + filename)

    shidx = 0
    for sh in wb:
        wb[sh.title].title = request.form["sheetName" + str(shidx)] #"test" + str(shidx)
        shidx = shidx + 1

    filename = filenameKey + "2." + extention
    wb.save('tmp/' + filename)


    XLSX_MIMETYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    return send_file('tmp/' + filename, as_attachment=True, mimetype=XLSX_MIMETYPE, attachment_filename = filenameOrg + '_modified.xlsx')

@app.route('/uploadFiles',methods=["PUT"])
def uploadFiles():
    files = request.files['excelFile']
    filenameOrg = files.filename
    idx = len(files.filename.split("."))-1
    extention = files.filename.split(".")[idx]
    filename = getRandomKey() + "." + extention
    files.save('tmp/' + filename)

    retList = []
    shidx = 0

    try:
        xlFile = pd.read_excel(files, sheet_name=None)
        for sh in xlFile:
            shidx = shidx + 1
            retList.append(
            {
                "rowSize":str(xlFile[sh].values.shape[0]),
                "colSize":str(xlFile[sh].values.shape[1]),
                "sheetIdx":shidx,
                "sheetName":sh,
                "fileName":filename,
                "fileNameOrg":filenameOrg
            }
            )

    except:
        pass

    return jsonify({'data': json.dumps(retList)})



# handlingOfFlaskLogin
@app.route('/handlingOfFlaskLogin', methods=["GET"])
def openWindowHandlingOfFlaskLogin():
    return render_template("handlingOfFlaskLogin.haml")

@app.route('/callAtLoginRequired', methods=["GET"])
@login_required
def callAtLoginRequired():
    return "1"



@app.route('/confirmStatus', methods=["GET"])
def confirmStatus():
    # return render_template("confirmStatus.haml")
    dictId = {}
    dictId['aaData']=[]
    dictId["aaData"].append(  { 
        "is_authenticated" : str(current_user.is_authenticated), 
        "is_active": str(current_user.is_active) ,
        "is_anonymous": str(current_user.is_anonymous),
        "timestamp" : datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S %f')
    } )

    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)


@app.route('/handleLogin', methods=["GET"])
def handleLogin():
    
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=30)
    id = random.randint(1, 9999999999999999)
    sessionId = session.get("_id")
    users[id] = User(id, sessionId, "dummy", "dummy")
    login_user(users[id])
    session["session_id"] =  session.get("_id")
    
    dictId = {}
    dictId['aaData']=[]
    dictId["aaData"].append(  { 
        "is_authenticated" : str(current_user.is_authenticated), 
        "is_active": str(current_user.is_active) ,
        "is_anonymous": str(current_user.is_anonymous),
        "timestamp" : datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S %f')
    } )

    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)


@app.route('/handleLogout', methods=["GET"])
def handleLogout():
    logout_user()

    dictId = {}
    dictId['aaData']=[]
    dictId["aaData"].append(  { 
        "is_authenticated" : str(current_user.is_authenticated), 
        "is_active": str(current_user.is_active) ,
        "is_anonymous": str(current_user.is_anonymous),
        "timestamp" : datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S %f')
    } )

    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)



# autoSaveByInterval
@app.route('/autoSaveByInterval', methods=["GET"])
def openWindowAutoSaveByInterval():
    returnValue = ""
    if current_user.is_authenticated:
            # session_idからレコード取得
        sql = " "
        sql = sql + "    select              " 
        sql = sql + "        item_id         " 
        sql = sql + "        , item_value    " 
        sql = sql + "    from                " 
        sql = sql + "        auto_save_interval  " 
        sql = sql + "    where               " 
        # sql = sql + "        session_id = '" + current_user.user_id + "'   " 
        sql = sql + "        session_id = '" + session.get("_id") + "'   " 
        sql = sql + "    order by            " 
        sql = sql + "        item_id         " 
        
        resultset=[]
        data_listA = None
        
        if db.session.execute(text(sql)).fetchone() is not None:
            data_listA = db.session.execute(text(sql))

            if data_listA is not None:
                for row in data_listA:
                    returnValue = returnValue + row["item_id"] + ":" + row["item_value"] + ","
        returnValue = returnValue + "item_id:item_value"

    else:
        session.permanent = True
        app.permanent_session_lifetime = timedelta(minutes=30)
        id = random.randint(1, 9999999999999999)
        sessionId = session.get("_id")
        users[id] = User(id, sessionId, "dummy", "dummy")
        login_user(users[id])
        session["session_id"] =  session.get("_id")

    return render_template("autoSaveByInterval.haml", result=returnValue)

@app.route('/autoSaveProcess/<params>', methods=["GET"])
#@login_required
def autoSaveProcess(params):
    vals = params.split(",")
    # AutoSaveInterval.query.filter(AutoSaveInterval.session_id==current_user.user_id).delete()
    AutoSaveInterval.query.filter(
        AutoSaveInterval.session_id==session.get("_id")
    ).delete()

    dictId = {}
    dictId['aaData']=[]

    for v in vals:
        autoSaveInterval = AutoSaveInterval()
        autoSaveInterval.session_id = session.get("_id")#current_user.user_id
        autoSaveInterval.item_id = v.split(":")[0]
        autoSaveInterval.item_value = v.split(":")[1]
        db.session.add(autoSaveInterval)
        
        dictId["aaData"].append(  { 
            "session_id" : session.get("_id"), #current_user.user_id, 
            "item_id":  v.split(":")[0],
            "item_value":  v.split(":")[1]
        } )

    # データを確定
    db.session.commit()
    
    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)





# getLibraryCollection
@app.route('/getLibraryCollection', methods=["GET"])
def openWindowGetLibraryCollection():
    return render_template("getLibraryCollection.haml")


@app.route('/getLibraryList', methods=["GET"])
def getLibraryList():
    dictId = {}
    dictId['aaData']=[]
    for _lib in pkg_resources.working_set:
        dictId["aaData"].append(  { "lib_name" : _lib.project_name, "lib_version": _lib.version } )
    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)





# setTimeoutOrSetInterval
@app.route('/setTimeoutOrSetInterval', methods=["GET"])
def openWindowSetTimeoutOrSetInterval():
    return render_template("setTimeoutOrSetInterval.haml")

# notificationPushJS
@app.route('/notificationPushJS', methods=["GET"])
def openWindowNotificationPushJS():
    return render_template("notificationPushJS.haml")


# gettingStartOpenCV
@app.route('/gettingStartOpenCV', methods=["GET"])
def openWindowGettingStartOpenCV():
    return render_template("gettingStartOpenCV.haml")

@app.route('/showOriginalImage', methods=["GET"])
def returnOriginalImageBlob():
    imgPath = 'static/image/pakira.png'
    return send_file(imgPath, as_attachment=True, mimetype='image/png', attachment_filename = 'pakira.png')

@app.route('/showModifyImage/<method>', methods=["GET"])
def returnModifyImageBlob(method):
    returnFilenm = getRandomKey()
    imgPath = 'static/image/pakira.png'
    if method == "grayscale":
        imgBlob = cv2.imread(imgPath, cv2.IMREAD_GRAYSCALE)
        cv2.imwrite("tmp/" + returnFilenm + ".png", imgBlob)

    if method == "blackWhite":
        imgTmp = cv2.imread(imgPath, 0)
        ret, imgBlob = cv2.threshold(imgTmp, 0, 255, cv2.THRESH_OTSU)
        cv2.imwrite("tmp/" + returnFilenm + ".png", imgBlob)

    if method == "resizeHarf":
        imgTmp = cv2.imread(imgPath)
        #ret, imgBlob = cv2.threshold(imgTmp, 0, 255, cv2.THRESH_OTSU)
        imgBlob = cv2.resize(imgTmp, dsize=None, fx=0.5, fy=0.5)
        cv2.imwrite("tmp/" + returnFilenm + ".png", imgBlob)

    if method == "contours":
        imgTmp = cv2.imread(imgPath)
        imgray = cv2.cvtColor(imgTmp,cv2.COLOR_BGR2GRAY)
        ret,thresh = cv2.threshold(imgray,88,255,0)
        contours, hierarchy = cv2.findContours(thresh,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        imgBlob = cv2.drawContours(imgTmp, contours, -1, (0,0,255), 3)
        cv2.imwrite("tmp/" + returnFilenm + ".png", imgBlob)
 
    if method == "cannyEdge":
        imgTmp = cv2.imread(imgPath)
        imgBlob = cv2.Canny(imgTmp,100,200)
        cv2.imwrite("tmp/" + returnFilenm + ".png", imgBlob)

    if method == "histgram":
        imgTmp = cv2.imread(imgPath)
        color = ('b','g','r')
        for i,col in enumerate(color):
            histr = cv2.calcHist([imgTmp],[i],None,[256],[0,256])
            plt.plot(histr,color = col)
            plt.xlim([0,256])
        a = 1
        plt.savefig("tmp/" + returnFilenm + ".png") 

    return send_file("tmp/" + returnFilenm + ".png", as_attachment=True, mimetype='image/png', attachment_filename = returnFilenm + ".png")

def getRandomKey():
   return datetime.datetime.now().strftime('%Y%m%d%H%M%S%f') + "_" + str(random.randint(1, 9999999999999999))


# showHerokuPlatform
@app.route('/showHerokuPlatform', methods=["GET"])
def openWindowShowHerokuPlatform():
    return render_template("showHerokuPlatform.haml")

@app.route('/getPlatformInfo', methods=["GET"])
def getPlatformInfo():

    dictId = {}
    dictId['aaData']=[]
    dictId["aaData"].append(  { "property" : "architecture", "value": platform.architecture() } )
    dictId["aaData"].append(  { "property" : "system", "value": platform.system() } )
    dictId["aaData"].append(  { "property" : "machine", "value": platform.machine() } )
    dictId["aaData"].append(  { "property" : "platform", "value": platform.platform() } )
    dictId["aaData"].append(  { "property" : "processor", "value": platform.processor() } )
    dictId["aaData"].append(  { "property" : "python_build", "value": platform.python_build() } )
    dictId["aaData"].append(  { "property" : "python_compiler", "value": platform.python_compiler() } )
    dictId["aaData"].append(  { "property" : "python_branch", "value": platform.python_branch() } )
    dictId["aaData"].append(  { "property" : "python_implementation", "value": platform.python_implementation() } )
    dictId["aaData"].append(  { "property" : "python_revision", "value": platform.python_revision() } )
    dictId["aaData"].append(  { "property" : "python_version", "value": platform.python_version() } )
    dictId["aaData"].append(  { "property" : "python_version_tuple", "value": platform.python_version_tuple() } )
    dictId["aaData"].append(  { "property" : "release", "value": platform.release() } )
    dictId["aaData"].append(  { "property" : "version", "value": platform.version() } )
    dictId["aaData"].append(  { "property" : "uname", "value": platform.uname() } )
    return json.dumps(dictId, skipkeys=True, ensure_ascii=False)






# calcNutrients
@app.route('/calcNutrients', methods=["GET"])
def openWindowCalcNutrients():
    return render_template("calcNutrients.haml")

@app.route('/getNutrientRule/<sex>/<age>')
def getNutrientRule(sex, age):
    datalist = NutrientRule.query.filter(
        NutrientRule.sex == sex,
        NutrientRule.age_low_limit <= age,
        NutrientRule.age_high_limit >= age,
      ).order_by(
          asc(NutrientRule.nutrient_code)
      ).all()
    datalist_schema = NutrientRuleSchema(many=True)
    return jsonify({'data': datalist_schema.dumps(datalist, ensure_ascii=False, default=decimal_default_proc)})

@app.route('/getSummaryAmount/<feedCodes>')
def getSummaryAmount(feedCodes):

    sql = " "
    sql = sql + "    select                                   " 
    sql = sql + "        nutrient_code                        " 
    sql = sql + "        , sum(amount) sum_amount             " 
    sql = sql + "    from                                     " 
    sql = sql + "        feed                                 " 
    sql = sql + "    where                                    " 
    sql = sql + "        feed_code in (" + feedCodes + ")   " 
    sql = sql + "    group by                                 " 
    sql = sql + "        nutrient_code                       " 
    
    resultset=[]
    data_listA = None
    exist = False
    
    if db.session.execute(text(sql)).fetchone() is not None:
        data_listA = db.session.execute(text(sql))

        if data_listA is not None:
            for row in data_listA:
                resultset.append(
                    {
                        "nutrient_code":row["nutrient_code"], 
                        "amount":row["sum_amount"]
                    }
                )

    # return jsonify({'data': resultset})
    return jsonify({'data': json.dumps(resultset,default=decimal_default_proc)})


@app.route('/getFeetList')
def getFeetList():
    datalist = Feed.query.filter(
      ).order_by(
          asc(Feed.feed_code),
          asc(Feed.nutrient_code)
      ).all()
    datalist_schema = FeedSchema(many=True)
    return jsonify({'data': datalist_schema.dumps(datalist, ensure_ascii=False, default=decimal_default_proc)})



def decimal_default_proc(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError
















# scrapeAndMining
@app.route('/scrapeAndMining', methods=["GET"])
def openWindowScrapeAndMining():
    return render_template("scrapeAndMining.haml")

def insWeblogArticle(id, text):
    try:
        WeblogArticle.query.filter(
            WeblogArticle.article_id==id
        ).delete()

        weblogArticle = WeblogArticle()
        weblogArticle.article_id = id
        weblogArticle.text_body = text
        db.session.add(weblogArticle)
        
        # データを確定
        db.session.commit()
    except:
        pass

    return "1"

@app.route('/getMiningResult/<id>')
def getMiningResult(id):
    
    res = requests.get('http://kiyonagi.jp/?p=' + str(id))
    soup = BeautifulSoup(res.text, 'html.parser')
    c_word = ""
    if soup.find(class_="post-full post-full-summary") is not None:
        body_text = soup.find(class_='entry-content').get_text()
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

        insWeblogArticle(id, c_word)

    
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
