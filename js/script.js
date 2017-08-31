// MODEL

var map;
var markers = [];
var popupinfo = [];

// list of locations that will be visible on map as points
// each location in list will be shown as a marker
// each marker will show popupinfo upon clicking
var locations = [
	{
		name: 'Central Library',
		streetAddress: '10375 Little Patuxent Pkwy',
		cityAndZip: 'Columbia, MD 21044',
		position: {lat: 39.221, lng: -76.860},
		imgUrl: 'http://www.hoodpad.com/img/site/b1a93c4e735.jpg'
	},
	{
		name: 'Miller Library',
		streetAddress: '9421 Frederick Rd',
		cityAndZip: 'Ellicott City, MD 21042',
		position: {lat: 39.272, lng: -76.841},
		imgUrl: 'http://www.columbiaengineering.com/Lists/Photos/Libraries/Miller%20Branch%20Library.jpg'
	},
	{
		name: 'Elkridge Library',
		streetAddress: '7071 Montgomery Rd',
		cityAndZip: 'Elkridge, MD 21075',
		position: {lat: 39.211, lng: -76.735},
		imgUrl: 'http://www.trbimg.com/img-535f9d2d/turbine/ph-elkridge-library'
	},
	{
		name: 'Glenwood Library',
		streetAddress: '2350 MD-97',
		cityAndZip: 'Cooksville, MD 21723',
		position: {lat: 39.306, lng: -77.024},
		imgUrl: 'https://s3.amazonaws.com/fun-dn.com/upload/620059_78805a-9c36edfc_large.jpg'
	},
	{
		name: 'Savage Library',
		streetAddress: '9525 Durness Ln',
		cityAndZip: 'Laurel, MD 20723',
		position: {lat: 39.132, lng: -76.838},
		imgUrl: 'http://3.bp.blogspot.com/-u_6cctA3TeQ/U6zJlAbkZTI/AAAAAAAAA1Y/kF3U2GJSdJ8/s1600/lib1.jpg'
	}
];

var Location = function(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.streetAddress = ko.observable(data.streetAddress)
	self.cityAndZip = ko.observable(data.cityAndZip);
	self.position = ko.observable(data.position);
	self.imgUrl = ko.observable(data.imgUrl);	
}

// VIEW MODEL

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 39.207, lng: -76.861},
	  zoom: 11
	});

	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	for(i=0; i<locations.length; i++) {
		// get position and name for each location from locations[]
		var position = locations[i].position;
		var address = locations[i].name + '<br>' + locations[i].streetAddress;
		address = address + '</br>'+ locations[i].cityAndZip;
		// create a merker for each location
		var marker = new google.maps.Marker({
			position: position,
			map: map,
			address: address,
			//icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/191-200.png',
			// https://developers.google.com/maps/documentation/javascript/markers
			animation: google.maps.Animation.DROP,
			id: i
		});
	// add newly created marker to markers[]
	markers.push(marker);
	// extend bounds of map for all markers
	bounds.extend(marker.position);
	// create and attach onclick event to open an infowindow for each marker
	marker.addListener('click', function() {
		populateInfoWindow(this, largeInfowindow);
		});
	}
	map.fitBounds(bounds);

	// document.getElementById('show').addEventListener('click', showLibraries);
	// document.getElementById('hide').addEventListener('click', hideLibraries);	
}	

function populateInfoWindow(marker, infowindow) {
	// check if infowindow is already open on current marker
	if(infowindow.marker != marker) {
		infowindow.marker =  marker;
		infowindow.setContent('<div>' + marker.address + '</div>');
		infowindow.open(map, marker);
		// clear marker is cleared if infowindow is closed
		infowindow.addListener('closeclick', function() {
			infowindow.setMarker = null;
		});
	}
}


var ViewModel = function() {
	var self = this;

	self.locationList = ko.observableArray([]);

	locations.forEach(function(location) {
		self.locationList.push(new Location(location));
	});

	self.currentLocation = ko.observable(self.locationList()[0]);

	// sets current location to clicked location
	self.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
	};
};

var vm = new ViewModel();
ko.applyBindings(vm);

