// MODEL

var map;
var infoWindows;
var prevInfoWindow;

// list of locations that will be visible on map as points
// each location in list will be shown as a marker
// each marker will show popupinfo upon clicking
var locations = [
	{
		name: 'Catonsville Library',
		streetAddress: '1100 Frederick Rd,',
		cityAndZip: 'Catonsville, MD 21228',
		lat: 39.270,
		lng: -76.742,
		id: '4b9f5d9ff964a5208f1e37e3',
		imgUrl: 'https://outgress.com/proxy/iMuAdIkNXKGtIXYjbTqZf48Uu0c6dms5%2FVQkRFWjNssdXCS9e0Mjys3AUiIlUTUrMTyyZI1quQLvvXs9vu0kNog%2BfYqCnqq5hULtcMHWJShkWf4cRt1lhC15YQm1eQ1q%2FsX%2B7YAeaeJ5YS8%3D/image.png',
	},
	{
		name: 'Central Library',
		streetAddress: '10375 Little Patuxent Pkwy',
		cityAndZip: 'Columbia, MD 21044',
		lat: 39.211,
		lng: -76.860,
		id: '582ccb21a8b55d58005fb2ce',
		imgUrl: 'http://www.hoodpad.com/img/site/b1a93c4e735.jpg',
	},
	{
		name: 'Elkridge Library',
		streetAddress: '7071 Montgomery Rd',
		cityAndZip: 'Elkridge, MD 21075',
		lat: 39.211,
		lng: -76.735,
		id: '4ee2a46ce4b04d23df1429eb',
		imgUrl: 'http://www.trbimg.com/img-535f9d2d/turbine/ph-elkridge-library',
	},
	{
		name: 'Glenwood Library',
		streetAddress: '2350 MD-97',
		cityAndZip: 'Cooksville, MD 21723',
		lat: 39.306,
		lng: -77.024,
		id: '4b60adf3f964a520b0f329e3',
		imgUrl: 'https://s3.amazonaws.com/fun-dn.com/upload/620059_78805a-9c36edfc_large.jpg',
	},
	{
		name: 'Miller Library',
		streetAddress: '9421 Frederick Rd',
		cityAndZip: 'Ellicott City, MD 21042',
		lat: 39.272,
		lng: -76.841,
		id: '4b461f08f964a520181726e3',
		imgUrl: 'http://www.columbiaengineering.com/Lists/Photos/Libraries/Miller%20Branch%20Library.jpg',
	},
	{
		name: 'Olney Library',
		streetAddress: '3500 Olney Laytonsville Rd,',
		cityAndZip: 'Olney, MD 20832',
		lat: 39.276,
		lng: -77.041,
		id: '4ba2689cf964a520f8f537e3',
		imgUrl: 'http://www.olneyartassociation.org/sites/default/files/field/image/Olney%20Library.png',
	},
	{
		name: 'Savage Library',
		streetAddress: '9525 Durness Ln',
		cityAndZip: 'Laurel, MD 20723',
		lat: 39.132,
		lng: -76.838,
		id: '4b881007f964a520cddc31e3',
		imgUrl: 'http://3.bp.blogspot.com/-u_6cctA3TeQ/U6zJlAbkZTI/AAAAAAAAA1Y/kF3U2GJSdJ8/s1600/lib1.jpg',
	}
];

// this is the object called from ViewModel
// to push locations from locations[] to locationList[]
var Location = function(data) {
	this.name = ko.observable(data.name);
	this.streetAddress = ko.observable(data.streetAddress);
	this.cityAndZip = ko.observable(data.cityAndZip);
	this.imgUrl = ko.observable(data.imgUrl);
	this.visible = ko.observable(true);

	this.marker = createMarker(data);

	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		}
		else {
			this.marker.setMap(null);
		}
		return true;
	}, this);
};

// initializes Google Map
function initMap() {
	// creates a new map with given center and zoom attributes
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 39.207, lng: -76.861},
	  zoom: 10
	});
	return map;
}

// informs user if there an error in loading google map
function googleMapsAPIError() {
	alert("Please try again. Your Google map did not load");
}

// creates a marker for given location
function createMarker(location) {
	var bounds = new google.maps.LatLngBounds();
	var infoWindow = new google.maps.InfoWindow();

	// creates description of marker
	// description is used later to set content of marker's infowindow
	var description = '<b>' + location.name + '</b><br>' + location.streetAddress;
	description = description + '</br>'+ location.cityAndZip;
	// assigns attributes to image that is to be used as icon
	var image = {
		url: 'http://graphichive.net/uploaded/1291812963.jpg',
		size: new google.maps.Size(40, 40),
		origin: new google.maps.Point(265, 125),
		anchor: new google.maps.Point(20, 10)
	};
	// creates a marker for each location
	var marker = new google.maps.Marker({
		lat: location.lat,
		lng: location.lng,
		position: {lat: location.lat, lng: location.lng},
		id: location.id,
		map: map,
		description: description,
		// customizes icon as assigned image
		//icon: image,
		// assigns drop animation to marker
		animation: google.maps.Animation.DROP,
	});
	// extends bounds of map for marker
	bounds.extend(marker.position);

	// creates and attaches onclick event
	// to open an infowindow and bounce for each marker
	marker.addListener('click', function() {
	 	populateInfoWindow(this, infoWindow);
	 	bounceMarker(this);
	});

	return marker;
}

