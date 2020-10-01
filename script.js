$(document).ready(function () {
    // bouncer.js initialization step
    var bouncer = new Bouncer('[data-validate]', {
        disableSubmit: true,
        customValidations: {
            valueMismatch: function (field) {
                console.log("bouncer working!");
                // Look for a selector for a field to compare
                // If there isn't one, return false (no error)
                var selector = field.getAttribute('data-bouncer-match');
                if (!selector) return false;

                // Get the field to compare
                var otherField = field.form.querySelector(selector);
                if (!otherField) return false;

                // Compare the two field values
                // We use a negative comparison here because if they do match, the field validates
                // We want to return true for failures, which can be confusing
                return otherField.value !== field.value;

            }
        },
        messages: {
            valueMismatch: function (field) {
                var customMessage = field.getAttribute('data-bouncer-mismatch-message');
                return customMessage ? customMessage : 'Please make sure the fields match.'
            }
        }
    });

    document.addEventListener('bouncerFormInvalid', function (event) {
        console.log(event.detail.errors);
        console.log(event.detail.errors[0].offsetTop);
        window.scrollTo(0, event.detail.errors[0].offsetTop);
    }, false);

    document.addEventListener('bouncerFormValid', function () {
        alert('Form submitted successfully!');
        window.location.reload();
    }, false);
    //end of bouncer js

    //search button clicked
    $("#searchButton").on("click", function () {
        event.preventDefault();
        var location = $("#locationInput").val();
        locationWeather(location);
        //clears input box after clicked
        $("#locationInput").val("");
    });


    //passed location through ajax function
    function locationWeather(location) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=48cb01e208735d9aa940904774b4bdab&q=" + location;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            var weather = response.weather[0].main;
            var temp = response.main.temp;
            if (temp < 60) {
                //cold weather drinks
                var coldDrinks = ["Irish Coffee", "Orange Scented Hot Chocolate", "Hot Creamy Bush,"];
                getDrinks(coldDrinks);
                console.log('cold');
            }
            else if (temp > 60 && temp < 75) {
                //mid weather drinks
                var midWeatherDrinks = ["Sidecar", "Dry Martini"];
                getDrinks(midWeatherDrinks);
                console.log('warm');
            }
            else {
                //hot weather drinks
                var hotWeatherDrinks = ["Margarita", "Negroni", "Long Island Iced Tea", "Mojito", "Mai Tai",
                                        "Mint Julep", "Painkiller", "Tom Collins", "Pina Colada",
                                        "Manhattan", "Moscow Mule"];
                getDrinks(hotWeatherDrinks);
                console.log('hot');

            }
        });
    }

    //drinks api
    function getDrinks(drinkArray) {
        var randomCocktailIndex = Math.floor(Math.random() * (drinkArray.length));
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkArray[randomCocktailIndex];
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.drinks[0].strDrink);
            if(response.drinks.length > 1) {
                console.log('larger than 1');
            }
            var cocktailInstructions = response.drinks[0].strInstructions;
            let ingredients = [];
            for (const [key, value] of Object.entries(response.drinks[0])) {
                if((key.includes('strIngredient')) && (value != null)) {
                    ingredients.push(value);
                }
            }
              
            //console.log(ingredients);
            renderDrinks(ingredients);
        });
    }

    //render drink function??
    function renderDrinks(ingredients) {
        console.log(ingredients);
    }

});