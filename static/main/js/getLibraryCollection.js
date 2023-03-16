window.onload = function(){
  getLibraryList();
  return;
}

function getLibraryList(){
  fetch('/getLibraryList', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = jsonData.aaData;
    //list.sort((a, b) => b.lib_name - a.lib_name);
    list.sort((a,b)=>{  
      if(a.lib_name.toLowerCase() < b.lib_name.toLowerCase()) return -1;
      else if(a.lib_name.toLowerCase() > b.lib_name.toLowerCase()) return 1;
      return 0;
    })
    //alert(list[0].module_name);
    var table = document.getElementById("simpleTable");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var thA = document.createElement("th");
    var thB = document.createElement("th");
    thA.innerText = "ライブラリ";
    thB.innerText = "バージョン";
    thead.appendChild(thA);
    thead.appendChild(thB);
    table.appendChild(thead);
    for(let i in list){
      var tr = document.createElement("tr");
      var tdA = document.createElement("td");
      var tdB = document.createElement("td");
      tdA.innerText = list[i].lib_name;
      tdB.innerText = list[i].lib_version;
      tr.appendChild(tdA);
      tr.appendChild(tdB);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
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
