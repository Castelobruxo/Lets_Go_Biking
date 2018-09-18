    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: 'U0H0TkgUTq8csF1SBncQ',
        app_code: 'VAN4F5Ubnva4sqCz0aABVA',
        useHTTPS: true
    });
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
    });


    /**
     * VARIABLES
     *
     * @param geocorder      Gets an instance of the geocoding service
     * @param router         Gets an instance of the routing service\
     * @param  {H.Map} map   A HERE Map instance within the application
     * @param startClicked   Determines if the next input should go into the start location input box (set true by default)
     * @param endClicked     Determines if the next input should go into the end location input box
     * @param location_data  Holds places and geo coordinates that the user inputs (initialized to nothing)
     * @param explore        Obtain an Explore object through which to submit search requests:
     */
    var geocoder = platform.getGeocodingService();
    var router = platform.getRoutingService();
    var map;
    var startClicked = true;
    var endClicked = false;
    locationData = {
        start_lat: '',
        start_long: '',
        start_addr: '',
        end_lat: '',
        end_long: '',
        end_addr: ''
    }
    var explore = new H.places.Explore(platform.getPlacesService()),
        geoUserLocationResult, error;



    /**
     * FUNCTIONS
     * 
     */

    // creates an event listener for clicks/taps on the map
    function setUpClickListener(map) {
        // Attach an event listener to map display
        // obtain the coordinates and display in an alert box.
        // map.addEventListener('tap', function (evt) {
        //     var coord = map.screenToGeo(evt.currentPointer.viewportX,
        //         evt.currentPointer.viewportY);

        //     if (startClicked)
        //         document.getElementById('start-point').value = Math.abs(coord.lat.toFixed(4)) + ', ' + Math.abs(coord.lng.toFixed(4));
        //     else if (endClicked)
        //         document.getElementById('end-point').value = Math.abs(coord.lat.toFixed(4)) + ', ' + Math.abs(coord.lng.toFixed(4));

        // });
    }

    // get the current location of the device and send it to showPosition()
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

        // set the map variable
        map = new H.Map(document.getElementById('map'),
            defaultLayers.normal.map, {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                zoom: 15,
                pixelRatio: pixelRatio
            });


        //Step 3: make the map interactive
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // setup event listender to add touch/click functionality
        setUpClickListener(map);

    }

    // Define a callback function to process the geocoding response:
    var setGeoPoints = function (result) {
        console.log(result);
        var locations = result.Response.View[0].Result,
            marker;

        // set a marker on the map for the entered location
        marker = new H.map.Marker({
            lat: locations[0].Location.DisplayPosition.Latitude,
            lng: locations[0].Location.DisplayPosition.Longitude
        });
        map.addObject(marker);

        if (startClicked) {
            locationData.start_lat = locations[0].Location.DisplayPosition.Latitude;
            locationData.start_long = locations[0].Location.DisplayPosition.Longitude;
            locationData.start_addr = document.getElementById('search-location').value;
            document.getElementById('start-point').value = locationData.start_lat + ', ' + locationData.start_long;
            document.getElementById('start-point-p').innerText = locationData.start_addr;
        } else {
            locationData.end_lat = locations[0].Location.DisplayPosition.Latitude;
            locationData.end_long = locations[0].Location.DisplayPosition.Longitude;
            locationData.end_addr = document.getElementById('search-location').value;
            document.getElementById('end-point').value = locationData.end_lat + ', ' + locationData.end_long;
            document.getElementById('end-point-p').innerText = locationData.end_addr;
        }

    };

    // Define a callback function to process the routing response:
    var setRoute = function (result) {
        console.log(result);
        var route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
        if (result.response.route) {
            var res = result.response.route[0].leg[0].maneuver;

            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            // Create a linestring to use as a point source for the route line
            linestring = new H.geo.LineString();

            // Push all the points in the shape into the linestring:
            routeShape.forEach(function (point) {
                var parts = point.split(',');
                linestring.pushLatLngAlt(parts[0], parts[1]);
            });

            // Retrieve the mapped positions of the requested waypoints:
            startPoint = route.waypoint[0].mappedPosition;
            endPoint = route.waypoint[1].mappedPosition;

            // Create a polyline to display the route:
            var routeLine = new H.map.Polyline(linestring, {
                style: {
                    strokeColor: 'blue',
                    lineWidth: 10
                }
            });

            // Create a marker for the start point:
            var startMarker = new H.map.Marker({
                lat: startPoint.latitude,
                lng: startPoint.longitude
            });

            // Create a marker for the end point:
            var endMarker = new H.map.Marker({
                lat: endPoint.latitude,
                lng: endPoint.longitude
            });

            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine, startMarker, endMarker]);

            // Set the map's viewport to make the whole route visible:
            map.setViewBounds(routeLine.getBounds());

            document.getElementById('directions').innerHTML = '';
            for (var i = 0; i < res.length; i++) {
                document.getElementById('directions').innerHTML += '<span id="directions-span-' + i + '"><br /><input id="checkbox-' + i + '" type="checkbox" class="directions-checkbox">' + (i + 1) +
                    '. ' + res[i].instruction + '</span>';
            }

            // var checkboxes = document.querySelectorAll('#directions.directions-checkbox');
            // Array.from(checkboxes).forEach(function (box) {
            //     box.addEventListener('click', function () {
            //         console.log(this);
            //         // var id = element.id.split('-')[1];
            //         this.parentNode.removeChild(element);
            //     })
            // })
            var checkboxes = document.querySelectorAll('input[id^=checkbox-]');
            Array.from(checkboxes).forEach(function (box) {
                box.addEventListener('change', function () {
                    console.log(this.id.split('-')[1]);
                    var span = document.getElementById('directions-span-' + this.id.split('-')[1]);
                    span.parentNode.removeChild(span);
                })
            })
            // console.log(checkboxes);
        }
    };

    function toFixed13(val) {
        var num = parseFloat(val);
        return num.toFixed(13);
    }

    // display the results from the nearby search request
    var displayNearbyPOI = function(data) {
        nearby = data.results.items;
        // console.log(data);

        for (var i = 0; i < nearby.length; i++) {

            // var placeDiv = S
            console.log(
                'Name: ' + nearby[i].title +
                '\nCoords: ' + nearby[i].position[0] + ',' + nearby[i].position[1] +
                '\nDistance: ' + '' + nearby[i].distance +
                '\nAddress: ' + nearby[i].vicinity
            )
        }
    }

    // Define a callback to handle errors:
    var onError = function(data) {
        error = JSON.stringify(data);
        alert(error);
    }

    // find nearby POIs with the explorer
    var findNearby = function (cat) {
        if (!locationData.start_lat) {
            alert('please enter a starting location');
            return;
        }

        // Define search parameters:
        var params = {
                // Look for places matching the category "eat and drink":
                'cat': cat
            },
            // Define a headers object required by the request() method:
            headers = {
                // Location context in header reflecting the position of the user device:
                'Geolocation': 'geo:' + locationData.start_lat + ',' + locationData.start_long
            };

        // Run a search request with parameters, headers, and callback
        // functions:
        explore.request(params, headers, displayNearbyPOI, onError);
    }

    


    /*

        EVENT HANDLERS

    */

    document.getElementById('start-btn').addEventListener('click', function () {

        document.getElementById('start-btn').classList.add('btn-pressed');
        document.getElementById('end-btn').classList.remove('btn-pressed');
        startClicked = true;
        endClicked = false;
    })

    document.getElementById('end-btn').addEventListener('click', function () {

        document.getElementById('start-btn').classList.remove('btn-pressed');
        document.getElementById('end-btn').classList.add('btn-pressed');
        startClicked = false;
        endClicked = true;

    })

    document.getElementById('search-location-submit').addEventListener('click', function () {
        var location = document.getElementById('search-location').value;
        var geocodingParams = {
            searchText: location
        }

        // Call the geocode method with the geocoding parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        geocoder.geocode(geocodingParams, setGeoPoints, function (e) {
            alert(e);
        });
    })


    document.getElementById('find-route').addEventListener('click', function () {
        // get starting and ending point
        // var start = document.getElementById('start-point').value.split(',');
        // var end = document.getElementById('end-point').value.split(',');

        // Create the parameters for the routing request:
        var routingParameters = {
            // The routing mode:
            'mode': 'fastest;bicycle',
            // The start point of the route:
            // 'waypoint0': 'geo!' + toFixed13(start[0]) + ',' + toFixed13(start[1].trim()),
            'waypoint0': 'geo!' + locationData.start_lat + ',' + locationData.start_long,
            // The end point of the route:
            // 'waypoint1': 'geo!' + toFixed13(end[0].trim()) + ',' + toFixed13(end[1].trim()),
            'waypoint1': 'geo!' + locationData.end_lat + ',' + locationData.end_long,
            // To retrieve the shape of the route we choose the route
            // representation mode 'display'
            'representation': 'display'
        };

        // Call calculateRoute() with the routing parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        router.calculateRoute(routingParameters, setRoute,
            function (error) {
                alert(error.message);
            });
    })













    /*

        STARTUP methods

    */

    getLocation();