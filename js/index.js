let version = "1731"
document.getElementById("url").addEventListener("keydown", generateUrl);
document.getElementById("ver").addEventListener("keydown", setVersion);

function repeatUrls(){
    var output = document.getElementsByClassName("output")[0];
    var baseUrl = document.getElementById("url").value;
    var rep_1 = document.getElementById("rep_1").value;
    var rep_2 = document.getElementById("rep_2").value;
    const urlMakerInstance = new urlMaker();
    for(var i = rep_1; i <= rep_2; i++){
        output.innerHTML += "<a href="+urlMakerInstance.fetchCDNURL(baseUrl+ i)+">"+urlMakerInstance.fetchCDNURL(baseUrl + i)+"</a>";
        output.innerHTML += "<br>";
    }
}
function setVersion(){
    version = document.getElementById("ver").value;
}
function generateUrl(key){
    if(key.keyCode != 13) return;
    var url = document.getElementById("url").value;
    var output = document.getElementsByClassName("output")[0];
    const urlMakerInstance = new urlMaker();
    output.innerHTML += "<a href="+urlMakerInstance.fetchCDNURL(url)+">"+urlMakerInstance.fetchCDNURL(url)+"</a>";
    output.innerHTML += "<br>";
}
function clearOutput(){
    var output = document.getElementsByClassName("output")[0];
    output.innerHTML = "";
}
function downloadAll(){
    var output = document.getElementsByClassName("output")[0];
    var links = output.getElementsByTagName("a");
    for(var i = 0; i < links.length; i++){
        window.open(links[i].href);
    }
}
class urlMaker {
  bitShift(def_id, sort_cat = 0) {
    return (def_id << 16) | (sort_cat & 0xFFFF);
  }

  hashIt(p1) {
    let loc2 = "";
    p1 = "W3 7r4Ck h4X0r3rs" + p1;
    for (let i = 0; i < p1.length; i++) {
      if ((i % 2) === 0) {
        loc2 += p1[i];
      } else {
        loc2 = p1[i] + loc2;
      }
    }
    return md5(loc2);
  }

  fetchCDNURL(p1, p2 = "/", p3 = true) {
    const contentURL = "https://ajcontent.akamaized.net/";
    let loc7 = null;
    let loc4 = null;
    let loc8 = null;
    let loc6 = "";
    const loc5 = version;

    if (loc5 !== "0" && p3) {
      loc6 = loc5 + "/";
    }

    const loc9 = p1.split("/", 2);
    if (loc5 === "0" && !p3) {
      loc4 = p1;
    } else if (loc9.length === 1) {
      loc4 = this.hashIt(loc9[0]);
    } else {
      loc8 = loc9.pop();
      loc4 = loc9.join("/") + "/" + this.hashIt(loc8);
    }

    if (p3) {
      if (loc5 === "0") {
        loc7 = contentURL + loc6 + p1 + "?v=1";
      } else {
        loc7 = contentURL + loc6 + loc4 + "?v=2";
      }
    } else if (loc5 === "0") {
      loc7 = contentURL + loc6 + p1;
    } else {
      loc7 = contentURL + loc6 + loc4;
    }

    return loc7;
  }
}