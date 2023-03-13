window.onload = function(){
  var statusLabel = document.getElementById("badgeStatus");
  
  if(statusLabel.innerText=="success"){
    statusLabel.classList.add("badge"); 
    statusLabel.classList.add("bg-success");
  } else if(statusLabel.innerText=="failed"){
    statusLabel.classList.add("badge"); 
    statusLabel.classList.add("bg-secondary");
  }

  if(statusLabel.innerText=="success" || statusLabel.innerText=="failed"){
    callback();
  } else{
    tryAuth();
  }
  return;
}

function tryAuth(){
  var arg1 = "dummy";
  fetch('/startLoginAtGoogleAuth', {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    window.location.assign(jsonData.aaData[0].url);
  })
  .catch(error => { 
    alert(error);
  
  });
}

function callback(){
  var json = document.getElementById("responseJson").innerText;
  var list = JSON.parse(json);
  var table = document.getElementById("simpleTable");

  var thead = document.createElement('thead');
  var thA = document.createElement('th');
  var thB = document.createElement('th');
  thA.innerText = "属性";
  thB.innerText = "値";
  thead.appendChild(thA);
  thead.appendChild(thB);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  for(let i in list){
    var trow = document.createElement('tr');
    var tdA = document.createElement('td');
    var tdB = document.createElement('td');
    tdA.innerText = list[i].attr;
    if(list[i].attr == "picture"){
      var img = document.createElement('img');
      img.src = list[i].value;
      tdB.appendChild(img);
    } else {
      tdB.innerText = list[i].value;
    }
    trow.appendChild(tdA);
    trow.appendChild(tdB);
    tbody.appendChild(trow);
  }
  table.appendChild(tbody);
}


//   <tbody>
//     <tr>
//       <th scope="row">1</th>
//       <td>Mark</td>
//       <td>Otto</td>
//       <td>@mdo</td>
//     </tr>
//     <tr>
//       <th scope="row">2</th>
//       <td>Jacob</td>
//       <td>Thornton</td>
//       <td>@fat</td>
//     </tr>
//     <tr>
//       <th scope="row">3</th>
//       <td colspan="2">Larry the Bird</td>
//       <td>@twitter</td>
//     </tr>
//   </tbody>
// </table>