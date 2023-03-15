window.onload = function(){
  //hoge();
  return;
}


var sex = "";
var age = "";
let radioSexs = document.querySelectorAll(`input[type='radio'][name='radioSex']`);
for (let target of radioSexs) {
	target.addEventListener(`change`, function () {
    //alert(target.value);
    sex = target.value;
    hoge();
  });
}

let radioAges = document.querySelectorAll(`input[type='radio'][name='radioAge']`);
for (let target of radioAges) {
	target.addEventListener(`change`, function () {
    age = target.value;
    hoge();
	});
}

function hoge(){
  if(sex == "" || age == ""){
    return;
  }

  fetch('/getNutrientRule/' + sex + "/" + age.split(",")[0], {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = JSON.parse(jsonData.data);
    var table = document.getElementById("simpleTable");
    table.innerHTML = "";
    var caption = document.createElement('caption');
    caption.innerText = "基準摂取量は下表のとおりです。";
    caption.style.captionSide = "top";
    table.appendChild(caption);
    var thead = document.createElement('thead');
    var th0 = document.createElement('th');
    th0.innerText = "コード";
    var thA = document.createElement('th');
    thA.innerText = "栄養素";
    var thB = document.createElement('th');
    thB.innerText = "量区分";
    var thC = document.createElement('th');
    thC.innerText = "基準量";
    thC.style.color = "blue";
    var thD = document.createElement('th');
    thD.innerText = "単位";
    var thE = document.createElement('th');
    thE.innerText = "摂取量";
    thE.style.color = "red";
    thead.appendChild(th0);
    thead.appendChild(thA);
    thead.appendChild(thB);
    thead.appendChild(thC);
    thead.appendChild(thD);
    thead.appendChild(thE);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    for(let i in list){
      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      td0.innerText = list[i].nutrient_code;
      var tdA = document.createElement('td');
      tdA.innerText = list[i].nutrient_name;
      var tdB = document.createElement('td');
      tdB.innerText = convertAmountDivision(list[i].amount_division) + convertEffect(list[i].effect);
      var tdC = document.createElement('td');
      tdC.innerText = list[i].amount;
      tdC.style.color = "blue";
      var tdD = document.createElement('td');
      tdD.innerText = convertUnit(list[i].unit);
      var tdE = document.createElement('td');
      tdE.innerText = "右表から摂取するエサを選択！";

      tr.appendChild(td0);
      tr.appendChild(tdA);
      tr.appendChild(tdB);
      tr.appendChild(tdC);
      tr.appendChild(tdD);
      tr.appendChild(tdE);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    createFeedTable();
  })
  .catch(error => { 
    console.log(error)
  });

}


function createFeedTable(){
  fetch('/getFeetList', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = JSON.parse(jsonData.data);
    var ul = document.getElementById("ulFeedList");
    ul.innerHTML = "";

    var tmpFeedCode = "";
    for(let i in list){
      if(tmpFeedCode != list[i].feed_code){

        var li = document.createElement('li');
        li.classList.add("list-group-item");
        var chk = document.createElement('input');
        chk.classList.add("form-check-input");
        chk.classList.add("me-1");
        chk.type = "checkbox";
        chk.value = list[i].feed_code;
        chk.name = "feed";
        chk.addEventListener('change', function() {
          hoge2();
        });
        //li.innerText = list[i].feed_name;
        li.appendChild(chk);
        li.appendChild( document.createTextNode(list[i].feed_name));
        ul.appendChild(li);

        tmpFeedCode = list[i].feed_code;
      }
    }
  })
  .catch(error => { 
    console.log(error)
  });

}


function hoge2(){
  //var chkFeedList = document.getElementsByName("feed");
  var argFeedCodes = "";
  var chkFeedList = document.getElementById("ulFeedList").querySelectorAll('input')
  chkFeedList.forEach(elem=>{
      if(elem.checked){
        argFeedCodes = argFeedCodes + elem.value + ",";
      }
  })
  // for(let i in chkFeedList){
  //   if(chkFeedList[i].checked){
  //     argFeedCodes = argFeedCodes + chkFeedList[i].value + ",";
  //   }
  // }
  argFeedCodes = argFeedCodes + "0";

  fetch('/getSummaryAmount/'+ argFeedCodes, {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = JSON.parse(jsonData.data);
    //alert(list);
    var table = document.getElementById("simpleTable");
    for(let i=0; i<table.rows.length; i++){
      table.rows[i].cells[5].innerText = "";
    }

    for(let i=0; i<table.rows.length; i++){
      for(let j in list){
        if(table.rows[i].cells[0].innerText == list[j].nutrient_code){
          table.rows[i].cells[5].innerText = list[j].amount;
          var a = table.rows[i].cells[3].innerText*1;
          var b = table.rows[i].cells[5].innerText*1;
          if(table.rows[i].cells[5].innerText == ""){
            b = 0;
          }
          
          if(a < b){
            table.rows[i].cells[5].style.color = "blue";
            table.rows[i].cells[5].innerText = table.rows[i].cells[5].innerText + " 摂りすぎ！";
          } else if(a > b){
            table.rows[i].cells[5].style.color = "red";
            table.rows[i].cells[5].innerText = table.rows[i].cells[5].innerText + " 足りない！";
          } else {
            table.rows[i].cells[5].style.color = "";
          }
        }
      }
    }
  })
  .catch(error => { 
    console.log(error)
  });
}


function convertEffect(eff){
  if(eff==""){
    return "";
  } else {
    if(eff=="less_than"){
      return "(未満)";
    }else if(eff=="or_more"){
      return "(以上)";
    }else if(eff=="or_less"){
      return "(以下)";
    }
  }
}

//RDA：推奨量、　AI：目安量、　DG：目標量
function convertAmountDivision(code){
  if(code == "DG"){
    return "目標量";
  }else if(code == "AI"){
    return "目安量";
  }else if(code == "RDA"){
    return "推奨量";
  }else{
    code;
  }
}

function convertUnit(unit){
  if(unit=="ug"){
    return "μg";
  } else {
    return unit;
  }
}