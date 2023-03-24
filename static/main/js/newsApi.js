window.onload = function(){
  //getHeadlines("us");
  return;
}


let radio = document.querySelectorAll(`input[type='radio'][name='radioCountry']`);
for (let target of radio) {
	target.addEventListener('change', function () {
    getHeadlines(target.value);
  });
}

function getHeadlines(country){
    fetch('/getHeadlines/' + country.split("_")[0] + "/" + country.split("_")[1], {
      method: 'GET',
      'Content-Type': 'application/json'
    })
    .then(res => res.json())
    .then(jsonData => {
      var list = jsonData.articles; //JSON.parse(jsonData);
      var divArea = document.getElementById("divHeadLine");
      divArea.innerHTML = "";
      var divRow;
      for(let i in list){
        if(i == -0 ||  (i % 4) == 0){
          divRow = document.createElement("div");
          divRow.classList.add("row");
        }

        var divCol = document.createElement("div");
        divCol.classList.add("col-3","card");
        var title = document.createElement("p");
        var divAuthor = document.createElement("div");
        //var author = document.createElement("span");
        var image = document.createElement("img");
        var url = document.createElement("a");
        // var divFrame = document.createElement("div");
        // var iframe = document.createElement("iframe");
        title.innerText = list[i].title;
        //author.innerText = list[i].author;
        //author.classList.add("badge","bg-primary");
        //divAuthor.appendChild(author);
        divAuthor.appendChild(createBadgeSpan(list[i].author));
        image.src = list[i].urlToImage;
        url.innerText = list[i].title;
        url.href = list[i].url;
        url.target = "_blank";
        // divFrame.classList.add("embed-responsive","embed-responsive-16by9");
        // iframe.classList.add("embed-responsive-item");
        // iframe.src = list[i].url;
        // iframe.setAttribute("frameborder","0");
        // iframe.setAttribute("allowfullscreen","");
        // iframe.style.border = "0";
        // divFrame.appendChild(iframe);

        divCol.appendChild(divAuthor);
        //divCol.appendChild(title);
        if(list[i].urlToImage!=null){
          divCol.appendChild(image);
        }
        divCol.appendChild(url);
        // divCol.appendChild(divFrame);

        divRow.appendChild(divCol);

        if(i == -0 ||  (i % 4) == 0){
          divArea.appendChild(divRow);
        }
      }
    })
    .catch(error => { 
      console.log(error)
    });
  
}

// <p>Bootstrapでレスポンシブにして埋め込んだ場合</p>
// <div class="embed-responsive embed-responsive-16by9">
//   <iframe class="embed-responsive-item" src="http://kiyonagi.jp/?p=5254" frameborder="0" style="border:0" allowfullscreen></iframe>
// </div>

// <span class="badge bg-primary">Primary</span>
// <span class="badge bg-secondary">Secondary</span>
// <span class="badge bg-success">Success</span>
// <span class="badge bg-danger">Danger</span>
// <span class="badge bg-warning text-dark">Warning</span>
// <span class="badge bg-info text-dark">Info</span>
// <span class="badge bg-light text-dark">Light</span>
// <span class="badge bg-dark">Dark</span>

function createBadgeSpan(author){

  var n = 0;
  if(author == null){
    n = 0;
  } else{
    n = author.length % 8;
  }
  var span = document.createElement("span");
  span.classList.add("badge","bg-primary");
  span.innerText = author;
  
  if(n==0){
    span.classList.add("bg-primary");
  } else if (n==1){
    span.classList.add("bg-success");
  } else if (n==2){
    span.classList.add("bg-danger");
  } else if (n==3){
    span.classList.add("bg-warning", "text-dark");
  } else if (n==4){
    span.classList.add("bg-info", "text-dark");
  } else if (n==5){
    span.classList.add("bg-info", "text-dark");
  } else if (n==6){
    span.classList.add("bg-light", "text-dark");
  } else if (n==7){
    span.classList.add("bg-dark");
  }

  return span
}

