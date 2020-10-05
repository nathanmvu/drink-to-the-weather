$(document).ready(function () {
    
    //global arrays of drinks 
    var coldDrinks = ["Irish Coffee", "Orange Scented Hot Chocolate", "Hot Creamy Bush","Rum Toddy","Melya",
                        "Salted Toffee Martini","Sherry Eggnog"]; 
    var midWeatherDrinks = ["Sidecar", "Dry Martini","Applecar","Apple Cider Punch #1", "Cranberry Punch",
                            "Masala Chai","Mulled Wine","Spiced Peach Punch"]; 
    var hotWeatherDrinks = ["Margarita", "Negroni", "Long Island Iced Tea", "Mojito", "Mai Tai",
                            "Mint Julep", "Painkiller", "Tom Collins", "Pina Colada",
                            "Manhattan", "Moscow Mule"]; 
    let partyDrinks = ["Zombie", "Jello shots", "Jack's Vanilla Coke", "Downshift", "Long Island Iced Tea"];
    let chillDrinks = ["Pina Colada", "White Wine Sangria", "Pineapple Paloma", "Planter's Punch", "Rum Punch"];
    let problemDrinks = ["Shot-gun", "Zombie", "Radioactive Long Island Iced Tea", "The Evil Blue Thing", "Death in the Afternoon", "Quick F**K"];
    let romanticDrinks = ["Sangria - The World's Best", "White Lady", "Wine Cooler", "Rose", "Vermouth Cassis"];
    var d = "";
    // bouncer.js initialization step
    var bouncer = new Bouncer('[data-validate]', {
        disableSubmit: true,
        customValidations: {
            valueMismatch: function (field) {
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
        $("#currentWeather").empty();
        return;
    });

    //go button clicked
    $("#go").on("click", function (event) {
        let feeling = document.getElementsByName('feelings');
        for (let i = 0, length = feeling.length; i < length; i++) {
            if (feeling[i].checked) {
              drinksByFeeling(feeling[i].value);
              // only one radio can be logically checked, don't check the rest
              break;
            }
        }
        $("#currentWeather").empty();
        return;
    });

    //passed location through ajax function
    function locationWeather(location) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=48cb01e208735d9aa940904774b4bdab&q=" + location;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $("#currentWeather").html("Current Weather in "+response.name+ " " +response.main.temp +" "+ "&#176F");
            //var weather = response.weather[0].main;
            var temp = response.main.temp;
            if (temp < 60) {
                //cold weather drinks          
                getDrinks(coldDrinks);
            }
            else if (temp > 60 && temp < 75) {
                //mid weather drinks             
                getDrinks(midWeatherDrinks);
            }
            else {
                //hot weather drinks
                getDrinks(hotWeatherDrinks);
            }
            return;

            // add if/else statement for bouncer.js here
        });
        return;
    }

    // Gets a feeling drink array to send to getDrinks
    function drinksByFeeling(mood) { 
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
        return;
    }

    //drinks api
    function getDrinks(drinkArray, drink) {
        $("#locationInput").val("");
        $("#mainimgholder").empty();
        $("#ingredients").empty();
        $("#instructions").empty();
        $("#img1").empty();
        $("#img2").empty();
        $("#img3").empty();
        $("#img4").empty();
        // if there is no drink get random drink??? -R
        if(drink===undefined){
            var randomCocktailIndex = Math.floor(Math.random() * (drinkArray.length));
            drink = drinkArray[randomCocktailIndex];
        }
        //pull the array
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drink;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var imageURL = response.drinks[0].strDrinkThumb;
            var drinkName = response.drinks[0].strDrink;
            var cocktailInstructions = response.drinks[0].strInstructions;
            $("#mainName").text(drinkName);
            $("#mainImg").attr("src", imageURL);
            setIngredients(response);
            $("#instructions").text(cocktailInstructions);

            // Getting drinks to recommend
            setDrinkRecs(drinkArray,drinkName);
            return;
        });
        return;
    }
    function setIngredients(response){
        //ingredients and messurements arrays
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
        //ingredients list section
        const ingredientsEl = document.getElementById('ingredients');
        ingredientsEl.innerHTML = '';
        let ingredientList = "";
        for(let i = 0; i < ingredients.length; i++) {
        //Checking to see if there is a measure for the ingredient

            if(measures[i] != null) {
                ingredientList += "<li>" + measures[i] + " " + ingredients[i] + "</li>";
            }
        }
        ingredientsEl.innerHTML = ingredientList;
        return;
    }

    // Sets drink recommendations
    function setDrinkRecs(drinkArray,drinkName){
        var recArray = [];
        const rec1 = document.getElementById('namerec1');
        const rec2 = document.getElementById('namerec2');
        const rec3 = document.getElementById('namerec3');
        const rec4 = document.getElementById('namerec4');
        for (let i = 0; i < drinkArray.length; i++) {
            if(drinkArray[i] != drinkName) {
                recArray.push(drinkArray[i]);
            }
        }
        for(var x = 0; x<4; x++){
            getRecs(recArray[x],x,drinkArray);
        }
        rec1.innerHTML = recArray[0];
        rec2.innerHTML = recArray[1];
        rec3.innerHTML = recArray[2];
        rec4.innerHTML = recArray[3];
        recArray = [];
        d = drinkArray
        return;
    }
    
    // Getting drink recommendations
    function getRecs(drink,x, drinkArray) {
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drink;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            if(response.drinks != null) {
                var imageURL = response.drinks[0].strDrinkThumb;
                //make them buttons
                if(x===0){
                    $("#img1").attr("src",  imageURL);
                    $("#img1").attr("alt", drink);
                    $("#img1").val(drink);
                }
                else if(x===1){
                    $("#img2").attr("src",  imageURL);
                    $("#img2").attr("alt", drink);
                    $("#img2").val(drink);
                }
                else if(x===2){
                    $("#img3").attr("src",  imageURL);
                    $("#img3").attr("alt", drink);
                    $("#img3").val(drink);
                }
                else if(x===3){
                    $("#img4").attr("src",  imageURL);
                    $("#img4").attr("alt", drink);
                    $("#img4").val(drink);
                }
            }  
            return;  
        });
        return;
    } 

    $("#img1").on("click", function(event) {
        event.preventDefault();
        $('#ingredients').empty();
        var drink = $("#img1").val();
        getDrinks(d, drink);
        $("#currentWeather").empty();
    });
    $("#img2").on("click", function() {
        $('#ingredients').empty();
        var drink = $("#img2").val();
        getDrinks(d, drink);
        $("#currentWeather").empty();
    });
    $("#img3").on("click", function() {
        $('#ingredients').empty();
        var drink = $("#img3").val();
        getDrinks(d, drink);
        $("#currentWeather").empty();
    });
    $("#img4").on("click", function() {
        $('#ingredients').empty();
        var drink = $("#img4").val();
        getDrinks(d, drink);
        $("#currentWeather").empty();
    });
});

