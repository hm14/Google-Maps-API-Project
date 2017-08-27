var map;
var markers = [];
var popupinfo = [];

// list of locations that will be visible on map as points
// each location in list will be shown as a marker
// each marker will show popupinfo upon clicking
var locations = [
	{
		name: 'Central Library',
		position: {lat: 39.221, lng: -76.860},
		imgUrl: ''
	},
	{
		name: 'Miller Library',
		position: {lat: 39.272, lng: -76.841},
		imgUrl: ''
	},
	{
		name: 'Elkridge Library',
		position: {lat: 39.211, lng: -76.735},
		imgUrl: ''
	},
	{
		name: 'Glenwood Library',
		position: {lat: 39.306, lng: -77.024},
		imgUrl: ''
	},
	{
		name: 'Savage Library',
		position: {lat: 39.132, lng: -76.838},
		imgUrl: ''
	}
];

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 39.207, lng: -76.861},
	  zoom: 11
	});

	var largeInfowindow = new google.maps.InfoWindow();

	for(i=0; i<locations.length; i++) {
		// get position and name for each location from locations[]
		var position = locations[i].position;
		var name = locations[i].name;
		// create a merker for each location
		var marker = new google.maps.Marker({
			position: position,
			map: map,
			name: name,
			animation: google.maps.Animation.DROP,
			id: i
		});
	// add newly created marker to markers[]
	markers.push(marker);
	// create and attach onclick event to open an infowindow for each marker
	marker.addListener('click', function() {
		populateInfoWindow(this, largeInfowindow);
		});
	}

	function populateInfoWindow(marker, infowindow) {
		// check if infowindow is already open on current marker
		if(infowindow.marker != marker) {
			infowindow.marker =  marker;
			infowindow.setContent('<div>' + marker.name + '</div>');
			infowindow.open(map, marker);
			// clear marker is cleared if infowindow is closed
			infowindow.addListener('closeclick', function() {
				infowindow.setMarker(null);
			});
		}
	}
}
