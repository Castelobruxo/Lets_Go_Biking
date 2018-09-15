    /**
     * Boilerplate map initialization code starts below:
     */

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

    // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();

    // Get an instance of the routing service:
    var router = platform.getRoutingService();



    /**
     * An event listener is added to listen to tap events on the map.
     * Clicking on the map displays an alert box containing the latitude and longitude
     * of the location pressed.
     * @param  {H.Map} map      A HERE Map instance within the application
     */
    var map;
    var startClicked = true;
    var endClicked = false;


    function setUpClickListener(map) {
        // Attach an event listener to map display
        // obtain the coordinates and display in an alert box.
        map.addEventListener('tap', function (evt) {
            var coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
            // alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
            //     ((coord.lat > 0) ? 'N' : 'S') +
            //     ' ' + Math.abs(coord.lng.toFixed(4)) +
            //     ((coord.lng > 0) ? 'E' : 'W'));

            if (startClicked)
                document.getElementById('start-point').value = Math.abs(coord.lat.toFixed(4)) + ', ' + Math.abs(coord.lng.toFixed(4));
            else if (endClicked)
                document.getElementById('end-point').value = Math.abs(coord.lat.toFixed(4)) + ', ' + Math.abs(coord.lng.toFixed(4));

        });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)

        //Step 2: initialize a map
        // var map;


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

        setUpClickListener(map);

    }

    // Define a callback function to process the geocoding response:
    var setGeoPoints = function (result) {
        console.log(result);
        var locations = result.Response.View[0].Result,
            position,
            marker;
        // Add a marker for each location found
        // for (i = 0; i < locations.length; i++) {
        position = {
            lat: locations[0].Location.DisplayPosition.Latitude,
            lng: locations[0].Location.DisplayPosition.Longitude
        };
        marker = new H.map.Marker(position);
        map.addObject(marker);
        // }
        if (startClicked)
            document.getElementById('start-point').value = position.lat + ', ' + position.lng;
        else
            document.getElementById('end-point').value = position.lat + ', ' + position.lng;

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

    function toFixed13(val) {
        var num = parseFloat(val);
        return num.toFixed(13);
    }

    document.getElementById('find-route').addEventListener('click', function () {
        // get starting and ending point
        var start = document.getElementById('start-point').value.split(',');
        var end = document.getElementById('end-point').value.split(',');

        // Create the parameters for the routing request:
        var routingParameters = {
            // The routing mode:
            'mode': 'fastest;bicycle',
            // The start point of the route:
            'waypoint0': 'geo!' + toFixed13(start[0]) + ',' + toFixed13(start[1].trim()),
            // 'waypoint0': 'geo!' + start[0].trim() + ',' + start[1].trim(),
            // 'waypoint0': 'geo!50.1120423728813,8.68340740740811',
            // The end point of the route:
            'waypoint1': 'geo!' + toFixed13(end[0].trim()) + ',' + toFixed13(end[1].trim()),
            // 'waypoint1': 'geo!' + end[0].trim() + ',' + end[1].trim(),
            // 'waypoint1': 'geo!52.5309916298853,13.3846220493377',
            // To retrieve the shape of the route we choose the route
            // representation mode 'display'
            'representation': 'display'
        };

        // console.log(routingParameters);

        // Call calculateRoute() with the routing parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        router.calculateRoute(routingParameters, setRoute,
            function (error) {
                alert(error.message);
            });
    })


    // Obtain an Explore object through which to submit search requests:
    var explore = new H.places.Explore(platform.getPlacesService()),
        geoUserLocationResult, error;

    // Define search parameters:
    var params = {
            // Look for places matching the category "eat and drink":
            'cat': 'going-out'
        },
        // Define a headers object required by the request() method:
        headers = {
            // Location context in header reflecting the position of the user device:
            'Geolocation': 'geo:40.85992,-81.29529'
        };

    // Run a search request with parameters, headers, and callback
    // functions:
    explore.request(params, headers, onResult, onError);

    // Success handler - fetch the first set of detailed place data from
    // the response:
    function onResult(data) {
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
    function onError(data) {
        error = JSON.stringify(data);
        alert(error);
    }







    /*

        STARTUP methods

    */

    getLocation();