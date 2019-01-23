'use strict';
console.log("Script läuft");

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();
