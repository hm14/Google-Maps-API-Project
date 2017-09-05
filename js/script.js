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

function googleMapsAPIError() {
	alert("Please try again. Your map did not load");
};

function createMarker(location) {
	var bounds = new google.maps.LatLngBounds();
	var infoWindow = new google.maps.InfoWindow();

	// gets position and name for each location from locations[]
	var description = '<b>' + location.name + '</b><br>' + location.streetAddress;
	description = description + '</br>'+ location.cityAndZip;
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
		// icon: image,
		animation: google.maps.Animation.DROP,
		// id: i
	});
	// extends bounds of map for all markers
	bounds.extend(marker.position);

	// marker.addListener('click', function() {
	//  	populateInfoWindow(this, infoWindow);
	//  	bounceMarker(this);
	// });

	return marker;
};

// creates infoWindows for each of the markers for all locations
function createInfoWindows() {

	infoWindows = [];

	for(i=0; i<locations.length; i++) {
		var infoWindow = new google.maps.InfoWindow();
		// sets content of infowindow to description of chosen marker
//		infoWindow.setContent('<div>' + markers[i].description + '</div>');
		infoWindow.setContent(marker.description);		
		// creates and attaches onclick event to open an infowindow for each marker
			markers[i].addListener('click', function() {
			populateInfoWindow(this, infoWindow);
		});
		// add newly created infoWindow to infoWindows
		infoWindows.push(infoWindow);
	}
};

// populates the contents of a clicked infoWindow
function populateInfoWindow(marker, infoWindow) {
	infoWindow.marker = marker;
	infoWindow.setContent('<div>' + marker.description + '</div>');
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
	// add animation to selected marker
	marker.setAnimation(google.maps.Animation.BOUNCE);
	// stop animation after 1500 ms i.e. 2 bounces
	setTimeout(function() {marker.setAnimation(null);}, 1500);
};

var ViewModel = function() {
	map = initMap();

	// calls functions for creating and setting markers
	//createInfoWindows();
	
	var self = this;

	this.locationList = ko.observableArray([]);
	//this.markerList = ko.observableArray([]);
	//this.infoWindowList = ko.observableArray([]);

	this.currentLocation = ko.observable();
	this.search = ko.observable('');

	locations.forEach(function(location) {
		var temp = new Location(location);
		//console.log(temp.marker.description);
		self.locationList.push(temp);
	});

	// sets current location to clicked location
	// opens infowindow and makes marker bounce for selected location 
	this.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
		bounceMarker(clickedLocation.marker);
	};

	this.filteredLocations = ko.computed(function() {	
		search = self.search().toLowerCase();
		if(search) {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var name = locationItem.name().toLowerCase();
				// console.log(name.search(search));
				var result = (name.search(search) >= 0);
					locationItem.visible(result);
					locationItem.showMarker();
					bounceMarker(locationItem.marker);
				return result;
			});
		}
		else {
			self.locationList().forEach(function(locationItem) {
				locationItem.visible(true);
			});
			return self.locationList();
		}
	});
};

var vm;

function init() {
	vm = new ViewModel();
	ko.applyBindings(vm);
}
