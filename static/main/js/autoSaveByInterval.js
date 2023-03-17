var setI;
window.onload = function(){
  //getRecordBySessionId();
  try{
    var previousRecord = document.getElementById("hiddenRecord").value;
    console.log(previousRecord);

    var vals = previousRecord.split(",");
    if(vals.length>=1){
      if(vals[0].split(":").length == 2){
        document.getElementById("inputA").value = vals[0].split(":")[1];
      }
    }
    if(vals.length>=2){
      if(vals[1].split(":").length == 2){
        document.getElementById("inputB").value = vals[1].split(":")[1];
      }
    }
    if(vals.length>=3){
      if(vals[2].split(":").length == 2){
        document.getElementById("inputC").value = vals[2].split(":")[1];
      }
    }
  }catch(e){
    console.log(e);
  }
  startAutoSave();
}

function getRecordBySessionId(){
  fetch('/getRecordBySessionId/' , {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    var list = jsonData.aaData;
    for(let i in list){
      return;
    }
  })
  .catch(error => { 
    console.log(error)
  });
}

function getInputValue(value){
  return value.replace(",","").replace(":","");
}

function startAutoSave(){
  var counter = 0;
  var time = document.getElementById("selectIntervalSecond").value * 1000;
  setI = setInterval(() => autoSaveProcess(), time);
  
  function autoSaveProcess () {
    if(counter < 100){
      
      var lbl = document.getElementById("labelAutoSaveProcess");
      lbl.blur();
      lbl.innerText = "自動保存中...";
      lbl.classList.add("badge","bg-warning","text-dark");

      var vals = getInputValue(document.getElementById("labelA").innerText) + ":" +
                getInputValue(document.getElementById("inputA").value) + "," +
                getInputValue(document.getElementById("labelB").innerText) + ":" +
                getInputValue(document.getElementById("inputB").value) + "," +
                getInputValue(document.getElementById("labelC").innerText) + ":" +
                getInputValue(document.getElementById("inputC").value) ;

      fetch('/autoSaveProcess/' + vals, {
        method: 'GET',
        'Content-Type': 'application/json'
      })
      .then(res => res.json())
      .then(jsonData => {
        var list = jsonData.aaData;
        var table = document.getElementById("simpleTable");
        table.innerHTML = "";
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        var thA = document.createElement("th");
        thA.innerText = "項目１";
        var thB = document.createElement("th");
        thB.innerText = "項目２";
        var thC = document.createElement("th");
        thC.innerText = "項目３";
        // var thZ = document.createElement("th");
        // thZ.innerText = "sessionId";
        thead.appendChild(thA);
        thead.appendChild(thB);
        thead.appendChild(thC);
        // thead.appendChild(thZ);
        table.appendChild(thead);
        var tr = document.createElement("tr");
        for(let i in list){
          var td = document.createElement("td");
          td.innerText = list[i].item_value;
          tr.appendChild(td);
        }
        // var tdZ = document.createElement("td");
        // tdZ.innerText = list[0].session_id;
        document.getElementById("divSessionId").innerText = list[0].session_id;
        // tr.appendChild(tdZ);
        tbody.appendChild(tr);
        table.appendChild(tbody);

        setTimeout(() => {
          var lbl = document.getElementById("labelAutoSaveProcess");
          lbl.innerText = "保存完了";
          lbl.classList.remove("badge","bg-warning","text-dark");
          lbl.classList.add("badge","bg-primary");
          
          setTimeout(() => {
            document.getElementById("labelAutoSaveProcess").innerText = "";
          }, 1000);

        }, 1000);

      })
      .catch(error => { 
        console.log(error)
      });
    
      
    } else {
      clearInterval(setI);
    }
    counter++;
  }
}


document.getElementById("btnSetInterval").addEventListener('click', function(){
  clearInterval(setI);
  startAutoSave();
});


