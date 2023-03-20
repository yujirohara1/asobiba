var sakas = [
  "",
  "三分坂",
  "薬研坂",
  "丹後坂",
  "本氷川坂",
  "南部坂",
  "稲荷坂",
  "牛鳴坂",
  "弾正坂",
  "氷川坂",
  "転坂",
  "円通寺坂",
  "紀伊国坂",
  "乃木坂",
  "檜坂",
  "新坂",
  "九郎九坂",
  "桜坂",
  "霊南坂",
  "福吉坂",
];

var sakas_direction_words = [
  "",
  "三分坂",
  "薬研坂",
  "丹後坂",
  "本氷川坂",
  "南部坂 東京都港区赤坂２丁目２２−１",
  "稲荷坂 東京都港区赤坂７丁目６−５５",
  "牛鳴坂",
  "弾正坂",
  "氷川坂",
  "転坂",
  "円通寺坂 東京都港区赤坂４丁目１３",
  "紀伊国坂",
  "乃木坂 乃木公園",
  "檜坂",
  "新坂 東京都港区赤坂８丁目６−３３",
  "九郎九坂",
  "桜坂 東京都港区赤坂１丁目１１ 桜坂",
  "霊南坂",
  "福吉坂",
];

window.onload = function(){
  createSakaTable();
  document.getElementById("btnCalcStart").classList.add("disabled");
  document.getElementById("startPoint").classList.add("disabled");
  return;
}

