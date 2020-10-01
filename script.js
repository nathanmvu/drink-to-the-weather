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
    $("#searchButton").on("click", function (event) {
        event.preventDefault();
        var location = $("#locationInput").val();
        locationWeather(location);
        //clears input box after clicked
        $("#locationInput").val("");
        $("#mainimgholder").empty();
        $("#ingredients").empty();
        $("#instructions").empty();
        $("#currentWeather").empty();
    });

    $("#go").on("click", function (event) {
        $("#mainimgholder").empty();
        $("#ingredients").empty();
        $("#instructions").empty();
        $("#currentWeather").empty();
        let feeling = document.getElementsByName('feelings');
        for (let i = 0, length = feeling.length; i < length; i++) {
            if (feeling[i].checked) {
              console.log(feeling[i].value);
              drinksByFeeling(feeling[i].value);
              // only one radio can be logically checked, don't check the rest
              break;
            }
          }
    });


    //passed location through ajax function
    function locationWeather(location) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=48cb01e208735d9aa940904774b4bdab&q=" + location;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $("#currentWeather").html("Current Weather in "+response.name+ " " +response.main.temp +" "+ "&#176F");
            var weather = response.weather[0].main;
            var temp = response.main.temp;
            if (temp < 60) {
                //cold weather drinks
                var coldDrinks = ["Irish Coffee", "Orange Scented Hot Chocolate", "Hot Creamy Bush","Rum Toddy","Melya",
                                  "Salted Toffee Martini","Sherry Eggnog"];               
                getDrinks(coldDrinks);
                console.log('cold');
            }
            else if (temp > 60 && temp < 75) {
                //mid weather drinks
                var midWeatherDrinks = ["Sidecar", "Dry Martini","Applecar","Apple Cider Punch #1", "Cranberry Punch",
                                        "Masala Chai","Mulled Wine","Spiced Peach Punch"];               
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

    function drinksByFeeling(mood) {
        let partyDrinks = ["Zombie", "Jello shots", "Jack's Vanilla Coke", "Downshift", "Long Island Iced Tea"];
        let chillDrinks = ["Pina Colada", "White Wine Sangria", "Pineapple Paloma", "Planter's Punch", "Rum Punch"];
        let problemDrinks = ["Shot-gun", "Zombie", "Radioactive Long Island Iced Tea", "The Evil Blue Thing", "Death in the Afternoon", "Quick F**K"];
        let romanticDrinks = ["Sangria - The World's Best", "White Lady", "Wine Cooler", "Rose", "Vermouth Cassis"];
        
        if(mood == "party") {
            getDrinks(partyDrinks);
            getRecs(partyDrinks);
        } else if(mood == "chill") {
            getDrinks(chillDrinks);
            getRecs(chillDrinks);
        } else if (mood == "problems") {
            getDrinks(problemDrinks);
            getRecs(problemDrinks);
        } else {
            getDrinks(romanticDrinks);
            getRecs(romanticDrinks);
        }
    }

    let recArray = [];
    //drinks api
    function getDrinks(drinkArray) {
        var randomCocktailIndex = Math.floor(Math.random() * (drinkArray.length));
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkArray[randomCocktailIndex];
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var imageURL = response.drinks[0].strDrinkThumb;
            var howToMake = response.drinks[0].strInstructions;
            const drinkName = response.drinks[0].strDrink;
            console.log(response.drinks[0].strDrink);
            if(response.drinks.length > 1) {
                console.log('larger than 1');
            }
            var cocktailInstructions = response.drinks[0].strInstructions;
            let ingredients = [];
            let measures = [];
            // Gets all ingredients and ingredient measures
            for (const [key, value] of Object.entries(response.drinks[0])) {
                if((key.includes('strIngredient')) && (value != null)) {
                    ingredients.push(value);
                }
                else if((key.includes('strMeasure')) && (value != null) && (value != undefined)) {
                    measures.push(value);
                }
            }
              
            // console.log(ingredients);
            // console.log(measures);
            const drinkNameEl = document.createElement('h5');
            console.log(drinkName);
            drinkNameEl.innerHTML = drinkName;

        //for main img/title
            var drinkNameText = $("<h5>").text(drinkName);
            $("#mainimgholder").append(drinkNameText);
            var mainImg =  $("<img>").attr("src",  imageURL);
            $("#mainimgholder").append(mainImg);
            
            $("#instructions").text(howToMake);
           
            //ingredients list section
            var ListOverlay= $("<ul>").addClass("ingredients");
            const ingredientsEl = document.getElementById("ingredients");
            for(let i = 0; i < ingredients.length; i++) {
                let ingredientItems = document.createElement("li");
                //Checking to see if there is a measure for the ingredient
                if(measures[i] != null) {
                    ingredients[i] = measures[i] + " " + ingredients[i];
                }
                ingredientItems.innerHTML = ingredients[i];
                console.log(ingredientItems);
                ingredientsEl.append(ingredientItems);
            }
            console.log(ingredients);
            console.log(measures);
            
            // Setting drink instructions
            const instructionsEl = document.getElementById("instructions");
            instructionsEl.innerHTML = howToMake;

            // Getting drinks to recommend
            console.log(drinkArray);
            const rec1 = document.getElementById('namerec1');
            const rec2 = document.getElementById('namerec2');
            const rec3 = document.getElementById('namerec3');
            const rec4 = document.getElementById('namerec4');
            for (let i = 0; i < drinkArray.length; i++) {
                if(drinkArray[i] != drinkName) {
                    recArray.push(drinkArray[i]);

                }
            }
            for(var x = 0; x<recArray.length; x++){
                getRecs(recArray[x],x);
            }
            //getRecs(recArray);
            // Adding recommended drink names
            //console.log(urlArray);
            rec1.innerHTML = recArray[0];
            rec2.innerHTML = recArray[1];
            rec3.innerHTML = recArray[2];
            rec4.innerHTML = recArray[3];
            
            console.log('1');
            console.log(recArray);

        });
    }

    function getRecs(drink,x) {
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drink;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var imageURL = response.drinks[0].strDrinkThumb;

            if(x===0){
                var Img1 =  $("<img>").attr("src",  imageURL);
                $("#img1").append(Img1);
            }
            else if(x===1){
                var Img2 =  $("<img>").attr("src",  imageURL);
                $("#img2").append(Img2);
            }
            else if(x===2){
                var Img3 =  $("<img>").attr("src",  imageURL);
                $("#img3").append(Img3);
            }
            else{
                var Img4 =  $("<img>").attr("src",  imageURL);
                $("#img4").append(Img4);
            }

        });
    } 
});