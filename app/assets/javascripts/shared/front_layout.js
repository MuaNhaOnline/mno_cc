$(function () {
	_initScrollBackgroundImage($('.main-navigator'));
});

// Map

	/*
		params:
			id(*)
			params:
				zoom: 17
				center: {}
					lat: first_market || 10.771528380460218
					long: first_market || 106.69838659487618
				markers: [{}]
					lat: ...
					long: ...
	*/
	function _init_map(id, params) {
		if (typeof params === 'undefined') {
			params = {}
		}

		var options = {
			scrollwheel: false
		};

		options.zoom = params.zoom || 17

		if ('center' in params ) {
			options.center = params.center
		}
		else if ('markers' in params && params.markers.length > 0) {
			options.center = { lat: params.markers[0].latLng.lat, lng: params.markers[0].latLng.lng }
		}
		else {
			options.center = { lat: 10.771528380460218, lng: 106.69838659487618 }; 
		}

		var map = new google.maps.Map(document.getElementById(id), options);

		$(params.markers).each(function () {
			new google.maps.Marker({
				position: this.latLng,
				map: map,
				title: this.title || '...'
			});
		})

		$('#' + id).on({
			'focus, click': function () {
				map.setOptions({'scrollwheel': true});
			},
			focusout: function () {
				map.setOptions({'scrollwheel': false});
			}
		}).attr('tabindex', '0').css('outline', '0');

		return map;
	}

// / Map

// Scroll background image

	function _initScrollBackgroundImage($elements) {
		$elements.each(function () {
			var 
				$element = $(this),
				// Range: from bottom upto 100% divice height or 0 if range < 100% divice height
				range = null;

			function resetData() {
				range = [0, $element.offset().top + $element.outerHeight()];

				if ($element.offset().top + $element.outerHeight() > $window.height()) {
					range[0] = range[1] - $window.height();
				}
			}

			$window.on('resize', function () {
				range = null;
			});

			$window.on('scroll', function () {
				if (range == null) {
					resetData();
				}

				// Get scroll top
				var scrollTop = $window.scrollTop();

				// If scroll top in range => update
				if (range[0] <= scrollTop && scrollTop <= range[1]) {
					// range[1] - range[0]: 100%
					// scrollTop - range[1]: current%
					$element.css('background-position-y', (100 - ((scrollTop - range[0]) * 100 / (range[1] - range[0]))) + '%')
				}
			})
		});
	}

// / Scroll background image