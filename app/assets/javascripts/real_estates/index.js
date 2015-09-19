// Initilization
$(function() {
	//init dot dot dot
	$('[data-dot]').dotdotdot({
		watch: 'window'
	});

	//init slick	
	$('.favorite-property').find('.content').slick({
		fade: true,
		dots: true,
		prevArrow: $(this).find('#favor-prev'),
		nextArrow:  $(this).find('#favor-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});

	initPriceRangeSearch();

	/*
		Search by price range
	*/

	function initPriceRangeSearch() {
		var slider, find, $slider = $("#slider");

		$slider.ionRangeSlider({
			keyboard: true,
			min: $slider.data('min') || 0,
			max: $slider.data('max') || 3000000000,
			from: $slider.data('from') || 0,
			to: $slider.data('to') || 2000000000,
			type: 'double',
			step: $slider.data('step') || 1000000,
			keyboard_step: $slider.data('keyboard_step') || 500000000,
			grid: true,
			grid_num: $slider.data('grid_num') || 10,
			values_separator: $slider.data('values_separator') || " đến ",
			min_interval: $slider.data('min_interval') || 500000000,
			drag_interval: true,
			onFinish: function (data) {
				find();
				if (data.from - data.min < 500000000) {
					var newMin = data.min - ((parseInt(data.min / 5000000000) + 1) * 1000000000);

					if (newMin < 0) {
						newMin = 0;
					}

					slider.update({
						min: newMin
					});
				}
				else if (data.from_percent > 25) {
					if (data.max - data.min > 2000000000) {
						var newMin = Math.round(data.from / 1000000000) * 1000000000 - 1000000000;

						if (data.max - newMin < 2000000000) {
							newMin = data.max - 2000000000;
						}

						slider.update({
							min: newMin
						});
					}
				}

				if (data.max - data.to < 500000000) {
					var newMax = data.max + ((parseInt(data.max / 5000000000) + 1) * 1000000000);

					slider.update({
						max: newMax
					});
				}
				else if (data.to_percent < 75) {
					if (data.max - data.min > 2000000000) {
						var newMax = Math.round(data.to / 1000000000) * 1000000000 + 1000000000;

						if (newMax - data.min < 2000000000) {
							newMax = data.min + 2000000000;
						}

						slider.update({
							max: newMax
						});
					}
				}
			}
		});
		slider = $('#slider').data('ionRangeSlider');

		find = _initPagination({
			url: '/real_estates/search',
			data: function () {
				return { price: $('#slider').val(), per: $slider.data('per') };
			},
			pagination: $('#price_pagination'),
			list: $('#price_list')
		});
	}

	/*
		/ Search by price range
	*/

});
// end