// ==UserScript==
// @name         autoClickToQuestion
// @version      1.0
// @description  Скрипт, при загрузке страницы, автоматически отвечает на вопросы валидации, согласно заданных настроек.
// @author       Vladislav Peshekhanov
// @match        страница, на которой срабатывает скрипт №1
// @match        страница, на которой срабатывает скрипт №2
// @grant        none
// ==/UserScript==

var ValidName = $("#queueName").text();

function autoClicker(answer) {
    var radioButton = $(".col-md-1.custom_radio");
    var buttonNumber = 0;
    for (i = 0; i < settings.length | i < (radioButton.length / 2); i++) {
        if (answer[i].toUpperCase() == "Y") {
            radioButton[q].click();
        } else if (answer[i].toUpperCase() == "N") {
            radioButton[q + 1].click();
        }
        q += 2;
    }
}

switch (ValidName) {
    //название очереди, где необходимо отвечать на вопросы по заданному алгоритму.
    case "Кредитные карты":
        //Y или N - как ответить на вопрос "Да" или "Нет"? Через запятую по порядку на 1-й, 2-й и т.д. вопросы
        autoClicker(["Y", "N", "Y", "Y", "Y", "Y", "N", "N"]);
        break;
    case "Выдача депозитов":
        autoClicker(["Y", "N", "Y", "Y", "N", "Y"]);
        break;
    case "Рассрочка":
        autoClicker(["Y", "Y", "N", "Y", "Y", "N", "N", "Y"]);
        break;
    case "Фото клиента для доступа к столу":
        autoClicker(["Y", "Y", "Y", "Y", "Y", "N"]);
        break;
    case "Фото для идентификации":
        autoClicker(["Y", "N", "Y", "Y", "N"]);
        break;
    case "Депозитный договор (Подпись на планшете)":
    case "Заявление Заемщика":
    case "Заявление на расторжение по депозитному договору":
    case "Штамп об отказе от ИНН (оффлайн)":
    case "Штамп об отказе от ИНН (онлайн)":
    case "Справка переселенца":
    case "Валидация справки ИНН":
    case "Валидация справки ИНН (OLD)":
    case "Военный билет (оффлайн)":
        autoClicker(["Y", "Y", "Y", "Y",]);
        break;
    case "Валидация анкеты.":
        autoClicker(["Y", "Y", "Y", "Y",]);
        var ctsRadio = $(".cts_radio");
        for (i = 0; i < ctsRadio.length; i = i + 2) {
            ctsRadio[i].click();
        }
        break;
    case "Электронная Анкета персональных данных клиента":
        autoClicker(["Y", "Y"]);
        break;
    case "Заявление на расторжение договора (Подпись на планшете)":
        autoClicker(["Y"]);
        break;
    case "Электронная копия паспорта (оф-лайн) Украина":
    case "Электронная копия паспорта (он-лайн) Украина":
    case "Паспорт Украины (онлайн)":
        autoClicker(["Y", "N", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]);
        break;
    case "Валидация паспорта (Украина) (оффлайн)":
    case "Отложенные - Электронная копия паспорта (оф-лайн) Украина":
        autoClicker(["Y", "N", "Y", "Y", "Y", "Y", "Y"]);
        break;
    case "Валидация клиентских макетов карт":
        autoClicker(["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]);
        break;
    default:
        autoClicker(["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]);
        break;
}
