
// JSON locations latitude and longitude
function LocationsJSON() {
 this.Locations = [{
					"name": "Pauls Church",
					"lat": "50.111194",
					"lng": "8.680744",
          "title": "<h1> die historiche kirche pauls kirch </h1>"
				},
				{
					"name": "MMK Museum of Modern",
					"lat": "50.113435",
					"lng": "8.682225",
          "title": "<h1> das modernste Museum </h1>"
				},
				{
					"name": "Römerberg",
					"lat": "50.110368",
					"lng": "8.682139",
          "title": "<h1> roemer berger str. Frankfurt </h1>"
				},
				{
					"name": "Historisches Museum",
					"lat": "50.109694",
					"lng": "8.682439",
          "title": "<h1> Historisches Museum in Frankfurt </h1>"
				},
				{
					"name": "Goethe University Frankfurt",
					"lat": "50.127182",
					"lng": "8.667526",
          "title": "<h1> Goethe University Frankfurt </h1>"
				},
				{
					"name": "Zoo Frankfurt",
					"lat": "50.116395",
					"lng": "8.699455",
          "title": " <h1> das frankfurte Zoo</h1>"
				},
				{
					"name": "Palmengarten",
					"lat": "50.122779",
					"lng": "8.658257",
          "title": "<h1> palmengarten im park </h1>"
				}];
};

// global map variable and infoWindow
var map;
var infowindow;
// initialze functionalty
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        }
    });
    infowindow = new google.maps.InfoWindow();
};

// marker functionalty
var icones = [];

function setIcon(listArr) {
    for (var i = 0; i < listArr.length; i++) {
        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: parseFloat(lat[i]),
                lng: parseFloat(lng[i])
            }
        });
        icones.push(marker);
    }
};


// event listner function for the markers
var infowindows = [];

function InfowindowsOfIcones(listArr) {
    // for loop to get all markers
    for (i = 0; i < listArr.length; i++) {
        var marker = icones[i];
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'); // change color
                marker.setAnimation(google.maps.Animation.BOUNCE); // set animation for each markers
                if (marker.animation == true) {
                    setTimeout(function() {
                        marker.setIcon(null)
                        marker.setAnimation(null);
                        infowindow.open(false)
                    }, 7000);
                };

                  infowindow.setContent(info[i].name +' '+ title2 +' '+ title3);
                  infowindows.push(infowindow);
                  infowindow.open(map, marker);
            };
        })(marker, i));
    }
};


//global new Arrays  getting name lat lng from the JSON
var info = new LocationsJSON().Locations,
    list = [],
    lat = [],
    lng = [];

function listLocation(e) {
    // for loop that get name lat and lng from JSON and pushing to new Arrays
    for (var i = 0; i < info.length; i++) {
        list.push(info[i].name);
        lat.push(info[i].lat);
        lng.push(info[i].lng);

    }
};


// viewModel function
var VM = function() {
    this.single = ko.observable("output"), // adding css class to menu to make it responsive
        this.multiple = ko.observableArray([]), // adding css class
        this.transform = ko.observable('menuItem'), // adding css class
        this.query = ko.observable([]); // adding the name to the DOM

    // functio decler the name event
    function namesList(e) {
        this.name = e;
    };

    this.items = []; // new Array to put the names on namesList(e)
    for (var i = 0; i < list.length; i++) {
        {
            this.items.push(new namesList(list[i])); //
        }
    };

    this.listItem = ko.observableArray(this.items);

    // check the search input
    this.textInput = function() {
        this.listItem.removeAll(); // removing all Names and markers ...
        for (i = 0; i < list.length; i++) {
            if (list[i].toLowerCase().indexOf(this.query().toLowerCase()) >= 0) {
                this.listItem.push(new namesList(list[i]));
                icones[i].setVisible(true);
            } else {
                icones[i].setVisible(false); // removing all markers
            }
        }
    };

    // adding evet to the names to open the InfoWindow of the markers
    this.nameEvent = function(event) {
        var x = event.name;

        for (i = 0; i < list.length; i++) {
            if (x.toLowerCase() == list[i].toLowerCase()) {
                infowindow.setContent(info[i].name +' '+ title2)
                infowindow.open(map, icones[i]); // open infoWindow markers
                icones[i].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'); // change color
                icones[i].setAnimation(google.maps.Animation.BOUNCE) // set Animation to the Markers

                var marker = icones[i];
                if (marker.animation == true) {
                    setTimeout(function() {
                        marker.setAnimation(null);
                        marker.setIcon(null);
                        infowindow.open(null);
                    }, 7000);
                }

            }

        }

    };
    // View Model css classes
    ko.bindingHandlers['class'] = {
        update: function(element, valueAccessor) {
            var currentValue = ko.utils.unwrapObservable(valueAccessor()),
                prevValue = element['__ko__previousClassValue__'],

                // Handles updating adding/removing classes
                addOrRemoveClasses = function(singleValueOrArray, shouldHaveClass) {
                    if (Object.prototype.toString.call(singleValueOrArray) === '[object Array]') {
                        ko.utils.arrayForEach(singleValueOrArray, function(cssClass) {
                            var value = ko.utils.unwrapObservable(cssClass);
                            ko.utils.toggleDomNodeCssClass(element, value, shouldHaveClass);
                        });
                    } else if (singleValueOrArray) {
                        ko.utils.toggleDomNodeCssClass(element, singleValueOrArray, shouldHaveClass);
                    }
                };
            // Remove old value(s) (preserves any existing CSS classes)
            addOrRemoveClasses(prevValue, false);
            // Set new value(s)
            addOrRemoveClasses(currentValue, true);
            // Store a copy of the current value
            element['__ko__previousClassValue__'] = currentValue.concat();
        }
    };

    this.change = function() { // check the classes to add to dom element
        this.single(this.single() === "output" ? "togglemenu" : "output");
        this.multiple(this.multiple() === 'menu' ? 'toggleClass' : 'menu');
        this.transform(this.transform() === "togglemenuItem" ? "menuItem" : "menuItem");
    };
};
// foursquare Adress with categoryId client id client secret
var foursquare = 'https://api.foursquare.com/v2/venues/search?categoryId=' +
    '4bf58dd8d48988d181941735&ll=50.110924,%208.682127&limit=30&radius=30&client_id=' +
    'D3RQVMI04VLDLJPKLYHTT5GEI1IUW53XNO01HYLPC5FO1L25&client_secret=' +
    'XH0XXYPXB10FTFOXOQ21MWNO1FTZB1PLHXV4ZRS04ZOSCJ4H&v=20151207 ';
// jquery that loading all function to app
var title2 = [],
   title3 = [];
$(document).ready(function() {
  $.getJSON(foursquare).done(function(data) { // loading the foursquareUrl
      $.each(data.response.venues, function(i, venues) {
        var res = data.response.venues[0];
        info.push(venues.name)
          title2.push(res.location.formattedAddress[1]),
          title3.push(res.location.formattedAddress[2])
     })
          VM();
          setIcon(list);
          InfowindowsOfIcones(list);
          ko.applyBindings(new VM());
    }).fail(function(e) {
      alert("It is an error" + e);
  });
  listLocation(info);
});

// if there an error load call this function
function googleError() {
    alert("failed to load page ");
}
