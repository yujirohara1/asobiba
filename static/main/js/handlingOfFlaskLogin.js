window.onload = function(){
  confirmStatus();
  return;
}

function confirmStatus(){
    fetch('/confirmStatus', {
      method: 'GET',
      'Content-Type': 'application/json'
    })
    .then(res => res.json())
    .then(jsonData => {
      var list = jsonData.aaData;

      createStatusBlock(list);

    })
    .catch(error => { 
      console.log(error)
    });
  
}




document.getElementById("btnAtLoginRequired").addEventListener('click', function(){
  fetch('/callAtLoginRequired', {
    method: 'GET',
  })
  .then(result => {
      document.getElementById("resultLoginRequired").innerText = "ステータスコード：" + result.status + "," + result.statusText;
  })
  .catch(error => { 
    console.log(error)
  });
});


document.getElementById("btnHandleLogin").addEventListener('click', function(){
  
  fetch('/handleLogin', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
      var list = jsonData.aaData;
      createStatusBlock(list);
  })
  .catch(error => { 
    console.log(error)
  });
});

document.getElementById("btnHandleLogout").addEventListener('click', function(){
  
  fetch('/handleLogout', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
      var list = jsonData.aaData;
      createStatusBlock(list);
  })
  .catch(error => { 
    console.log(error)
  });
});


document.getElementById("btnHandleConfirm").addEventListener('click', function(){
  confirmStatus();
});



function createStatusBlock(list){
  var label = document.getElementById("divStatus");
  label.innerHTML = "";

  var table = document.createElement("table");
  table.classList.add("table");
  var thead = document.createElement("thead");
  var thA = document.createElement("th");
  thA.innerText = "属性";
  var thB = document.createElement("th");
  thB.innerText = "値";
  thead.appendChild(thA);
  thead.appendChild(thB);
  table.appendChild(thead);

  var tbody = document.createElement("tbody");

  var tr1 = document.createElement("tr");
  var td1A = document.createElement("td");
  var td1B = document.createElement("td");
  td1A.innerText = "is_active";
  td1B.innerText = list[0].is_active;
  tr1.appendChild(td1A);
  tr1.appendChild(td1B);
  tbody.appendChild(tr1);
  

  var tr2 = document.createElement("tr");
  var td2A = document.createElement("td");
  var td2B = document.createElement("td");
  td2A.innerText = "is_authenticated";
  td2B.innerText = list[0].is_authenticated;
  tr2.appendChild(td2A);
  tr2.appendChild(td2B);
  tbody.appendChild(tr2);
  

  var tr3 = document.createElement("tr");
  var td3A = document.createElement("td");
  var td3B = document.createElement("td");
  td3A.innerText = "is_anonymous";
  td3B.innerText = list[0].is_anonymous;
  tr3.appendChild(td3A);
  tr3.appendChild(td3B);
  tbody.appendChild(tr3);

  var tr4 = document.createElement("tr");
  var td4A = document.createElement("td");
  var td4B = document.createElement("td");
  td4A.innerText = "timestamp";
  td4B.innerText = list[0].timestamp;
  tr4.appendChild(td4A);
  tr4.appendChild(td4B);
  tbody.appendChild(tr4);
  
  table.appendChild(thead);
  table.appendChild(tbody);

  label.appendChild(table);
}