// populates the contents of a clicked infoWindow
function populateInfoWindow(marker, infoWindow) {
	var self = this;

	var fourSquareUrl = 'https://api.foursquare.com/v2/venues/';
	// foursquare API client id and secret
	var fourSquareClientId = '34BOLZENAJP53ZPZDNV4YX1C5G3YDJLZU1MYE4Q5QYYNC3OC';
	var fourSquareClientSecret = 'GVJWIKTE31VGYYWSOE15XUVVR0AZOGWK1I3N5HLPFTEEMYSO';

	var fourSquareAPIPoint = fourSquareUrl + marker.id +
	'?client_id=' + fourSquareClientId + '&client_secret=' + fourSquareClientSecret +
	'&v=20170808';

	// sends GET request to foursquare API
	$.ajax({
		type: 'GET',
		url: fourSquareAPIPoint,
		processData: false,
		
	})
	// this gets executed when above request is successful
	.done(function(data) {
		var venue = data.response.venue;
		var likes = venue.likes.count;
		var rating = venue.rating;

		if(!likes) {
			likes = 0;
		}
		if(!rating) {
			rating = 0;
		}

		var locationData = '<br><b>Likes:</b> ' + likes + '<br>';
		locationData = locationData + ' <b>Rating: </b>' + rating + '/10<br>';

		infoWindow.marker = marker;
		// sets content of infowindow to description of chosen marker
		infoWindow.setContent('<div>' + marker.description + '<br>' + locationData + '</div>');
		// opens infowindow of marker on map
		infoWindow.open(map, marker);
		// clears marker when infowindow is closed
		infoWindow.addListener('closeclick', function() {
			infoWindow.setMarker = null;
		});		

		// checks if a previous infowindow was opened
		// checks if previous window is not same as infowindow
		if(prevInfoWindow && prevInfoWindow != infoWindow) {
			prevInfoWindow.close();
		}

		// saves value of current infowindow
		prevInfoWindow = infoWindow;
	})
	// this gets executed when the above request is not successful
	.fail(function(error) {
		// informs user if there an error in loading foursquare data
		alert("Please try again. Your foursquare data did not load");
	});
}

// makes the marker of the selected location bounce
function bounceMarker(marker) {
	// adds animation to selected marker
	marker.setAnimation(google.maps.Animation.BOUNCE);
	// stops animation after 1500 ms i.e. 2 bounces
	setTimeout(function() {marker.setAnimation(null);}, 1500);
}

// VIEW MODEL

var ViewModel = function() {
	// initializes a Google Map and saves as map variable
	// important: this is the map shown in #map div in index.html
	map = initMap();

	var self = this;

	var infoWindow = new google.maps.InfoWindow();

	this.locationList = ko.observableArray([]);

	this.currentLocation = ko.observable();
	// important: the data-binding in index.html is for search
	this.search = ko.observable('');

	locations.forEach(function(location) {
		// creates a Location instance for each item in locations array
		self.locationList.push(new Location(location));
	});

	// sets current location to clicked location
	// opens infowindow and makes marker bounce for selected location 
	this.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
		// animates clickedLocation's marker
		bounceMarker(clickedLocation.marker);
		// sets content of infoWindow of clickedLocation's marker
		populateInfoWindow(clickedLocation.marker, infoWindow);
	};

	// filters through locationList to find locations that match user search
	// important: the data-binding in index.html is for filteredLocations
	this.filteredLocations = ko.computed(function() {	
		search = self.search().toLowerCase();
		// handles the case when user enters input in search box
		if(search) {
			// adds locationItem to filteredLocations if result is true
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				// take care of case sensitivity of user entered search
				var name = locationItem.name().toLowerCase();
				var result = (name.search(search) >= 0);
					// sets matched location to visible 
					// visibility applies to both list item and marker
					locationItem.visible(result);
					locationItem.showMarker();
					// animates location markers matching user search
					bounceMarker(locationItem.marker);
				// returns true if match found
				return result;
			});
		}
		// returns original locationList if search box is empty
		// handles the case when user enters nothing or enters and deletes input
		else {
			self.locationList().forEach(function(locationItem) {
			// sets all locations as visible
			locationItem.visible(true);
			});
			return self.locationList();
		}
	});
};

var vm;

// this function is called from index.html
// applies ko bindings to ViewModel at initialize
function init() {
	vm = new ViewModel();
	ko.applyBindings(vm);
}
