// Initilization
$(function() {
	initPosition();
});
// end

// Init map
function initPosition() {
	var 
		$map = $('#map'),
		$lat = $map.data('lat'),
		$long = $map.data('long');

  initMap('map', {
  	markers: [
  		{ 
  			latLng: { lat: $lat, lng: $long } 
  		}
  	]
  });
}
// end