function createSakaTable(){
  var table = document.getElementById("simpleTable");
  table.innerHTML = "";
  var tbody = document.createElement("tbody");
  for(let i=0; i<20; i++){
    var tr = document.createElement("tr");
    for(let j=0; j<20; j++){
      var td = document.createElement("td");
      var tdText = "";
      if(i==0 && j==0){
        td.innerText = "";
      } else if(i==0 && j!=0){
        td.innerText = sakas[j];
        td.style.setProperty("writing-mode","vertical-rl"); //writing-mode: vertical-rl;
      } else if(i!=0 && j==0){
        td.innerText = sakas[i];
      } else if(i==j){
        td.style.backgroundColor = "#d3d3d3";
      } else {
        td.id = "td_" + i + "_" + j;
        td.innerText = ""; //executeDirectionApi(sakas[i], sakas[j]);
        td.classList.add("dummyClass");
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
}


document.getElementById("btnGetP2Pinfo").addEventListener('click', function(){
  //createSakaTable();
  var tds = document.querySelectorAll(".dummyClass");
  for(let i in tds){
    if(!isNaN(i)){
      var tmpArr;
      try{
        tmpArr = tds[i].id.split("_");
      }catch(e){
        console.log(e);
      }
      if(tmpArr.length==3){
        //executeDirectionApi(tds[i].id, sakas_direction_words[tmpArr[1]], sakas_direction_words[tmpArr[2]]);
        document.getElementById(tds[i].id).innerText = keyValueMap.get(tds[i].id);
        keyValueMap
      }
    }
  }
  createStartPointSelct();
});

function executeDirectionApi(tdId, pointA, pointB){
  fetch('/getDirectionP2Pinfo/' + pointA + "/" + pointB, {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = JSON.parse(jsonData); //jsonData;
    document.getElementById(tdId).innerText = list.routes[0].legs[0].duration.text;
  })
  .catch(error => { 
    console.log(error)
  });

}



function createStartPointSelct(){
  var select = document.getElementById("startPointSelect");
  select.innerHTML = "";
  var opt = document.createElement("option");

  opt.value = "dummy";
  opt.innerText = "（スタート地点を選択）";
  select.appendChild(opt)

  for(let i in sakas){
    if(isNaN(i)==false && i != 0){
      var opt = document.createElement("option");
      opt.value = sakas[i];
      opt.innerText = sakas[i];
      select.appendChild(opt)
    }
  }
}




document.getElementById("startPointSelect").addEventListener('change', function() {
  var select = document.getElementById("startPointSelect");
  if(select.value == "dummy"){
    document.getElementById("btnCalcStart").classList.add("disabled");
  } else {
    document.getElementById("btnCalcStart").classList.remove("disabled");
  }


});

var keyValueMap = new Map();



keyValueMap.set("td_1_2", "5 mins");
keyValueMap.set("td_1_3", "7 mins");
keyValueMap.set("td_1_4", "7 mins");
keyValueMap.set("td_1_5", "10 mins");
keyValueMap.set("td_1_6", "6 mins");
keyValueMap.set("td_1_7", "9 mins");
keyValueMap.set("td_1_8", "10 mins");
keyValueMap.set("td_1_9", "6 mins");
keyValueMap.set("td_1_10", "6 mins");
keyValueMap.set("td_1_11", "4 mins");
keyValueMap.set("td_1_12", "14 mins");
keyValueMap.set("td_1_13", "10 mins");
keyValueMap.set("td_1_14", "7 mins");
keyValueMap.set("td_1_15", "9 mins");
keyValueMap.set("td_1_16", "11 mins");
keyValueMap.set("td_1_17", "16 mins");
keyValueMap.set("td_1_18", "20 mins");
keyValueMap.set("td_1_19", "9 mins");
keyValueMap.set("td_2_1", "5 mins");
keyValueMap.set("td_2_3", "6 mins");
keyValueMap.set("td_2_4", "12 mins");
keyValueMap.set("td_2_5", "15 mins");
keyValueMap.set("td_2_6", "5 mins");
keyValueMap.set("td_2_7", "6 mins");
keyValueMap.set("td_2_8", "5 mins");
keyValueMap.set("td_2_9", "10 mins");
keyValueMap.set("td_2_10", "11 mins");
keyValueMap.set("td_2_11", "3 mins");
keyValueMap.set("td_2_12", "10 mins");
keyValueMap.set("td_2_13", "13 mins");
keyValueMap.set("td_2_14", "12 mins");
keyValueMap.set("td_2_15", "5 mins");
keyValueMap.set("td_2_16", "6 mins");
keyValueMap.set("td_2_17", "21 mins");
keyValueMap.set("td_2_18", "25 mins");
keyValueMap.set("td_2_19", "12 mins");
keyValueMap.set("td_3_1", "8 mins");
keyValueMap.set("td_3_2", "6 mins");
keyValueMap.set("td_3_4", "15 mins");
keyValueMap.set("td_3_5", "13 mins");
keyValueMap.set("td_3_6", "10 mins");
keyValueMap.set("td_3_7", "2 mins");
keyValueMap.set("td_3_8", "6 mins");
keyValueMap.set("td_3_9", "12 mins");
keyValueMap.set("td_3_10", "12 mins");
keyValueMap.set("td_3_11", "6 mins");
keyValueMap.set("td_3_12", "10 mins");
keyValueMap.set("td_3_13", "17 mins");
keyValueMap.set("td_3_14", "15 mins");
keyValueMap.set("td_3_15", "11 mins");
keyValueMap.set("td_3_16", "7 mins");
keyValueMap.set("td_3_17", "19 mins");
keyValueMap.set("td_3_18", "22 mins");
keyValueMap.set("td_3_19", "8 mins");
keyValueMap.set("td_4_1", "7 mins");
keyValueMap.set("td_4_2", "12 mins");
keyValueMap.set("td_4_3", "14 mins");
keyValueMap.set("td_4_5", "5 mins");
keyValueMap.set("td_4_6", "9 mins");
keyValueMap.set("td_4_7", "16 mins");
keyValueMap.set("td_4_8", "17 mins");
keyValueMap.set("td_4_9", "4 mins");
keyValueMap.set("td_4_10", "5 mins");
keyValueMap.set("td_4_11", "11 mins");
keyValueMap.set("td_4_12", "21 mins");
keyValueMap.set("td_4_13", "12 mins");
keyValueMap.set("td_4_14", "5 mins");
keyValueMap.set("td_4_15", "12 mins");
keyValueMap.set("td_4_16", "18 mins");
keyValueMap.set("td_4_17", "12 mins");
keyValueMap.set("td_4_18", "16 mins");
keyValueMap.set("td_4_19", "9 mins");
keyValueMap.set("td_5_1", "10 mins");
keyValueMap.set("td_5_2", "14 mins");
keyValueMap.set("td_5_3", "13 mins");
keyValueMap.set("td_5_4", "5 mins");
keyValueMap.set("td_5_6", "13 mins");
keyValueMap.set("td_5_7", "16 mins");
keyValueMap.set("td_5_8", "19 mins");
keyValueMap.set("td_5_9", "3 mins");
keyValueMap.set("td_5_10", "3 mins");
keyValueMap.set("td_5_11", "13 mins");
keyValueMap.set("td_5_12", "21 mins");
keyValueMap.set("td_5_13", "16 mins");
keyValueMap.set("td_5_14", "8 mins");
keyValueMap.set("td_5_15", "16 mins");
keyValueMap.set("td_5_16", "20 mins");
keyValueMap.set("td_5_17", "7 mins");
keyValueMap.set("td_5_18", "11 mins");
keyValueMap.set("td_5_19", "6 mins");
keyValueMap.set("td_6_1", "6 mins");
keyValueMap.set("td_6_2", "5 mins");
keyValueMap.set("td_6_3", "9 mins");
keyValueMap.set("td_6_4", "9 mins");
keyValueMap.set("td_6_5", "13 mins");
keyValueMap.set("td_6_7", "10 mins");
keyValueMap.set("td_6_8", "11 mins");
keyValueMap.set("td_6_9", "9 mins");
keyValueMap.set("td_6_10", "10 mins");
keyValueMap.set("td_6_11", "5 mins");
keyValueMap.set("td_6_12", "15 mins");
keyValueMap.set("td_6_13", "8 mins");
keyValueMap.set("td_6_14", "7 mins");
keyValueMap.set("td_6_15", "5 mins");
keyValueMap.set("td_6_16", "12 mins");
keyValueMap.set("td_6_17", "20 mins");
keyValueMap.set("td_6_18", "24 mins");
keyValueMap.set("td_6_19", "13 mins");
keyValueMap.set("td_7_1", "10 mins");
keyValueMap.set("td_7_2", "6 mins");
keyValueMap.set("td_7_3", "2 mins");
keyValueMap.set("td_7_4", "17 mins");
keyValueMap.set("td_7_5", "17 mins");
keyValueMap.set("td_7_6", "11 mins");
keyValueMap.set("td_7_8", "4 mins");
keyValueMap.set("td_7_9", "15 mins");
keyValueMap.set("td_7_10", "15 mins");
keyValueMap.set("td_7_11", "8 mins");
keyValueMap.set("td_7_12", "9 mins");
keyValueMap.set("td_7_13", "18 mins");
keyValueMap.set("td_7_14", "17 mins");
keyValueMap.set("td_7_15", "11 mins");
keyValueMap.set("td_7_16", "5 mins");
keyValueMap.set("td_7_17", "22 mins");
keyValueMap.set("td_7_18", "25 mins");
keyValueMap.set("td_7_19", "11 mins");
keyValueMap.set("td_8_1", "11 mins");
keyValueMap.set("td_8_2", "6 mins");
keyValueMap.set("td_8_3", "6 mins");
keyValueMap.set("td_8_4", "18 mins");
keyValueMap.set("td_8_5", "20 mins");
keyValueMap.set("td_8_6", "11 mins");
keyValueMap.set("td_8_7", "5 mins");
keyValueMap.set("td_8_9", "16 mins");
keyValueMap.set("td_8_10", "17 mins");
keyValueMap.set("td_8_11", "9 mins");
keyValueMap.set("td_8_12", "4 mins");
keyValueMap.set("td_8_13", "18 mins");
keyValueMap.set("td_8_14", "18 mins");
keyValueMap.set("td_8_15", "11 mins");
keyValueMap.set("td_8_16", "2 mins");
keyValueMap.set("td_8_17", "25 mins");
keyValueMap.set("td_8_18", "29 mins");
keyValueMap.set("td_8_19", "15 mins");
keyValueMap.set("td_9_1", "6 mins");
keyValueMap.set("td_9_2", "11 mins");
keyValueMap.set("td_9_3", "12 mins");
keyValueMap.set("td_9_4", "5 mins");
keyValueMap.set("td_9_5", "4 mins");
keyValueMap.set("td_9_6", "10 mins");
keyValueMap.set("td_9_7", "15 mins");
keyValueMap.set("td_9_8", "16 mins");
keyValueMap.set("td_9_10", "1 min");
keyValueMap.set("td_9_11", "10 mins");
keyValueMap.set("td_9_12", "20 mins");
keyValueMap.set("td_9_13", "12 mins");
keyValueMap.set("td_9_14", "6 mins");
keyValueMap.set("td_9_15", "13 mins");
keyValueMap.set("td_9_16", "17 mins");
keyValueMap.set("td_9_17", "11 mins");
keyValueMap.set("td_9_18", "15 mins");
keyValueMap.set("td_9_19", "5 mins");
keyValueMap.set("td_10_1", "7 mins");
keyValueMap.set("td_10_2", "11 mins");
keyValueMap.set("td_10_3", "11 mins");
keyValueMap.set("td_10_4", "5 mins");
keyValueMap.set("td_10_5", "4 mins");
keyValueMap.set("td_10_6", "10 mins");
keyValueMap.set("td_10_7", "15 mins");
keyValueMap.set("td_10_8", "17 mins");
keyValueMap.set("td_10_9", "1 min");
keyValueMap.set("td_10_11", "10 mins");
keyValueMap.set("td_10_12", "19 mins");
keyValueMap.set("td_10_13", "13 mins");
keyValueMap.set("td_10_14", "7 mins");
keyValueMap.set("td_10_15", "13 mins");
keyValueMap.set("td_10_16", "18 mins");
keyValueMap.set("td_10_17", "10 mins");
keyValueMap.set("td_10_18", "14 mins");
keyValueMap.set("td_10_19", "4 mins");
keyValueMap.set("td_11_1", "4 mins");
keyValueMap.set("td_11_2", "3 mins");
keyValueMap.set("td_11_3", "5 mins");
keyValueMap.set("td_11_4", "11 mins");
keyValueMap.set("td_11_5", "13 mins");
keyValueMap.set("td_11_6", "5 mins");
keyValueMap.set("td_11_7", "7 mins");
keyValueMap.set("td_11_8", "9 mins");
keyValueMap.set("td_11_9", "9 mins");
keyValueMap.set("td_11_10", "10 mins");
keyValueMap.set("td_11_12", "13 mins");
keyValueMap.set("td_11_13", "13 mins");
keyValueMap.set("td_11_14", "11 mins");
keyValueMap.set("td_11_15", "8 mins");
keyValueMap.set("td_11_16", "9 mins");
keyValueMap.set("td_11_17", "20 mins");
keyValueMap.set("td_11_18", "24 mins");
keyValueMap.set("td_11_19", "10 mins");
keyValueMap.set("td_12_1", "15 mins");
keyValueMap.set("td_12_2", "10 mins");
keyValueMap.set("td_12_3", "11 mins");
keyValueMap.set("td_12_4", "22 mins");
keyValueMap.set("td_12_5", "21 mins");
keyValueMap.set("td_12_6", "16 mins");
keyValueMap.set("td_12_7", "9 mins");
keyValueMap.set("td_12_8", "4 mins");
keyValueMap.set("td_12_9", "20 mins");
keyValueMap.set("td_12_10", "20 mins");
keyValueMap.set("td_12_11", "14 mins");
keyValueMap.set("td_12_13", "23 mins");
keyValueMap.set("td_12_14", "22 mins");
keyValueMap.set("td_12_15", "15 mins");
keyValueMap.set("td_12_16", "5 mins");
keyValueMap.set("td_12_17", "25 mins");
keyValueMap.set("td_12_18", "28 mins");
keyValueMap.set("td_12_19", "15 mins");
keyValueMap.set("td_13_1", "10 mins");
keyValueMap.set("td_13_2", "13 mins");
keyValueMap.set("td_13_3", "17 mins");
keyValueMap.set("td_13_4", "12 mins");
keyValueMap.set("td_13_5", "16 mins");
keyValueMap.set("td_13_6", "8 mins");
keyValueMap.set("td_13_7", "18 mins");
keyValueMap.set("td_13_8", "17 mins");
keyValueMap.set("td_13_9", "12 mins");
keyValueMap.set("td_13_10", "12 mins");
keyValueMap.set("td_13_11", "13 mins");
keyValueMap.set("td_13_12", "22 mins");
keyValueMap.set("td_13_14", "8 mins");
keyValueMap.set("td_13_15", "8 mins");
keyValueMap.set("td_13_16", "18 mins");
keyValueMap.set("td_13_17", "22 mins");
keyValueMap.set("td_13_18", "26 mins");
keyValueMap.set("td_13_19", "15 mins");
keyValueMap.set("td_14_1", "8 mins");
keyValueMap.set("td_14_2", "12 mins");
keyValueMap.set("td_14_3", "15 mins");
keyValueMap.set("td_14_4", "6 mins");
keyValueMap.set("td_14_5", "8 mins");
keyValueMap.set("td_14_6", "7 mins");
keyValueMap.set("td_14_7", "16 mins");
keyValueMap.set("td_14_8", "17 mins");
keyValueMap.set("td_14_9", "6 mins");
keyValueMap.set("td_14_10", "7 mins");
keyValueMap.set("td_14_11", "11 mins");
keyValueMap.set("td_14_12", "22 mins");
keyValueMap.set("td_14_13", "9 mins");
keyValueMap.set("td_14_15", "10 mins");
keyValueMap.set("td_14_16", "18 mins");
keyValueMap.set("td_14_17", "15 mins");
keyValueMap.set("td_14_18", "19 mins");
keyValueMap.set("td_14_19", "11 mins");
keyValueMap.set("td_15_1", "9 mins");
keyValueMap.set("td_15_2", "5 mins");
keyValueMap.set("td_15_3", "10 mins");
keyValueMap.set("td_15_4", "12 mins");
keyValueMap.set("td_15_5", "16 mins");
keyValueMap.set("td_15_6", "5 mins");
keyValueMap.set("td_15_7", "10 mins");
keyValueMap.set("td_15_8", "10 mins");
keyValueMap.set("td_15_9", "12 mins");
keyValueMap.set("td_15_10", "13 mins");
keyValueMap.set("td_15_11", "7 mins");
keyValueMap.set("td_15_12", "14 mins");
keyValueMap.set("td_15_13", "8 mins");
keyValueMap.set("td_15_14", "10 mins");
keyValueMap.set("td_15_16", "11 mins");
keyValueMap.set("td_15_17", "23 mins");
keyValueMap.set("td_15_18", "27 mins");
keyValueMap.set("td_15_19", "16 mins");
keyValueMap.set("td_16_1", "12 mins");
keyValueMap.set("td_16_2", "7 mins");
keyValueMap.set("td_16_3", "7 mins");
keyValueMap.set("td_16_4", "19 mins");
keyValueMap.set("td_16_5", "19 mins");
keyValueMap.set("td_16_6", "12 mins");
keyValueMap.set("td_16_7", "6 mins");
keyValueMap.set("td_16_8", "2 mins");
keyValueMap.set("td_16_9", "17 mins");
keyValueMap.set("td_16_10", "18 mins");
keyValueMap.set("td_16_11", "10 mins");
keyValueMap.set("td_16_12", "4 mins");
keyValueMap.set("td_16_13", "19 mins");
keyValueMap.set("td_16_14", "19 mins");
keyValueMap.set("td_16_15", "12 mins");
keyValueMap.set("td_16_17", "23 mins");
keyValueMap.set("td_16_18", "27 mins");
keyValueMap.set("td_16_19", "14 mins");
keyValueMap.set("td_17_1", "16 mins");
keyValueMap.set("td_17_2", "21 mins");
keyValueMap.set("td_17_3", "19 mins");
keyValueMap.set("td_17_4", "12 mins");
keyValueMap.set("td_17_5", "7 mins");
keyValueMap.set("td_17_6", "20 mins");
keyValueMap.set("td_17_7", "22 mins");
keyValueMap.set("td_17_8", "24 mins");
keyValueMap.set("td_17_9", "10 mins");
keyValueMap.set("td_17_10", "10 mins");
keyValueMap.set("td_17_11", "20 mins");
keyValueMap.set("td_17_12", "25 mins");
keyValueMap.set("td_17_13", "22 mins");
keyValueMap.set("td_17_14", "15 mins");
keyValueMap.set("td_17_15", "23 mins");
keyValueMap.set("td_17_16", "23 mins");
keyValueMap.set("td_17_18", "5 mins");
keyValueMap.set("td_17_19", "11 mins");
keyValueMap.set("td_18_1", "20 mins");
keyValueMap.set("td_18_2", "25 mins");
keyValueMap.set("td_18_3", "21 mins");
keyValueMap.set("td_18_4", "16 mins");
keyValueMap.set("td_18_5", "11 mins");
keyValueMap.set("td_18_6", "24 mins");
keyValueMap.set("td_18_7", "25 mins");
keyValueMap.set("td_18_8", "27 mins");
keyValueMap.set("td_18_9", "14 mins");
keyValueMap.set("td_18_10", "14 mins");
keyValueMap.set("td_18_11", "23 mins");
keyValueMap.set("td_18_12", "27 mins");
keyValueMap.set("td_18_13", "26 mins");
keyValueMap.set("td_18_14", "19 mins");
keyValueMap.set("td_18_15", "27 mins");
keyValueMap.set("td_18_16", "27 mins");
keyValueMap.set("td_18_17", "5 mins");
keyValueMap.set("td_18_19", "13 mins");
keyValueMap.set("td_19_1", "10 mins");
keyValueMap.set("td_19_2", "13 mins");
keyValueMap.set("td_19_3", "9 mins");
keyValueMap.set("td_19_4", "10 mins");
keyValueMap.set("td_19_5", "6 mins");
keyValueMap.set("td_19_6", "14 mins");
keyValueMap.set("td_19_7", "13 mins");
keyValueMap.set("td_19_8", "15 mins");
keyValueMap.set("td_19_9", "5 mins");
keyValueMap.set("td_19_10", "5 mins");
keyValueMap.set("td_19_11", "11 mins");
keyValueMap.set("td_19_12", "15 mins");
keyValueMap.set("td_19_13", "16 mins");
keyValueMap.set("td_19_14", "11 mins");
keyValueMap.set("td_19_15", "17 mins");
keyValueMap.set("td_19_16", "16 mins");
keyValueMap.set("td_19_17", "12 mins");
keyValueMap.set("td_19_18", "15 mins");




document.getElementById("btnCalcStart").addEventListener('click', function(){

  var table = document.getElementById("simpleTable");
  var startPoint = document.getElementById("startPointSelect").value;
  var route = [];
  route.push(startPoint);

  var i = 1;
  var sum = 0;
  try{
    while(true){
      var point = table.rows[i].cells[0].innerText;
      if(startPoint == point){
        var tmpValue = 10000;
        var tmpColIndex = 0;
        for(let c=1; c<20; c++){
          if(table.rows[i].cells[c].innerText != ""){
            table.rows[i].cells[c].style.backgroundColor = "";
            if(!route.includes(table.rows[0].cells[c].innerText)){
              if(tmpValue > getValue(table.rows[i].cells[c].innerText)){
                tmpValue = getValue(table.rows[i].cells[c].innerText);
                tmpColIndex = c;
              }
            }
          } else {
            table.rows[i].cells[c].style.backgroundColor = "lightgray";
          }
        }
        startPoint = table.rows[0].cells[tmpColIndex].innerText;
        table.rows[i].cells[tmpColIndex].style.backgroundColor = "lightpink";
        sum = sum + getValue(table.rows[i].cells[tmpColIndex].innerText);
        route.push(startPoint);
        i = 0;
      }
      i++;
      if(route.length >= 19){
        break;
      }
    }

  }catch(e){
    console.log(e);
  }
  
  document.getElementById("divAnswer1").innerText = route.join(" ⇒ ");
  document.getElementById("divAnswer2").innerText = sum + "分です。";
});


function getValue(txt){
  var ret = txt.replace("mins","");
  ret = ret.replace(" ","");
  ret = ret * 1;
  return ret;
}



