window.onload = function(){
  hoge();
  return;
}

function hoge(){
  fetch('/hoge', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = jsonData.aaData;
    alert(list[0].version);
    alert(list[0].training);
    // var table = document.getElementById("simpleTable");
    // var thead = document.createElement("thead");
    // var tbody = document.createElement("tbody");
    // var thA = document.createElement("th");
    // var thB = document.createElement("th");
    // thA.innerText = "プロパティ";
    // thB.innerText = "値";
    // thead.appendChild(thA);
    // thead.appendChild(thB);
    // table.appendChild(thead);
    // for(let i in list){
    //   var tr = document.createElement("tr");
    //   var tdA = document.createElement("td");
    //   var tdB = document.createElement("td");
    //   tdA.innerText = list[i].property;
    //   tdB.innerText = list[i].value;
    //   tr.appendChild(tdA);
    //   tr.appendChild(tdB);
    //   tbody.appendChild(tr);
    // }
    // table.appendChild(tbody);
  })
  .catch(error => { 
    console.log(error)
  });

}
