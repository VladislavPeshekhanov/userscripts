// ==UserScript==
// @name         faceAPI
// @version      1.0
// @description  Подключение Face Api от майкрософт, сверка лиц на фото между собой, вычисление примерного возраста и пола клиента.
// @author       Vladislav Peshekhanov
// @match        страница, на которой срабатывает скрипт №1
// @match        страница, на которой срабатывает скрипт №2
// @grant        none
// ==/UserScript==

var ValidType = document.getElementById("queueName");
switch (ValidType.textContent) {
    case "Кредитные карты":
    case "Выдача депозитов":
    case "Рассрочка":
    case "Фото клиента для доступа к столу":
    case "Фото для идентификации":
        var dataURL = [];
        var blobs = [];
        var mainFaceId;
        var faceIds = [];
        var mainImage = $("img.document_image");
        var image4Galery = $("img.image4Galery");
        var otherImages = $("#otherImages");
        var results = [];

        var textQuestion = $('.col-md-10 qText');
        var age;
        var gender;

        if (image4Galery.length === 1000) {
            break;
        } else {
            mainImage[0].onload = function() {
                dataURL[0] = getBase64Image(mainImage[0]);
                blobs[0] = makeBlob(dataURL[0]);
                processImage(0);
            };
        }
        function process(id) {
            dataURL[id] = getBase64Image(image4Galery[image4Galery.length - id]);
            blobs[id] = makeBlob(dataURL[id]);
            processImage(id);
        }
        
        otherImages.onload = setTimeout(function() {
            for (i = 1; i <= image4Galery.length; i++) {
                process(i);
                if(i == 10) {
                    break;
                }
            }
        }, 1000);

        otherImages.onload = setTimeout(function() {
            for (i = 1; i <= image4Galery.length; i++) {
                findSimilars(image4Galery);
                if(i == 1) {
                    break;
                }
            }
        }, 2000);
        
        function validAge(faceAge) {
            var textQuestion = $('.col-md-10.qText');
            var searchQuestion;
            for (var i = 0; i < textQuestion.length; i++) {
                searchQuestion = textQuestion[i].textContent.match(/Возраст/i);
                if (searchQuestion) {
                    var ageTo = +textQuestion[i].textContent.split(/Возраст человека совпадает с диапазоном от (.+?) до \d* лет\?/i).join('');
                    var toAge = +textQuestion[i].textContent.split(/Возраст человека совпадает с диапазоном от \d* до (.+?) лет\?/i).join('');
                    console.log(ageTo + "\n" + faceAge + "\n" + toAge);
                    if ((ageTo / 1.5) <= +faceAge && +faceAge < (toAge * 1.5)) {
                        console.log('age ok');
                        break;
                    } else {
                        alert(+faceAge);
                        break;
                    }
                }
            }
        }

        function validGender() {
            var textQuestion = $('.col-md-10.qText');
            for (var i = 0; i < textQuestion.length; i++) {
                var male = textQuestion[i].textContent.match(/мужской/i);
                var female = textQuestion[i].textContent.match(/женский/i);
                if (male) {
                    if (gender == 'male') {
                        console.log('gender ok');
                        break;
                    } else {
                        alert('Возможно должна быть женщина');
                        break;
                    }
                } else if (female) {
                    if (gender == 'female') {
                        console.log('gender ok');
                        break;
                    } else {
                        alert('Возможно должен быть мужчина');
                        break;
                    }
                }
            }
        }

        function getBase64Image(img) {
            // Create an empty canvas element
            var canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Get the data-URL formatted image
            // Firefox supports PNG and JPEG. You could check img.src to
            // guess the original format, but be aware the using "image/jpg"
            // will re-encode the image.
            var dataURL = canvas.toDataURL("image/jpeg");

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }

        function makeBlob(dataURL) {
            var BASE64_MARKER = ';base64,';
            var parts;
            var contentType;
            var raw;
            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                parts = dataURL.split(',');
                contentType = parts[0].split(':')[1];
                raw = decodeURIComponent(parts[1]);
                return new Blob([raw], { type: contentType });
            }
            parts = dataURL.split(BASE64_MARKER);
            contentType = parts[0].split(':')[1];
            raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }

        function processImage(id) {
            var subscriptionKey = "9b83ea0a6b2f49c6bbfac333b239286d";
            var uriBase = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect";
            var params = {
                "returnFaceId": "true",
                "returnFaceLandmarks": "false",
                "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
            };

            // Perform the REST API call.
            $.ajax({
                url: uriBase + "?" + $.param(params),

                // Request headers.
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },

                type: "POST",
                // Request body.
                processData: false,
                data: blobs[id]
            })

                .done(function(data) {
                // Show formatted JSON on webpage.
                console.log(data);
                if (id === 0) {
                    mainFaceId = data[0].faceId;
                    age = data[0].faceAttributes.age;
                    gender = data[0].faceAttributes.gender;
                    validGender();
                    validAge(age);
                } else {
                    faceIds[id-1] = data[0].faceId;
                }
            })

                .fail(function(jqXHR, textStatus, errorThrown) {
                // Display error message.
                var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });
        }

        function findSimilars(ID) {
            var params = {
                // Request parameters
            };
            $.ajax({
                url: "https://westeurope.api.cognitive.microsoft.com/face/v1.0/findsimilars?" + $.param(params),
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a5969361539f4224917d4373a31e0e27");
                },
                type: "POST",
                // Request body
                data: JSON.stringify({
                    "faceId":mainFaceId,
                    "faceIds":faceIds,
                    "maxNumOfCandidatesReturned":10,
                    "mode": "matchFace",
                }),
            })
                .done(function(data) {
                alert(JSON.stringify(data, null, 2));
                console.log(JSON.stringify(data, null, 2));
                for(i = 0; i < faceIds.length; i++) {
                    results[i] = data[i].confidence;
                }
            })
                .fail(function() {
                console.log(faceIds);
                alert("error");
            });
        }

        break;
    default:
        break;
}
