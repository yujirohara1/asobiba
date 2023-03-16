window.onload = function(){
  return;
}

function hoge(){
  Push.clear();
  Push.create("Hello world!", {
    body: "5秒以内に通知をクリックしてください。",
    icon: '/static/image/pakira.png', //static/image/pakira.png
    timeout: 5000,
    onClick: function () {
      alert("通知がクリックされました！");
      window.focus();
      this.close();
    }
});
}



document.getElementById("btnExecute").addEventListener('click', function(){
  hoge();
});

