$(document).ready(function(){
// bouncer.js initialization step
var bouncer = new Bouncer('[data-validate]');
//r: added bouncerFormValid to onlcik to use that as the point of validation for bouncer js
    $("#searchButton").on("click", function (bouncerFormValid){
        event.preventDefault();
        var location = $("#locationInput").val();
        locationWeather(location);
        //clears input box after clicked
        $("#locationInput").val("");
    });

    function locationWeather(search){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=48cb01e208735d9aa940904774b4bdab&q="+ search;
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) { 
            
            var weather= response.main.text();
            console.log(weather);
            if (weather==="clear sky"){
                //drink list
            }else if(weather==="few clouds"){
                //drink list
            }
            else if (weather==="scattered clouds"){

            }
            else if(weather==="broken clouds"){

            }
            else if(weather==="shower rain"){

            }
            else if(weather==="rain"){

            }
            else if(weather==="thunderstorm"){

            }
            else if(weather==="snow"){

            }
            else if(weather==="mist"){

            }
        });
    }




});