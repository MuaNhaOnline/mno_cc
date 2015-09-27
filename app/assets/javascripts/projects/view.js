// Initilization
$(function() {
	initPosition();
	Jump();
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

// init Jump
function Jump() {
	var top;
	$(window).load(function() {
		top = $('.navigator').offset().top;
		$body.animate({
			scrollTop: top
		}, 500)
	});
}