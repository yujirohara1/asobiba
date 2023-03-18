window.onload = function(){
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

// 　　　コロン(:)
// 　　　円記号(\)
// 　　　疑問符(?)
// 　　　角括弧([])
// 　　　スラッシュ(/)
// 　　　アスタリスク(*)

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
  //alert(123);
  
  var files = document.querySelector('#inputFile').files
  let formData = new FormData();
  formData.append('excelFile', files[0]);

  var table = document.getElementById("simpleTable");
  for(let i=0; i<table.rows.length; i++){
    formData.append('sheetName' + i, document.getElementById("inputSheetName" + i).value);
  }

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
    let anchor = document.createElement("a");
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = "aaaa.xlsx";
    anchor.click();
  })
  .catch(error => { 
    console.log(error)
  });
  
  // $.ajax({
  //   type: "GET",
  //   url: "/OutputExcelNouhinsho/" + customerid + "/" + deliverYmd.split("/").join("-") + "",
  //   xhrFields    : {responseType : 'blob'},
  // }).done(function(data, textStatus, jqXHR ) {
  //   var blob=new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64"});//
  //   var link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = "" + Math.random().toString(32).substring(2) + ".xlsx";
  //   link.click();
  // }).fail(function(data) {
  //       alert("エラー：" + data.statusText);
  // }).always(function(data) {
  // });

});


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
