
$(document).ready(function() {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    
    // set the map to the device's current location 
    function showPosition(position) {
        // console.log(position.coords.latitude) 
        // console.log(position.coords.longitude)
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
       
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=cb5acdd0786623637d642f126e5ae380"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
    

            // console.log(time.format("HH:mm:ss"))
    
            // Logic for pushing cloud data and images to weather section
                for (var i = 0; i < 4; i++) {
                    
                    // uses Moment.js to change time code into military time
                    $("#temp" + i).text(Math.floor(response.list[i].main.temp) + "\xB0" + "F")
                    
                    
                    var time = moment.unix(response.list[i].dt)
                    $(".t" + i).text(time.format("hh:mm A"))

                    $("#weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png")

                }
                
            });

    }
    
    
    getLocation()

});