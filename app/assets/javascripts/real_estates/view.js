// Initilization
_scrollToContent();
$(function() {
	var $item = $('#real_estate_info');

	initPriceBox();
	initPosition();
	
	initFavoriteButton();

	_initItemList($item);

	/*
		Favorite button
	*/

		function initFavoriteButton() {
			$('[aria-click="favorite"]').on('click', function () {
				var 
					$button = $(this),
					isAdd = $button.find('i.active').length == 0

				$.ajax({
					url: '/real_estates/user_favorite/' + $item.data('value') + '/' + (isAdd ? '1' : '0'),
					method: 'POST',
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						if (isAdd) {
							$button.find('i').addClass('active');
							$button.find('span').text('Bỏ yêu thích');
						}
						else {
							$button.find('i').removeClass('active');
							$button.find('span').text('Yêu thích');
						}
					}
				});
			}).each(function () {
				var $button = $(this);
				
				if ($button.find('i.active').length != 0) {
					$button.find('span').text('Bỏ yêu thích');
				}
				else {
					$button.find('span').text('Yêu thích');
				}
			});
		}

	/*
		/ Favorite button
	*/
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