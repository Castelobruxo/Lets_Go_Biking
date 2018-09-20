
$(document).ready(function() {
   
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?zip=44126&units=imperial&APPID=cb5acdd0786623637d642f126e5ae380"


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){

            for (var i = 0; i < 4; i++) {
                if (response.list[i].weather[0].id > 800) {
                    $("#weathertext-" + i).text("Looks like today will be a bit cloudy, but should be good for a ride")
                    $("#weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/03d.png")
                    
                    } else if (response.list[i].weather[0].id === 800) {
                        $("#weathertext-" + i).text("Looks great out! Grab your bike and let's ride!")
                        $('#weatherimg-' + i).attr("src", "http://openweathermap.org/img/w/01d.png")
                    
                    } else if (response.list[i].weather[0].id >= 200 && response.list[i].weather[0].id < 300) {
                        console.log("Probably not a good idea to ride in these Thunderstorms")
                        console.log(i)
                    
                    } else if (response.list[i].weather[0].id >= 300 && response.list[i].weather[0].id < 400) {
                        console.log("Light Drizzle")
                        console.log(i)
                    
                    } else if (response.list[i].weather[0].id >= 500 && response.list[i].weather[0].id < 600) {
                        $("#weathertext-" + i).text("Rain! could make riding difficult")
                        $("#weatherimg-" + i).attr("src", "http://openweathermap.org/img/w/09d.png")
                        console.log("Rain")
                        console.log(i)
                    
                    } else if (response.list[i].weather[0].id >= 600 && response.list[i].weather[0].id < 700) {
                        console.log("Snow")
                        console.log(i)
                    }
            }
    });


});