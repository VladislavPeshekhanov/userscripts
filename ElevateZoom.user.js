// ==UserScript==
// @name         ElevateZoom
// @version      1.0
// @author       Vladislav Peshekhanov
// @include      страница, на которой срабатывает скрипт
// @require      https://cdnjs.cloudflare.com/ajax/libs/elevatezoom/3.0.8/jquery.elevatezoom.min.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(".zoomContainer { z-index: 10000; }");

//при наведении на картинку убирает событие клика по картинке (окно с увеличенным изобр.)
$(document).on("mouseover", ".vd-ticket__img", function() {
    $(".vd-ticket__img").unbind("click");
    $(".zoomContainer").remove();
    click = 0;
});

//добавляет событие клика родителю картинки.
$(document).on("click", "#rotate90", function() {
    elevate();
});

//активация зум-линзы, если click - чётное значение и деактивация, если нет.
var click = 0;
function elevate() {
    var photo = $("#rotate90")[0];
    var photoSrc = photo.src;
    if(click % 2 === 0) {
        $("#rotate90").data('zoom-image', photoSrc).elevateZoom({lensSize: 300,
                                                                 zoomType: "lens",
                                                                 cursor: 'pointer',
                                                                 borderSize: 2,
                                                                 scrollZoom: true});
        click++;
    } else {
        $(".zoomContainer").remove();
        $("#rotate90").unbind("mousewheel");
        click++;
    }
}