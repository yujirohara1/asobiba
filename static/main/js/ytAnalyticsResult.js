window.onload = function(){
  // createWelcomMessage();

  // createTableLeftTop();
  // createTableLeftMiddle();
  var resultJson = document.getElementById("resultJson").innerText;

  console.log(resultJson);
  // alert(document.getElementById("resultJson").value);
  // alert(a);
  // createTableCenterTop();
  
  var list = JSON.parse(resultJson);

  //var hdText = ["取引先名", "タイトル", "出現回数", "初回発生日"];
  var hdColWidth = ["20%","20%","20%","20%", "20%"];

  var hdText = [];
  for(let c in list.columnHeaders){
    hdText.push(list.columnHeaders[c].name);
  }

  var tableId = initTable("divA",hdText, hdColWidth,3);
  var tbody = document.getElementById(tableId+"Body");
  for(let i in list.rows){
    var trow = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    td0.innerText = list.rows[i][0];
    td1.innerText = list.rows[i][1];
    td2.innerText = list.rows[i][2];
    td3.innerText = list.rows[i][3];
    td4.innerText = list.rows[i][4];
    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
  }

  return;

}



/*
|| HTMLTableを作る
*/
function initTable(tableDivId, hdText, hdWidth, heightRatio){
  var tableId = tableDivId.replace("div","htmlTable");
  var table = document.createElement("table");
  table.id = tableId;

  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  tbody.id = tableId + "Body";
  thead.appendChild(createTableHeader(hdText, hdWidth));

  table.appendChild(thead);
  table.appendChild(tbody);

  table.classList.add("table", "table-bordered", "table_sticky", "table-hover", "fs-6");
  table.style.height = "calc(100vh/" + heightRatio + ")";

  var tmp = document.getElementById(tableDivId);
  while(tmp.lastChild){
    tmp.removeChild(tmp.lastChild);
  }

  document.getElementById(tableDivId).appendChild(table);

  return tableId;
}


//テーブルの見出し行を作成する。戻したDOMはtheadにappendされる想定。
function createTableHeader(hdText, width){
  let trow = document.createElement('tr');
  for (let hd in hdText){
    var thA = document.createElement('th');
    thA.innerHTML = hdText[hd];
    thA.style.textAlign = "center";
    thA.style.verticalAlign = "middle";
    if(width!=null){
      try{thA.style.width=width[hd];}catch(e){
        openErrorMessageDialog(e.message);
      }
    }
    trow.appendChild(thA);
  }
  return trow;
}
