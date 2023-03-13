window.onload = function(){
  return;
}





document.getElementById("btnSend").addEventListener('click', function(){
  var toneValue = document.getElementById("selecTone").value;
  var userQuestion = document.getElementById("userQuestion").value;
  if (toneValue==0){
    document.getElementById("selecTone").focus();
    document.getElementById("selecTone").style.color = "red";
    setTimeout('document.getElementById("selecTone").style.color = "";', 1000);
    return;
  }

  if (userQuestion==""){
    document.getElementById("userQuestion").focus();
    document.getElementById("userQuestion").style.backgroundColor = "#ffe6e6";
    setTimeout('document.getElementById("userQuestion").style.backgroundColor = "";', 1000);
    return;
  }

  sendMessage();
});


function sendMessage(){
  var message = document.getElementById("userQuestion").value;
  //var tone = document.getElementById("selecTone").innerText;//selecTone
  let obj = document.getElementById('selecTone');
  let idx = obj.selectedIndex;
  let tone  = obj.options[idx].text;

  document.getElementById("btnSend").classList.add("disabled");
  document.getElementById("gptAnswer").value = "";
  document.getElementById("divThinking").classList.add("loading-ss");
  document.getElementById("divSubTitleAnswer").innerText = "考え中";
  

  fetch('/sendMessageAndGetAnswer/' + message + "/" + tone, {
    method: 'GET',
    'Content-Type': 'application/json'
  })
  .then(res => res.json())
  .then(jsonData => {
    //jsonData.aaData[0].message
    document.getElementById("gptAnswer").value = jsonData.aaData[0].answer;
    document.getElementById("divSubTitleAnswer").innerText = "回答";
    document.getElementById("divThinking").classList.remove("loading-ss");
    document.getElementById("btnSend").classList.remove("disabled");
  })
  .catch(error => { 
    console.log(error)
  });

}
