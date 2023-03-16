window.onload = function(){
  document.getElementById("btnSetTimeoutCancel").classList.add("invisible");
  document.getElementById("btnsetIntervalCancel").classList.add("invisible");
  return;
}

function hoge(){
  document.body.style.backgroundColor = "red";
  document.getElementById("btnSetTimeoutCancel").classList.remove("invisible");
}

document.getElementById("btnSetTimeout").addEventListener('click', function(){
  setTimeout("hoge()",3000);
});


document.getElementById("btnSetTimeoutCancel").addEventListener('click', function(){
  document.body.style.backgroundColor = "";
  document.getElementById("btnSetTimeoutCancel").classList.add("invisible");
});



var timerId;
document.getElementById("btnsetInterval").addEventListener('click', function(){
  timerId = setInterval("Foo()", 1000);
  document.getElementById("btnsetIntervalCancel").classList.remove("invisible");
});

var counter = 0;
function Foo(){
  counter++;
  if(document.body.style.backgroundColor == "red"){
    document.body.style.backgroundColor = "";
  } else {
    document.body.style.backgroundColor = "red";
  }
  // if(counter >= 10){
  //   clearInterval(timerId);
  // }
}



document.getElementById("btnsetIntervalCancel").addEventListener('click', function(){
  clearInterval(timerId);
  document.getElementById("btnsetIntervalCancel").classList.add("invisible");
  document.body.style.backgroundColor = "";
});





