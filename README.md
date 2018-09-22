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


# Presentaion:
1. Application Concept
    * The user should be able to find a bike route, find, points of interest, get directions, and check to make sure the weather is suitable for a ride.

2. Motivation
    * Riding on the same path every day gets very boring.  Therefore, we created an app that allows a user to easily find different bike routes around the city and also check the weather because no one wants to ride their bike in unsuitable conditions

3. Design Process 
    * 

4. Technologies Used
    * HERE Maps
        - HERE is a company that has an app just like Google Maps or Waze.  There is routing information, different transit types, traffic data, etc.  Their API supplied us with the routes after we provide geolocation coordinates to it.  They also have built in functions that allowed us to find nearby points of interest with a function called 'explore.'  HERE allowed us to add markers to the map and draw the route line when the start and end points were selected.
    * Open Weather Map
        - OWM has an API that allowed us to retrieve the weather in 3-hour increments along with a few days into the future.  This allowed us to show the user what the future weather will be in order to determine if it is a good time to take a ride.
    * Moment.js
        - 
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
    * 
