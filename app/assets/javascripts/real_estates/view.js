// Initilization
$(function() {
	initPriceBox();
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