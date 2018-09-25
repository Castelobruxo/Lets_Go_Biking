# Lets_Go_Biking
A web app to create a bike route and check the weather


### APIs
1. HERE maps 
    * used to draw a map, set markers, and show the route to the user
2. Open Weather Map 
    * Used to get the weather for the near future and let the user know

### AJAX
* We used AJAX to contact the OWM API but the HERE Maps API has its own built in functions to call and return data

### Extra libraries
* We used Moment.js to format the times for the weather blocks

### Repeating elements
* For the repeating elements, we created a div that will hold the nearby points of interest so that the user can select a POI instead of typing in a specific address.  Every time the POI category changes, the nearby POIs are cleared and then dynamically created again with the new information.


# Presentation:
1. Application Concept
    * The user should be able to find a bike route, find points of interest, get directions, and check to make sure the weather is suitable for a ride.

2. Motivation
    * Riding on the same path every day gets very boring.  Therefore, we created an app that allows a user to easily find different bike routes around the city and also check the weather because no one wants to ride their bike in unsuitable conditions

3. Design Process 
    * Maps API
        - The Google Maps API is now a paid subscription and we wanted to stay with a free version so we avoided that.  There is another app called Waze that has a very nice layout for getting directions.  I looked into their API but they did not have one.  They mainly had an SDK that you could use in an app.  You could embed their live map in a website or search for location but it did not provide the details that we wanted for our program.  We wanted to get each direction, the distance to the destination, and sometimes even find a point of interest around the starting location.  Waze did not prove to give these details.  
        - The third API is HERE Maps.  They have a very extensive API that gives you all the details you request.  You can createive an interactive map on your website, get map images, connect to a geocoder, set up geofencing parameters, find routes, traffic data, and much more.  For our project, we used the routing system, the geocoder (for getting coordinates of a given address), and an exploring function (to find nearby points of interest from a certain location).
    * Weather API
        - We first looked into the Dark Sky API, which claims it is the easiest and most advanced weather API on the web (doesn't everyone claim that?).  After looking for a few minutes, we realized that it is a paid API and we wanted to keep our project free so we threw out that idea.
        - We then decided to use the Open Weather Map API because we have used it once before and are more familiar with it.  The documentation gave us some examples that allowed us to grab the data that we needed in order to show the user.
    * Page setup
        - The first thing a rider is going to think of when they want to go for a bike ride is most likely "How's the weather?."  Therefore, we put some weather details at the top of the page so that the user will see it first.  
        - The next thing the rider will think of is where they want to go.  Beneath the weather details on the page, we created the input boxes for the user to add a starting and ending point to their ride.  The user can type in an address or use their current location as the starting point.  The ending point can either be typed in by the user or they can select one of the results from using the select box and selecting a catgeory.
        - Beneath the input box is where the map and directions appear.  Once the user has set a starting and ending point and has clicked 'Find my route!', the map will render the route and the directions will appear in the corresponding box.  The directions box has a button that will allow the user to get rid of the current instruction and grab the next one from the list.  Since we couldn't make a full navigation app, we thought it would be nice if the user could take their phone with them and then click each time they finished an instruction.

4. Technologies Used
    * HERE Maps
        - HERE is a company that has an app just like Google Maps or Waze.  There is routing information, different transit types, traffic data, etc.  Their API supplied us with the routes after we provide geolocation coordinates to it.  They also have built in functions that allowed us to find nearby points of interest with a function called 'explore.'  HERE allowed us to add markers to the map and draw the route line when the start and end points were selected.
    * Open Weather Map
        - OWM has an API that allowed us to retrieve the weather in 3-hour increments along with a few days into the future.  This allowed us to show the user what the future weather will be in order to determine if it is a good time to take a ride.
    * Moment.js
        - Moment is a date library that we used in order to convert the times returned by the OWM API into AM/PM times that we could display to the user.
    * Forismatic API
        - This is an API that retrieves a random quote and displays it to the user for some extra motivation before their ride.

5. Demonstration 
    * Start with the weather
        - Describe how the weather is retrieved and shown to the user
    * Go to address input
        - Show that the map requests the device's location and will zoom in on those coordinates
        - Try to select a nearby POI category (show that it fails without a starting point set)
        - Input an invalid address to show input validation
        - Input a valid address to show input validation (again) 
            * Show that a marker has been placed on the map
            * Show the user selecting a nearby point of interest (and then calculating the route)
            * Show the user typing in an address (and then calculating the route)
        - Show the directions panel
            * Click the 'Next' button to show how the user can go through each direction while they ride

6. Future Development
    * Weather
        - Some future updates for the weather would be to put weather data in card (similar to what they are now), and then put all of the cards in a modal centered on the page.  This would allow us to add weather data for many more time intervals and the user can scroll through them if they want to see weather data for a time further than a few hours out.
    * Maps 
        - One feature we thought of but did not have the time to do was to create a 'Previous' button for the directions box. If a user accidentally hit 'Next', they could just hit the previous button to go back and continue their route.
        - It would also be nice to have something like intelisense for the search bar so that as a user types, it suggests addresses.  This would eliminate some errors since it would provide valid addresses instead of the user typing in an address and missing a character or two.
        - Another feature we wanted to implement was a random route calculator.  The idea behind it was that the user could tell the app that they wanted to go for a 10 mile bike ride round trip and it would find a random route for them to ride that would be about 10 miles long.
    * Other
        - We also wanted to create user accounts so that users could save a route to their favorites for later viewing or they could share the route on social media so that friends/family/followers can see what they are doing.







#### Informal Presentation
