window.onload = function(){
  //alert(1);
  createCoOccurrenceNetworkImage();
  return;
}


function createCoOccurrenceNetworkImage(){
  var divArea = document.getElementById("divArea");
  var spinner = document.createElement("div");
  spinner.classList.add("spinner-border");
  divArea.appendChild(spinner);
  
  fetch('/getCoOccurrenceNetworkImage', {
  })
  .then(res => res.blob())
  .then(imageData => {
    
    var url = (window.URL || window.webkitURL).createObjectURL(imageData);
    var img = document.getElementById("imgWordCloud");
    img.src = url
    divArea.removeChild(spinner);
    
  })
  .catch(error => { 
    console.log(error)
  });

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
