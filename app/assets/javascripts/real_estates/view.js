// Initilization
$(function() {
	initPriceBox();
	initPosition();
});
// end

// Init price-box
function initPriceBox() {
	var priceBox = $('#price_box');
	var SaleItem = $(priceBox).find('[role="SalePrice"]');
	var RentItem = $(priceBox).find('[role="RentPrice"]');
	
	if ($(SaleItem).hasClass('active')) {
		$(priceBox).css('border-color','#ff6511');
	} 
	else {
		$(priceBox).css('border-color','#038ed1');
	}

	$(SaleItem).on('click', function() {
		$(priceBox).css('border-color','#ff6511');
	});
	$(RentItem).on('click', function() {
		$(priceBox).css('border-color','#038ed1');
	});
}
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