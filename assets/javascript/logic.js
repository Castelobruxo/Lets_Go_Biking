var timeParse


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
                    var time = moment.unix(response.list[i].dt)
                    $(".t" + i).text(time.format("hh:mm A"))


                        // checks weather code from open weathermap API and prints relevent icon to screen
                    if (response.list[i].weather[0].id > 800) {
                        $("#weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/03d.png")
                        
                        } else if (response.list[i].weather[0].id === 800) {
                            $('#weatherimg-' + i).attr("src", "http://openweathermap.org/img/w/01d.png")
                        
                        } else if (response.list[i].weather[0].id >= 200 && response.list[i].weather[0].id < 300) {
                            $("#weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/11d.png")
                            
                        
                        } else if (response.list[i].weather[0].id >= 300 && response.list[i].weather[0].id < 400) {
                            $("weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/09d.png")
                            
                        
                        } else if (response.list[i].weather[0].id >= 500 && response.list[i].weather[0].id < 600) {
                            $("#weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/13d.png")
                        
                        } else if (response.list[i].weather[0].id >= 600 && response.list[i].weather[0].id < 700) {
                            $("weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/01d.png")
                        }
                }
                
            });

    }
    
    
    getLocation()

});