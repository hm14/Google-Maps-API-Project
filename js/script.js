var map;
var markers = [];
var popupinfo = [];

// list of locations that will be visible on map as points
// each location in list will be shown as a marker
// each marker will show popupinfo upon clicking
var locations = [
	{
		name: 'Central Library',
		address: '10375 Little Patuxent Pkwy,' + '<br>' + ' Columbia, MD 21044',
		position: {lat: 39.221, lng: -76.860},
		imgUrl: ''
	},
	{
		name: 'Miller Library',
		address: '9421 Frederick Rd,' + '<br>' + 'Ellicott City, MD 21042',
		position: {lat: 39.272, lng: -76.841},
		imgUrl: ''
	},
	{
		name: 'Elkridge Library',
		address: '7071 Montgomery Rd,' + '<br>' + 'Elkridge, MD 21075',
		position: {lat: 39.211, lng: -76.735},
		imgUrl: ''
	},
	{
		name: 'Glenwood Library',
		address: '2350 MD-97,' + '<br>' + 'Cooksville, MD 21723',
		position: {lat: 39.306, lng: -77.024},
		imgUrl: ''
	},
	{
		name: 'Savage Library',
		address: '9525 Durness Ln,' + '<br>' + 'Laurel, MD 20723',
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
	var bounds = new google.maps.LatLngBounds();

	for(i=0; i<locations.length; i++) {
		// get position and name for each location from locations[]
		var position = locations[i].position;
		var description = locations[i].name + '<br>' + locations[i].address;
		// create a merker for each location
		var marker = new google.maps.Marker({
			position: position,
			map: map,
			description: description,
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
			infowindow.setContent('<div>' + marker.description + '</div>');
			infowindow.open(map, marker);
			// clear marker is cleared if infowindow is closed
			infowindow.addListener('closeclick', function() {
				infowindow.setMarker(null);
			});
		}
	}

