let version = "1731"
let urls = []
const proxy_url = "https://aliensoda.space"//http://localhost:8088
document.getElementById("url").addEventListener("keydown", generateUrl);
document.getElementById("ver").addEventListener("keydown", setVersion);
document.getElementById("repBt").addEventListener("click", repeatUrls);
document.getElementById("base").addEventListener("keydown", setBaseUrl);
document.getElementById("resizer").addEventListener("click", resize);
document.getElementById("resizer").addEventListener("touchstart", resize);
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, true);
let errDiv = document.getElementById("error")
var logSize = 0
var baseUrl = ""
let curX = 0;
let startWidth = 0;
var bgstyle = 1
function resize(event) {
  event.preventDefault();
  const output = document.getElementsByClassName("output-left")[0];
  
  curX = event.clientX;
  startWidth = output.offsetWidth;

  document.addEventListener("mousemove", resizeTick);
  document.addEventListener("touchmove", resizeTick);
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("touchend", stopResize);
}

function resizeTick(event) {
  const output = document.getElementsByClassName("output-left")[0];
  const currentMouseX = event.clientX;
  
  output.style.width = (startWidth + (currentMouseX - curX)) - 6 + "px";
}

function stopResize() {
  document.removeEventListener("mousemove", resizeTick);
  document.removeEventListener("mouseup", stopResize);
}

function setBaseUrl(){
    baseUrl = document.getElementById("base").value
}
function runCheck(resDiv, url) {
  resDiv.classList.remove("success", "fail");
  resDiv.innerText = "...";

  fetch(proxy_url + "/proxy?url=" + encodeURIComponent(url), { method: 'GET',  "cors":"cors" })
    .then(res => {
      resDiv.innerText = res.status;
      if (res.ok) {
        resDiv.classList.add("success");
      } else {
        resDiv.classList.add("fail");
      }
    })
    .catch(() => {
      resDiv.innerText = "ERR";
      resDiv.classList.add("fail");
      errDiv.classList.remove("fade");
      errDiv.style.left = resDiv.offsetLeft + "px";
      errDiv.style.top = resDiv.offsetTop + "px";
      setTimeout(() => {
        errDiv.classList.add("fade");
      }, 2500);
    });
}
async function repeatUrls(){
    var outputOrig = document.getElementsByClassName("output-left")[0];
    var output = document.getElementsByClassName("output-right")[0];
    var baseUrl = document.getElementById("url").value;
    var rep_1 = document.getElementById("rep_1").value;
    var rep_2 = document.getElementById("rep_2").value;
    const urlMakerInstance = new urlMaker();
    for(var i = 0; i <= rep_2 - rep_1; i++){
        const seq = Number(rep_1) + i
        let url = urlMakerInstance.fetchCDNURL(baseUrl + seq)
        urls.push(url)
        logSize += 1
        if (logSize <= 1001){
            let div = document.createElement("a");
            div.className = "style-" + bgstyle
            div.innerHTML = url;
            bgstyle = bgstyle == 1 ? 2 : 1
            var resDiv = document.createElement("a");
            resDiv.className = "style-" + bgstyle
            resDiv.innerText = "...";
            runCheck(resDiv, url)
            div.onclick = function(){rightClickDelete(resDiv,div,url)}
            outputOrig.appendChild(resDiv);
            output.appendChild(div);
        }
    }
}
function rightClickDelete(event,org,div,url){
  if (event.button == 2) {
    var outputOrig = document.getElementsByClassName("output-left")[0];
    var output = document.getElementsByClassName("output-right")[0];
    output.removeChild(div);
    outputOrig.removeChild(org);
    urls.splice(urls.indexOf(url), 1);
    logSize -= 1
  } else {
    window.open(url)
  }
}
async function functionFetchAndDownload(url) {
    var proxyUrl = "http://localhost:8088/proxy?url=" + encodeURIComponent(url);
    // need to request as octel so that it wont mess up the file format
    const response = await fetch(proxyUrl, { method: 'GET', headers: { 'Accept': 'application/octet-stream' },"content-type": 'application/octet-stream' });
    if (!response.ok) return;

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;

    const nameFromUrl = url.split('/').pop().split('?')[0];
    link.download = nameFromUrl

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
}

function setVersion(){
    version = document.getElementById("ver").value;
}
async function generateUrl(key){
    if(key.keyCode != 13) return;
    var url = document.getElementById("url").value;
    var outputOrig = document.getElementsByClassName("output-left")[0];
    const urlMakerInstance = new urlMaker();
    url = urlMakerInstance.fetchCDNURL(url)
    urls.push(url);
    var output = document.getElementsByClassName("output-right")[0];
    var resDiv = document.createElement("a");
    resDiv.className = "style-" + bgstyle
    resDiv.innerText = "...";
    runCheck(resDiv, url)
     let div = document.createElement("a");
    div.className = "style-" + bgstyle
    div.innerHTML = url;
    bgstyle = bgstyle == 1 ? 2 : 1
    div.onmousedown = function(event){rightClickDelete(event,resDiv,div,url)}
    outputOrig.appendChild(resDiv);
    output.appendChild(div);
    logSize +=1
}
function clearOutput(){
    var output = document.getElementsByClassName("output-right")[0];
    output.innerHTML = "";
    output = document.getElementsByClassName("output-left")[0];
    output.innerHTML = "";
    urls = [];
    logSize = 0
}
function downloadAll(){
    for(var i = 0; i < urls.length; i++){
        functionFetchAndDownload(urls[i]);// this too fetch
        //window.open(urls[i])
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
    const contentURL = "https://ajcontent.akamaized.net/"
    let loc7 = null;
    let loc4 = null;
    let loc8 = null;
    let loc6 = "";
    let base = (baseUrl != "" ? baseUrl + "/" : "")
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
        loc7 = contentURL + loc6 + base + p1 + "?v=1";
      } else {
        loc7 = contentURL + loc6 + base+ loc4 + "?v=2";
      }
    } else if (loc5 === "0") {
      loc7 = contentURL + loc6  + base+ p1;
    } else {
      loc7 = contentURL + loc6 + base + loc4;
    }

    return loc7;
  }
}