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
	initPositionSearch();

	/*
		Search by price range
	*/

	function initPriceRangeSearch() {
		var slider, find, $slider = $("#slider"), interval = $slider.data('min_interval') ? parseInt($slider.data('min_interval')) : 500000000;

		var 
			old_from = $slider.data('from') || 0,
			old_to = $slider.data('to') || 2000000000;
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
			grid_num: $slider.data('grid_num') || 4,
			values_separator: $slider.data('values_separator') || " đến ",
			min_interval: $slider.data('min_interval') || 500000000,
			drag_interval: true,
			onFinish: function (data) {
				find();

				if (old_from != data.from) {
					old_from = data.from;
					if (data.from_percent > 25) {
						slider.update({
							min: parseInt(data.from / interval) * interval
						});
					}
					else if (data.from - data.min < interval) {
						var newMin = data.min - ((parseInt(data.min / (interval * 10)) + 1) * (interval * 2));

						if (newMin < 0) {
							newMin = 0;
						}

						slider.update({
							min: newMin
						});
					}
				}

				if (old_to != data.to) {
					old_to = data.to;
					if (data.to_percent < 75) {
						slider.update({
							max: (parseInt(data.to / interval) + 1) * interval
						});
					}
					else if (data.max - data.to < interval) {
						var newMax = data.max + ((parseInt(data.max / (interval * 10)) + 1) * (interval * 2));

						if (newMax < (interval * 4) - data.min) {
							newMin = (interval * 4) - data.min;
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
			list: $('#price_list'),
			pagination: $('#price_pagination'),
      data: function () {
				return { price: $('#slider').val(), per: $slider.data('per') };
			}
    });
	}

	/*
		/ Search by price range
	*/

	/*
		Position search
	*/

	function initPositionSearch() {
		var find;

		$('[aria-click="position_change"]').on('click', function () {
			find({
				data: {
					district: $(this).data('value')
				}
			})
		});

    find = _initPagination({
      url: '/real_estates/search',
      list: $('#position_list'),
      pagination: $('#position_pagination')
    });
	}

	/*
		/ Position search
	*/

});
// end