// articles
// : 
// Array(20)
// 0
// : 
// author
// : 
// "読売新聞オンライン"
// content
// : 
// null
// description
// : 
// null
// publishedAt
// : 
// "2023-03-22T23:57:00Z"
// source
// : 
// {id: 'google-news', name: 'Google News'}
// title
// : 
// "WBC決勝、侍ジャパン大谷翔平が奪った三振は「0・39%」の快挙 - 読売新聞オンライン"
// url
// : 
// "https://news.google.com/rss/articles/CBMiOWh0dHBzOi8vd3d3LnlvbWl1cmkuY28uanAvc3BvcnRzL3diYy8yMDIzMDMyMy1PWVQxVDUwMDY5L9IBAA?oc=5"
// urlToImage
// : 
// null
// [[Prototype]]
// : 
// Object
// 1
// : 
// {source: {…}, author: '産経ニュース', title: 'プーチン氏逮捕へ協力促す 米長官、ＩＣＣ加盟国に - 産経ニュース', description: null, url: 'https://news.google.com/rss/articles/CBMiQ2h0dHBzO…yMy1BNVdZM1E2UjdGTlBYR1BCRzVVSVlPUU82VS_SAQA?oc=5', …}
// 2
// : 
// {source: {…}, author: 'ブルームバーグ', title: '【ＦＯＭＣ】声明はＥＣＢの見解と似ている－市場関係者の見方 - ブルームバーグ', description: null, url: 'https://news.google.com/rss/articles/CBMiQ2h0dHBzO…jbGVzLzIwMjMtMDMtMjIvUlJYWFFGVDBHMUtXMDHSAQA?oc=5', …}
// 3
// : 
// {source: {…}, author: 'リアルサウンド', title: '『舞いあがれ！』第121話、貴司（赤楚衛二）が舞（福原遥）に短歌をやめたいと打ち明ける - リアルサウンド', description: null, url: 'https://news.google.com/rss/articles/CBMiNGh0dHBzO…ZpZS8yMDIzLzAzL3Bvc3QtMTI4NjE5NC5odG1sL2FtcA?oc=5', …}
// 4
// : 
// {source: {…}, author: '日本経済新聞', title: 'イエレン米財務長官、預金保険上限引き上げ「検討せず」 - 日本経済新聞', description: null, url: 'https://news.google.com/rss/articles/CBMiPGh0dHBzO…9ER1haUU9HTjIzMEJMMFQyMEMyM0EzMDAwMDAwL9IBAA?oc=5', …}
// 5
// : 
// {source: {…}, author: 'ウェザーニュース', title: '九州・四国で非常に激しい雨 西、東日本の太平洋側で強雨・雷雨に注意 - ウェザーニュース', description: null, url: 'https://news.google.com/rss/articles/CBMiLmh0dHBzO…ld3MuanAvcy90b3BpY3MvMjAyMzAzLzIzMDA3NS_SAQA?oc=5', …}
// 6
// : 
// {source: {…}, author: 'F1-Gate.com', title: 'フェルスタッペン 「視界不良を考慮してF1グリッドルールは変更すべき」 - F1-Gate.com', description: null, url: 'https://news.google.com/rss/articles/CBMiLGh0dHBzO…2ZXJzdGFwcGVuL2YxXzc0MDI1Lmh0bWw_bW9kZT1hbXA?oc=5', …}
// 7
// : 
// {source: {…}, author: 'nhk.or.jp', title: '【随時更新】ロシア ウクライナに軍事侵攻（23日の動き） - nhk.or.jp', description: null, url: 'https://news.google.com/rss/articles/CBMiPmh0dHBzO…MjAyMzAzMjMvYW1wL2sxMDAxNDAwNzA0MTAwMC5odG1s?oc=5', …}
// 8
// : 
// {source: {…}, author: '時事通信ニュース', title: '水素ガス放出で加速か 太陽系外からの小天体―米研究チーム - 時事通信ニュース', description: null, url: 'https://news.google.com/rss/articles/CBMiNWh0dHBzO…YW1wL2FydGljbGU_az0yMDIzMDMyMzAwMDM1Jmc9aW50?oc=5', …}
// 9
// : 
// {source: {…}, author: 'nhk.or.jp', title: '岸田首相がウクライナからチャーター機で帰国 - nhk.or.jp', description: null, url: 'https://news.google.com/rss/articles/CBMiPmh0dHBzO…MjAyMzAzMjMvYW1wL2sxMDAxNDAxNjc0MTAwMC5odG1s?oc=5', …}
// 10
// : 
// {source: {…}, author: 'MITテクノロジーレビュー', title: '小惑星「リュウグウ」の試料からRNAの核酸塩基を検出＝北大など - MITテクノロジーレビュー', description: null, url: 'https://news.google.com/rss/articles/CBMiNGh0dHBzO…yZXZpZXcuanAvbi8yMDIzLzAzLzIzLzMwMjE3MC_SAQA?oc=5', …}
// 11
// : 
// {source: {…}, author: '産経ニュース', title: 'トランプ氏の審理延期 起訴是非判断ずれ込みも ポルノ女優口止め料疑惑 - 産経ニュース', description: null, url: 'https://news.google.com/rss/articles/CBMiQ2h0dHBzO…Sko1NUU0TTRTSzVWSTNHTkEvP291dHB1dFR5cGU9YW1w?oc=5', …}
// 12
// : 
// {source: {…}, author: 'PC Watch', title: '【特集】 どこまで進化した？各社の4K Webカメラの画質を比較 - PC Watch', description: null, url: 'https://news.google.com/rss/articles/CBMiPmh0dHBzO…b2NzL3RvcGljL2ZlYXR1cmUvMTQ4NzYyMy5odG1s0gEA?oc=5', …}
// 13
// : 
// {source: {…}, author: 'tenki.jp', title: '23日の花粉飛散予想 東京は少ない 西日本はヒノキ花粉開始 非常に多い所も(気象予報士 小野 聡子 2023年03月23日) - tenki.jp', description: null, url: 'https://news.google.com/rss/articles/CBMiN2h0dHBzO…FzdGVyL3Nfb25vLzIwMjMvMDMvMjMvMjI0MDkuaHRtbA?oc=5', …}
// 14
// : 
// {source: {…}, author: 'TBS NEWS DIG Powered by JNN', title: '【ライブ】朝のニュース(Japan News Digest Live) | TBS NEWS DIG（3月23日） - TBS NEWS DIG Powered by JNN', description: null, url: 'https://news.google.com/rss/articles/CCAiCzV6OFdvdVhvUTZZmAEB?oc=5', …}
// 15
// : 
// {source: {…}, author: '読売新聞オンライン', title: 'ＮＹダウ終値５３０ドル安、ＦＲＢ利上げによる景気後退を懸念 - 読売新聞オンライン', description: null, url: 'https://news.google.com/rss/articles/CBMiNmh0dHBzO…AvZWNvbm9teS8yMDIzMDMyMy1PWVQxVDUwMDYzL9IBAA?oc=5', …}
// 16
// : 
// {source: {…}, author: 'nhk.or.jp', title: 'ゼレンスキー大統領 激戦地バフムトを訪問 兵士を激励 - nhk.or.jp', description: null, url: 'https://news.google.com/rss/articles/CBMiPmh0dHBzO…MjAyMzAzMjMvYW1wL2sxMDAxNDAxNjY5MTAwMC5odG1s?oc=5', …}
// 17
// : 
// {source: {…}, author: '毎日新聞', title: '袴田事件 検察、再審公判で有罪立証見送りへ 早期の無罪決着か - 毎日新聞', description: null, url: 'https://news.google.com/rss/articles/CBMiOWh0dHBzO…MvMjAyMzAzMjIvazAwLzAwbS8wNDAvNDQ4MDAwY9IBAA?oc=5', …}
// 18
// : 
// {source: {…}, author: 'モデルプレス', title: '西野七瀬、坂口健太郎に心惹かれていく新聞記者役で「Dr.チョコレート」出演決定 - モデルプレス', description: null, url: 'https://news.google.com/rss/articles/CBMiJGh0dHBzO…h0dHBzOi8vbWRwci5qcC9kcmFtYS9hbXAvMzY2MjY4MQ?oc=5', …}
// 19
// : 
// {source: {…}, author: 'nhk.or.jp', title: 'イギリス 劣化ウラン弾をウクライナに供与へ ロシアは反発 - nhk.or.jp', description: null, url: 'https://news.google.com/rss/articles/CBMiPmh0dHBzO…MjAyMzAzMjMvYW1wL2sxMDAxNDAxNjcxMTAwMC5odG1s?oc=5', …}
// length
// : 
// 20
// [[Prototype]]
// : 
// Array(0)
// status
// : 
// "ok"
// totalResults
// : 
// 29
// [[Prototype]]
// : 
// Object
// function hoge(){
  
//   fetch('/getPlatformInfo', {
//     method: 'GET',
//     'Content-Type': 'application/json'
//   })
//   .then(res => res.json())
//   .then(jsonData => {
//     var list = jsonData.aaData;
//     var table = document.getElementById("simpleTable");
//     var thead = document.createElement("thead");
//     var tbody = document.createElement("tbody");
//     var thA = document.createElement("th");
//     var thB = document.createElement("th");
//     thA.innerText = "プロパティ";
//     thB.innerText = "値";
//     thead.appendChild(thA);
//     thead.appendChild(thB);
//     table.appendChild(thead);
//     for(let i in list){
//       var tr = document.createElement("tr");
//       var tdA = document.createElement("td");
//       var tdB = document.createElement("td");
//       tdA.innerText = list[i].property;
//       tdB.innerText = list[i].value;
//       tr.appendChild(tdA);
//       tr.appendChild(tdB);
//       tbody.appendChild(tr);
//     }
//     table.appendChild(tbody);
//   })
//   .catch(error => { 
//     console.log(error)
//   });

// }
