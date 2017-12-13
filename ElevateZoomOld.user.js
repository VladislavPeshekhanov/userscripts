// ==UserScript==
// @name         ElevateZoomOld
// @version      1.0
// @description  Добавляет зум-линзу при клике по фото
// @author       You
// @match        страница, на которой срабатывает скрипт №1
// @match        страница, на которой срабатывает скрипт №2
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/elevatezoom/3.0.8/jquery.elevatezoom.min.js

// ==/UserScript==

var tabContent = document.getElementsByClassName('tab-content')[0];
var img = tabContent.getElementsByTagName('img');

var click = 0;
function elevate() {
    if(click % 2 === 0) {
        $(zoom).elevateZoom({lensSize: 350,
                             zoomType: "lens",
                             cursor: 'pointer',
                             borderSize: 2,
                             scrollZoom: true});
        click++;
    } else {
        $(".zoomContainer")[0].remove();
        click++;
    }
}


for(i = 0; i <= img.length; i++) {
    var maindoc = img[i];
    var maindocSrc = maindoc.src;
    var origdocSrc = maindocSrc.replace("maindoc","origdoc");
    maindoc.id = ("zoom_0" + i);
    var zoom = "#" + maindoc.id;
    maindoc.setAttribute("data-zoom-image", origdocSrc);
    maindoc.addEventListener("click", elevate);
}
