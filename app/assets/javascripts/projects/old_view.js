// Initilization
$(function() {
	var $item = $('#project_info');

	initPosition();
	Jump();
	
	initFavoriteButton();

	_initItemList($('#project_info'));

	/*
		Favorite button
	*/

		function initFavoriteButton() {
			$('[aria-click="favorite"]').on('click', function () {
				var 
					$button = $(this),
					isAdd = $button.find('i.active').length == 0

				$.ajax({
					url: '/projects/user_favorite/' + $item.data('value'),
					method: 'POST',
					data: {
						is_add: isAdd ? 1 : 0
					},
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