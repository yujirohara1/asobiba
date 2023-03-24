window.onload = function(){
  return;
}


let radio = document.querySelectorAll(`input[type='radio'][name='radioCountry']`);
for (let target of radio) {
	target.addEventListener('change', function () {
    getHeadlines(target.value);
  });
}

function getHeadlines(country){
    fetch('/getHeadlines/' + country.split("_")[0] + "/" + country.split("_")[1], {
      method: 'GET',
      'Content-Type': 'application/json'
    })
    .then(res => res.json())
    .then(jsonData => {
      var list = jsonData.articles; //JSON.parse(jsonData);
      var divArea = document.getElementById("divHeadLine");
      divArea.innerHTML = "";
      var divRow;
      for(let i in list){
        if(i == -0 ||  (i % 4) == 0){
          divRow = document.createElement("div");
          divRow.classList.add("row");
        }

        var divCol = document.createElement("div");
        divCol.classList.add("col-3","card");
        var title = document.createElement("p");
        var divAuthor = document.createElement("div");
        var image = document.createElement("img");
        var url = document.createElement("a");
        title.innerText = list[i].title;
        divAuthor.appendChild(createBadgeSpan(list[i].author));
        image.src = list[i].urlToImage;
        url.innerText = list[i].title;
        url.href = list[i].url;
        url.target = "_blank";

        divCol.appendChild(divAuthor);
        //divCol.appendChild(title);
        if(list[i].urlToImage!=null){
          divCol.appendChild(image);
        }
        divCol.appendChild(url);
        // divCol.appendChild(divFrame);

        divRow.appendChild(divCol);

        if(i == -0 ||  (i % 4) == 0){
          divArea.appendChild(divRow);
        }
      }
    })
    .catch(error => { 
      console.log(error)
    });
  
}


function createBadgeSpan(author){

  var n = 0;
  if(author == null){
    n = 0;
  } else{
    n = author.length % 8;
  }
  var span = document.createElement("span");
  span.classList.add("badge","bg-primary");
  span.innerText = author;
  
  if(n==0){
    span.classList.add("bg-primary");
  } else if (n==1){
    span.classList.add("bg-success");
  } else if (n==2){
    span.classList.add("bg-danger");
  } else if (n==3){
    span.classList.add("bg-warning", "text-dark");
  } else if (n==4){
    span.classList.add("bg-info", "text-dark");
  } else if (n==5){
    span.classList.add("bg-info", "text-dark");
  } else if (n==6){
    span.classList.add("bg-light", "text-dark");
  } else if (n==7){
    span.classList.add("bg-dark");
  }

  return span
}
