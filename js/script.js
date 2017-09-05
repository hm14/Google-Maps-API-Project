// MODEL

var map;
var infoWindows;
var prevInfoWindow;

// list of locations that will be visible on map as points
// each location in list will be shown as a marker
// each marker will show popupinfo upon clicking
var locations = [
	{
		name: 'Central Library',
		streetAddress: '10375 Little Patuxent Pkwy',
		cityAndZip: 'Columbia, MD 21044',
		position: {lat: 39.221, lng: -76.860},
		imgUrl: 'http://www.hoodpad.com/img/site/b1a93c4e735.jpg',
		id: 0
	},
	{
		name: 'Miller Library',
		streetAddress: '9421 Frederick Rd',
		cityAndZip: 'Ellicott City, MD 21042',
		position: {lat: 39.272, lng: -76.841},
		imgUrl: 'http://www.columbiaengineering.com/Lists/Photos/Libraries/Miller%20Branch%20Library.jpg',
		id: 1
	},
	{
		name: 'Elkridge Library',
		streetAddress: '7071 Montgomery Rd',
		cityAndZip: 'Elkridge, MD 21075',
		position: {lat: 39.211, lng: -76.735},
		imgUrl: 'http://www.trbimg.com/img-535f9d2d/turbine/ph-elkridge-library',
		id: 2
	},
	{
		name: 'Glenwood Library',
		streetAddress: '2350 MD-97',
		cityAndZip: 'Cooksville, MD 21723',
		position: {lat: 39.306, lng: -77.024},
		imgUrl: 'https://s3.amazonaws.com/fun-dn.com/upload/620059_78805a-9c36edfc_large.jpg',
		id: 3
	},
	{
		name: 'Savage Library',
		streetAddress: '9525 Durness Ln',
		cityAndZip: 'Laurel, MD 20723',
		position: {lat: 39.132, lng: -76.838},
		imgUrl: 'http://3.bp.blogspot.com/-u_6cctA3TeQ/U6zJlAbkZTI/AAAAAAAAA1Y/kF3U2GJSdJ8/s1600/lib1.jpg',
		id: 4
	}
];

// this is the object called from ViewModel
// to push locations from locations[] to locationList[]
var Location = function(data) {
	this.name = ko.observable(data.name);
	this.streetAddress = ko.observable(data.streetAddress)
	this.cityAndZip = ko.observable(data.cityAndZip);
	this.position = ko.observable(data.position);
	this.imgUrl = ko.observable(data.imgUrl);
	this.id = ko.observable(data.id);
	this.status = 1;
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
}

// initializes Google Map
function initMap() {
	var bounds = new google.maps.LatLngBounds();

	// creates a new map with given center and zoom attributes
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 39.207, lng: -76.861},
	  zoom: 10
	});
	return map;

	bounds.extend(marker.position);
};

// informs user if there an error in loading map
function googleMapsAPIError() {
	alert("Please try again. Your map did not load");
};

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
		position: location.position,
		map: map,
		description: description,
		// customizes icon as assigned image
		icon: image,
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
};

// populates the contents of a clicked infoWindow
function populateInfoWindow(marker, infoWindow) {
	infoWindow.marker = marker;
	// sets content of infowindow to description of chosen marker
	infoWindow.setContent('<div>' + marker.description + '</div>');
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
};

// makes the marker of the selected location bounce
function bounceMarker(marker) {
	// adds animation to selected marker
	marker.setAnimation(google.maps.Animation.BOUNCE);
	// stops animation after 1500 ms i.e. 2 bounces
	setTimeout(function() {marker.setAnimation(null);}, 1500);
};

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
