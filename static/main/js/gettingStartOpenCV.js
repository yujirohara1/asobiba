window.onload = function(){
  //alert(1);
  showOriginalImage();
  return;
}

function showOriginalImage(){
    fetch('/showOriginalImage', {
    })
    .then(res => res.blob())
    .then(imageData => {
      // var list = jsonData.aaData;
      // table.appendChild(tbody);
      var url = (window.URL || window.webkitURL).createObjectURL(imageData);
      var img = document.getElementById("imgOriginalImage");
      img.src = url
    })
    .catch(error => { 
      console.log(error)
    });

}


var process = "";
let radioProcesses = document.querySelectorAll(`input[type='radio'][name='radioProcess']`);
for (let target of radioProcesses) {
	target.addEventListener(`change`, function () {
    process = target.value;
    startChangeProcess(process);
  });
}

function startChangeProcess(process){
  fetch('/showModifyImage/' + process, {
  })
  .then(res => res.blob())
  .then(imageData => {
    // var list = jsonData.aaData;
    // table.appendChild(tbody);
    var url = (window.URL || window.webkitURL).createObjectURL(imageData);
    var img = document.getElementById("imgChangelImage");
    img.src = "";
    img.src = url
  })
  .catch(error => { 
    console.log(error)
  });
}


// fetch('/executeFileGetAndInsert/' + query_params + "/0/100")
// .then(res => res.blob())
// .then(csvFile => {
  

//   var saiki = function (csvFile, indexFrom, indexTo, query_params, shoriZumi){

//     let formData = new FormData();
//     formData.append('csvFile', csvFile);
//     formData.append('indexFrom', indexFrom);
//     formData.append('indexTo', indexTo);
//     formData.append('shoriZumi', shoriZumi);
//     formData.append('queryParams', query_params);

//     fetch('/csvUpload', {
//       method: 'PUT',
//       body: formData,
//     })
//     .then(res => res.json())
//     .then(jsonData => {
//       //jsonData.data.totalKensu
//       //
//       if(jsonData.data.nokoriKensu>0){
//         updateSinthoku(jsonData.data);
//         saiki(csvFile, jsonData.data.startIndex, (jsonData.data.startIndex*1+10), query_params, jsonData.data.shoriZumi);
//         updateSinthoku(jsonData.data);
//       } else {
//         updateJotaiResult(jsonData.data);
//         return;
//       }
//     })
//     .catch(error => { console.log(error); });

//   }

//   saiki(csvFile, 0, 10, query_params, 0);
  
// })
// .catch(error => { 
//   console.log(error); 
// });



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
