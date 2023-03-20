window.onload = function(){
  return;
}

document.getElementById("selectBlendMode").addEventListener('change', function() {
  var mode = document.getElementById("selectBlendMode").value;
  
  var imgRed = document.getElementById("imgRed");
  var imgBlue = document.getElementById("imgBlue");
  var imgGreen = document.getElementById("imgGreen");

  imgRed.style.setProperty("mix-blend-mode", mode);
  imgBlue.style.setProperty("mix-blend-mode", mode);
  imgGreen.style.setProperty("mix-blend-mode", mode);
});

