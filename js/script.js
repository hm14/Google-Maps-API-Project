var map;
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 38.9076089, lng: -77.0744472},
	  zoom: 12
});
}