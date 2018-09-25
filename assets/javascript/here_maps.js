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
       * @param mapObjects     Holds all objects added to the map (markers, route line, etc)
       * @param startClicked   Determines if the next input should go into the start location input box (set true by default)
       * @param endClicked     Determines if the next input should go into the end location input box
       * @param location_data  Holds places and geo coordinates that the user inputs (initialized to nothing)
       * @param explore        Obtain an Explore object through which to submit search requests:
       */
      var geocoder = platform.getGeocodingService();
      var router = platform.getRoutingService();
      var map;
      var mapObjects = [];
      var startClicked = true;
      var endClicked = false;
      locationData = {
          start_lat: '',
          start_long: '',
          start_addr: '',
          end_lat: '',
          end_long: '',
          end_addr: '',
          current_lat: '',
          current_long: ''
      }
      var explore = new H.places.Explore(platform.getPlacesService()),
          geoUserLocationResult, error;



      /**
       * FUNCTIONS
       * 
       */


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

          // set the current location into the locationData object for use later on
          locationData.current_lat = position.coords.latitude;
          locationData.current_long = position.coords.longitude;

          //Step 3: make the map interactive
          // MapEvents enables the event system
          // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
          var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      }

      // Define a callback function to process the geocoding response:
      var setStartGeoPoints = function (result) {

          // clear old validations
          var startInput = $('#start-location');
          startInput.removeClass('input-error');
          startInput.removeClass('input-ok');
          $('.loc-error').addClass('hide');

          // make sure that a valid location came back (check the obj in the console for details)
          if (!result.Response.View.length) {
              startInput.addClass('input-error');
              $('.loc-error').removeClass('hide');
              return;
          }
          startInput.addClass('input-ok');

          var locations = result.Response.View[0].Result,
              marker;

          // set a marker on the map for the entered location
          marker = new H.map.Marker({
              lat: locations[0].Location.DisplayPosition.Latitude,
              lng: locations[0].Location.DisplayPosition.Longitude
          });
          map.addObject(marker);
          mapObjects = mapObjects.concat(marker);

          // store data in the location object for later use
          locationData.start_lat = locations[0].Location.DisplayPosition.Latitude;
          locationData.start_long = locations[0].Location.DisplayPosition.Longitude;
          locationData.start_addr = document.getElementById('start-location').value;

      };

      // Define a callback function to process the geocoding response:
      var setEndGeoPoints = function (result) {

          // clear old validations
          var endInput = $('#end-location');
          endInput.removeClass('input-error');
          endInput.removeClass('input-ok');
          $('.loc-error').addClass('hide');

          // console.log(result.Response.View.length);
          if (!result.Response.View.length) {
              endInput.addClass('input-error');
              $('.loc-error').removeClass('hide');
              return;
          }

          endInput.addClass('input-ok');


          var locations = result.Response.View[0].Result,
              marker;

          // set a marker on the map for the entered location
          marker = new H.map.Marker({
              lat: locations[0].Location.DisplayPosition.Latitude,
              lng: locations[0].Location.DisplayPosition.Longitude
          });
          map.addObject(marker);
          mapObjects = mapObjects.concat(marker);

          locationData.end_lat = locations[0].Location.DisplayPosition.Latitude;
          locationData.end_long = locations[0].Location.DisplayPosition.Longitude;
          locationData.end_addr = document.getElementById('end-location').value;
      };


      // Define a callback function to process the routing response:
      var setRoute = function (result) {

          // make sure a valid route response came back
          if (!result.response)
              return;

          // clear the markers and route line from the previous calculation, if any
          map.removeObjects(mapObjects);

          mapObjects = [];

          var route,
              routeShape,
              startPoint,
              endPoint,
              linestring;


          // create the route and add it to the map
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

              // add all the objects to an array so they can be removed from the map later
              mapObjects = mapObjects.concat(routeLine, startMarker, endMarker);

              // Add the route polyline and the two markers to the map:
              map.addObjects([routeLine, startMarker, endMarker]);

              // Set the map's viewport to make the whole route visible:
              map.setViewBounds(routeLine.getBounds());

              // Dynamically insert each instruction into the directions div beside the map
              $('#all-instructions').empty();
              for (var i = 0; i < res.length; i++) {
                  var hr = $('<hr>')
                      .addClass('direction-hr')

                  var p = $('<p>')
                      .addClass('direction-p')
                      .attr('id', 'direction-p-' + i)

                  if (!i)
                      p.addClass('bold-instruction'); // make the text bold and bigger since it will appear in the top bar

                  var input = $('<input type="checkbox">')
                      .attr('id', 'direction-checkbox-' + i)
                  if (i)
                      input.addClass('hide');


                  var span = $('<span>')
                      .html(
                          res[i].instruction
                      )


                  // p.append(input).append(span).append(hr);
                  p.append(span).append(hr);

                  if (i)
                      $('#all-instructions').append(p);
                  else {
                      $('#all-instructions').empty(); // get rid of the filler text
                      $('#next-instruction').empty().append(p); // append the first instruction into the top box
                  }
              } // end 'for' loop

          }
      };

      // display the results from the nearby search request
      var displayNearbyPOI = function (data) {
          nearby = data.results.items;

          // create cards for each POI and display them to the user
          for (var i = 0; i < nearby.length; i++) {

              //create new POI here
              var row;

              if (i == 0) {
                  row = $('<div>')
                      .addClass('row')
              }

              if (i % 4 == 0 && i != 0) {
                  // append the last row
                  $('.localoptions').append(row).append('<hr>');

                  // reset row
                  row = $('<div>')
                      .addClass('row')
              }

              var card = $('<div>')
                  .addClass('card poi-card')
                  .attr('style', 'width: 100%');

              var cardBody = $('<div>')
                  .addClass('card-body');

              var cardTitle = $('<h5>')
                  .addClass('card-title')
                  .attr('style', 'font-weight: bold')
                  .html(nearby[i].title)

              var cardText = $('<div>')
                  .addClass('card-text')
                  .html('Distance: ' + nearby[i].distance +
                      '<br />Address: ' + nearby[i].vicinity);

              cardBody.append(cardTitle)
              cardBody.append(cardText)
              card.append(cardBody);


              //   var text = $('<div>')
              //       .addClass('poi-card')
              //       .html(
              //           'Name: ' + nearby[i].title +
              //           // '<br />Coords: ' + nearby[i].position[0] + ',' + nearby[i].position[1] +
              //           '<br />Distance: ' + '' + nearby[i].distance +
              //           '<br />Address: ' + nearby[i].vicinity
              //       )

              var div = $('<div>')
                  .addClass('col-md-3 col-sm-6 col-xs-12 nearby-poi')
                  // .attr('style', 'margin: 2px 0px')
                //   .html(text)
                  .html(card)
                  .attr('data-lat', nearby[i].position[0])
                  .attr('data-long', nearby[i].position[1])
                  .attr('data-name', nearby[i].title)
                  .attr('data-address', nearby[i].vicinity)

              // append the new colum on the row
              row.append(div);

              // append the last row whether it is full or not
              if (i == (nearby.length - 1))
                  $('.localoptions').append(row);

          }

          if ($('#local-options').hasClass('hide'))
              $('#local-options').removeClass('hide');

      } // end displayNearbyPOI()

      // Define a callback to handle errors:
      var onError = function (data) {
          error = JSON.stringify(data);
          alert(error);
      }

      // find nearby POIs with the explorer
      var findNearby = function (cat) {
          $('.startinput').removeClass('input-error');

          // if there is no starting point, a nearby POI cannot be found
          if (!locationData.start_lat) {
              $('.startinput').addClass('input-error');
              return;
          }

          // Define search parameters:
          var params = {
                  // Look for places matching the category "eat and drink":
                  'cat': cat,
                  'metricSystem': 'imperial'
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

      // set the starting point to the device's current geo coordinates
      $('#start-current-loc').on('click', function (evt) {
          // prevent the form from submitting
          evt.preventDefault();

          // change the start location lat and long to the current lat and long
          locationData.start_lat = locationData.current_lat;
          locationData.start_long = locationData.current_long;

          $('#start-location').val(locationData.start_lat + ',' + locationData.start_long)

          $('.loc-error').addClass('hide');
          $('#start-location').removeClass('input-error').addClass('input-ok');

      })

      // get the value from the start input box and make sure it is valid (by sending it to the API and 
      // setting client side variables in the callabck )
      $('#start-location-submit').on('click', function () {
          var location = document.getElementById('start-location').value;
          var geocodingParams = {
              searchText: location
          }

          // call setGeoPoints to set the map to the start point and set the properties in 'locationData'
          geocoder.geocode(geocodingParams, setStartGeoPoints, function (e) {
              alert(e);
          });
      })

      // get the value from the end input box and make sure it is valid (by sending it to the API and 
      // setting client side variables in the callabck )
      $('#end-location-submit').on('click', function () {
          var location = document.getElementById('end-location').value;
          var geocodingParams = {
              searchText: location
          }

          // call setGeoPoints to set the map to the start point and set the properties in 'locationData'
          geocoder.geocode(geocodingParams, setEndGeoPoints, function (e) {
              alert(e);
          });
      })

      // is used to determine if a touch event on mobile phones is a touch and move (scrolling the page)
      // or is just a plain touch (like a mouse click)
      var touchMove;
      // get the data from a POI when the div is clicked and change the destination to that POI
      $('body').on('click touchend', '.nearby-poi', function () {
          // if the touch event is a move, or scroll, do not run this function  
          if (touchMove)
              return;

          var lat = $(this).attr('data-lat');
          var long = $(this).attr('data-long');
          var address = $(this).attr('data-address');
          var name = $(this).attr('data-name');

          locationData.end_lat = lat;
          locationData.end_long = long;
          locationData.end_addr = address;

          $('#end-location').val(address);
          $('#local-options').addClass('hide');

      })

      // if the event is a move or scroll, set the touchMove to true so the event above does not run   
      $('body').on('touchmove', '.nearby-poi', function () {
          touchMove = true;
      })
      //   if the event is a click, set touchMove to false so the function above runs
      $('body').on('touchstart', '.nearby-poi', function () {
          touchMove = false;
      })

      $('#get-next-instruction').on('click', function () {

          if (!$('#next-instruction').children().length)
              return;

          var currentId = $('#next-instruction').children()[0].id.split('-')[2];

          var next = $('#direction-p-' + (parseInt(currentId) + 1));

          next.addClass('bold-instruction');

          $('#next-instruction').empty().append(next);
      })

      $('#nearby-select').on('change', function () {
          $('#start-location').removeClass('input-error');
          if (!locationData.start_lat || !locationData.start_long) {
              $('#start-location').addClass('input-error');
              $(this).val(0);
              return;
          }
          var cat = $('#nearby-select').val();

          // clear the results from the last chane
          $('.localoptions').empty();
          findNearby(cat);

      });

      document.getElementById('calculate-route').addEventListener('click', function () {
          // Create the parameters for the routing request:
          var routingParameters = {
              // The routing mode:
              'mode': 'fastest;bicycle',
              // The start point of the route:
              'waypoint0': 'geo!' + locationData.start_lat + ',' + locationData.start_long,
              // The end point of the route:
              'waypoint1': 'geo!' + locationData.end_lat + ',' + locationData.end_long,
              // To retrieve the shape of the route we choose the route
              // representation mode 'display'
              'representation': 'display',
              // send back directions in imperial, not metric
              'metricSystem': 'imperial'
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