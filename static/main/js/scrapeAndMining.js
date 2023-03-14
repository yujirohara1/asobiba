window.onload = function(){
  tryScrapeTitle();
  return;
}

var rankList = {"dummy":0};

function getBlogBody(rowIndex){
  var table = document.getElementById("simpleTable");
  var id = table.rows[rowIndex].cells[0].innerText;

  document.getElementById("divTableWrapper").scrollTo({
    top: table.rows[rowIndex].offsetTop-200,
    left: 0,
    behavior: 'smooth'
  });

  if(rowIndex >= (table.rows.length)){
    return;
  }

  fetch('/getMiningResult/' + id, {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var table = document.getElementById("simpleTable");
    table.rows[rowIndex].cells[2].innerText = jsonData.aaData[0].words;
    getBlogBody(rowIndex + 1);
    createRankTable(jsonData.aaData[0].words);
  })
  .catch(error => { 
    console.log(error)
  });
}

function createRankTable(words){
  var wordsArr =  words.split(" ");

  for(let i=0; i<wordsArr.length; i++){
    if(wordsArr[i] != ""){
      if (wordsArr[i] in rankList) {
        rankList[wordsArr[i]] = rankList[wordsArr[i]] + 1;
      } else { 
        rankList[wordsArr[i]] = 1;
      }
    }
  }

  var pairs = Object.entries(rankList);
  pairs.sort(function(p1, p2){
    var p1Val = p1[1], p2Val = p2[1];
    return p2Val - p1Val;
  })

  var tbody = document.getElementById("rankTableBody");
  tbody.innerHTML="";
  for(let i=0; i<100; i++){
    var tr = document.createElement('tr');
    var tdA = document.createElement('td');
    var tdB = document.createElement('td');
    tdA.innerText = pairs[i][0];
    tdB.innerText = pairs[i][1];
    tr.appendChild(tdA);
    tr.appendChild(tdB);
    tbody.appendChild(tr);
  }
}

document.getElementById("btnStart").addEventListener('click', function(){
  getBlogBody(0);
});


function tryScrapeTitle(){
  var btn = document.getElementById("btnStart");
  btn.classList.add("disabled");

  fetch('/tryScrapeTop', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = jsonData.aaData; //JSON.parse();
    var table = document.getElementById("simpleTable");
    var thead = document.createElement('thead');
    var thA = document.createElement('th');
    var thB = document.createElement('th');
    var thC = document.createElement('th');
    thA.innerText = "記事ID";
    thB.innerText = "タイトル";
    thC.innerText = "形態素解析";
    
    thead.appendChild(thA);
    thead.appendChild(thB);
    thead.appendChild(thC);
    table.appendChild(thead);
  
    var tbody = document.createElement('tbody');
    for(let i in list){
      var tr = document.createElement('tr');
      var tdA = document.createElement('td');
      var tdB = document.createElement('td');
      var tdC = document.createElement('td');
      tdA.innerText = list[i].id;
      tdB.innerText = list[i].title;
      tdC.innerText = "";
      tr.appendChild(tdA);
      tr.appendChild(tdB);
      tr.appendChild(tdC);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    btn.classList.remove("disabled");

  })
  .catch(error => { 
    console.log(error)
  });

}
