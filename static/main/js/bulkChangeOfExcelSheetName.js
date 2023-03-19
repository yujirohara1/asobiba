window.onload = function(){
  document.getElementById("btnExcecuteChange").classList.add("disabled");
  return;
}


//取り込みファイルを指定
document.getElementById("inputFile").addEventListener('change', function() {
  hoge();
});


function hoge(){
  var table = document.getElementById("simpleTable");
  table.innerHTML = "";

  var files = document.querySelector('#inputFile').files
  let formData = new FormData();
  formData.append('excelFile', files[0]);

  var label = document.getElementById("lblStatus");
  var spinner = document.getElementById("spinnerCheckFiles");
  spinner.classList.remove("invisible");
  
  fetch('/uploadFiles', {
    method: 'PUT',
    body: formData,
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = JSON.parse(jsonData.data);
    spinner.classList.add("invisible");
    if(list.length==0){
      var lbl = document.getElementById("lblStatus");
      lbl.innerText = "Excelファイルを指定してください。";
      lbl.style.color = "red";
      setTimeout(() => {
        lbl.innerText = "";
      }, 2000);
      return;
    }

    var table = document.getElementById("simpleTable");
    var thead = document.createElement("thead");
    var thA = document.createElement("th");
    thA.innerText = "インデックス";
    var thB = document.createElement("th");
    thB.innerText = "シート名";
    var thC = document.createElement("th");
    thC.innerText = "シート名（変更後）";
    thead.appendChild(thA);
    thead.appendChild(thB);
    thead.appendChild(thC);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");

    for(let i in list){
      var tr = document.createElement("tr");
      var tdA = document.createElement("td");
      tdA.innerText = list[i].sheetIdx;
      var tdB = document.createElement("td");
      tdB.innerText = list[i].sheetName;
      var tdC = document.createElement("td");
      var inp = document.createElement("input");
      inp.type = "text";
      inp.value = list[i].sheetName;
      inp.classList.add("form-control");
      inp.id = "inputSheetName" + i;
      inp.addEventListener('input', function(){
        checkSheetNameList();
      });
      tdC.appendChild(inp);
      tr.appendChild(tdA);
      tr.appendChild(tdB);
      tr.appendChild(tdC);
      tbody.appendChild(tr);

    }
    table.appendChild(tbody);
  })
  .catch(error => { console.log(error); });
}

function checkSheetNameList(){
  var table = document.getElementById("simpleTable");
  var errFlg = false;
  for(let i=0; i<table.rows.length; i++){
    var inp = document.getElementById("inputSheetName" + i);
    if(inp.value.indexOf(":") > 0 || 
      inp.value.indexOf("\\") > 0 || 
      inp.value.indexOf("?") > 0 || 
      inp.value.indexOf("[") > 0 || 
      inp.value.indexOf("]") > 0 || 
      inp.value.indexOf("/") > 0 || 
      inp.value.indexOf("*") > 0 ){
      inp.style.color = "red";
      document.getElementById("btnExcecuteChange").classList.add("disabled");
      document.getElementById("divAlertMessage").innerText = "禁止文字が含まれています。（" + inp.value + "）";
      errFlg = true;
    } else if(inp.value.length > 31) {
      inp.style.color = "red";
      document.getElementById("btnExcecuteChange").classList.add("disabled");
      document.getElementById("divAlertMessage").innerText = "31文字を越えています。（" + inp.value + "）";
      errFlg = true;
    } else if(inp.value=="") {
      document.getElementById("btnExcecuteChange").classList.add("disabled");
      document.getElementById("divAlertMessage").innerText = "シート名が入力されていません。";
    } else {
      inp.style.color = "";
    }
  }
  if(!errFlg){
    document.getElementById("btnExcecuteChange").classList.remove("disabled");
    document.getElementById("divAlertMessage").innerText = "";
  }
}

document.getElementById("btnExcecuteChange").addEventListener('click', function(){
  
  var files = document.querySelector('#inputFile').files
  let formData = new FormData();
  formData.append('excelFile', files[0]);

  var table = document.getElementById("simpleTable");
  for(let i=0; i<table.rows.length; i++){
    formData.append('sheetName' + i, document.getElementById("inputSheetName" + i).value);
  }

  var spinner = document.getElementById("spinnerDownloadA");
  spinner.classList.remove("invisible");

  fetch('/modifiedExcelDownload', {
    method: 'PUT',
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'responseType' : "blob",
    body: formData,
  })
  .then((res)=> res.blob())
  .then(blob => {
    spinner.classList.add("invisible");
    let anchor = document.createElement("a");
    anchor.href = window.URL.createObjectURL(blob);
    var tmp = files[0].name.split(".");
    anchor.download = tmp[0] + "_modified." + tmp[1];
    anchor.click();
  })
  .catch(error => { 
    console.log(error)
  });
  
});
