// ==UserScript==
// @name         DateAndFioValidPhoto
// @version      1.0
// @description  Сверка даты фотографии с текущей и проверка фио на наличие "циганских" имён.
// @author       Vladislav Peshekhanov
// @match        страница, на которой срабатывает скрипт №1
// @match        страница, на которой срабатывает скрипт №2
// @grant        none
// @require      http://momentjs.com/downloads/moment.js
// ==/UserScript==

var validType = document.getElementById("queueName");
var pagination = document.getElementsByClassName('col-md-12 pagination-wrapper')[0];
var date = moment(); //Получаем текущую дату
var currentDate = date.format("YYYY-MM-DD");

switch (validType.textContent) {
    case "Фото клиента для доступа к столу":
    case "Рассрочка":
    case "Кредитные карты":
    case "Выдача депозитов":
    case "Фото для идентификации":
        var mainImage = document.getElementById('mainImage');
        var dateImage = mainImage.getElementsByTagName('span');
        dateImage[0].style.fontWeight = 'bold';
        switch (dateImage[0].textContent) {
            case currentDate:
                dateImage[0].style.color = '#00f218'; //зеленый
                break;
            default:
                dateImage[0].style.color = '#ff1100'; //красный, увеличенный
                dateImage[0].style.fontSize = '22pt';
                break;
        }
        break;
    default:
        break;
}

switch (validType.textContent) {
    case "Кредитные карты":
    case "Рассрочка":
        var FIO = document.getElementById('ticketFioSpan');
        var check = ["Оглы",
                     "Огли",
                     "Оглу",
                     "Кызы",
                     "Золотой",
                     "Лейла",
                     "Рада",
                     "Зухра",
                     "Рамза",
                     "Раджо",
                     "Зурало",
                     "Лачё",
                     "Лаче",];
        for (i = 0; i < check.length; i++) {
            if(FIO.textContent.toUpperCase().indexOf(check[i].toUpperCase()) != -1){
                FIO.style.color = '#ff1100';
                FIO.style.fontWeight = 'bold';
                break;
            }
        }
        break;
    default:
        break;
}
