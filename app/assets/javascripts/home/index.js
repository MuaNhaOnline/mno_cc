$(function () {

	// Contact

		(function () {
			var $contactForm = $('#contact_form');

			_initContactForm($contactForm, {
				requestInfo: $contactForm.data('request_info'),
				contactInfo: $contactForm.data('contact_info'),
				done: function (data) {
					popupPrompt({
						title: 'Đăng ký thành công',
						content: 'Bạn đã đăng ký thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
					});
				}
			});
		})();
	
	// / Contact

	// Search

		// Map
			
	
			(function () {
				var objects = {};

				$('.search-type.map-search').on('click', function () {
					var 
						$map = $('#search_map');

					if ($map.hasClass('hidden')) {
						$map.removeClass('hidden');
						var map = _initMap('search_map', {
						});	

						var to = null;
						map.addListener('bounds_changed', function() {
							clearTimeout(to);
							to = setTimeout(function () {
								var
									bs = map.getBounds(),
									bounds = {
										from: {
											lat: bs.H.H,
											lng: bs.j.H,
										},
										to: {
											lat: bs.H.j,
											lng: bs.j.j,
										}
									};

								$.ajax({
									url: '/home/search_by_bounds',
									data: {
										bounds: bounds
									},
									dataType: 'JSON'
								}).done(function (data) {
									if (data.status == 0) {
										var result = data.result;

										$.each(result, function (id, value) {
											if (!(id in objects)) {
												objects[id] = value;

												var marker = new google.maps.Marker({
												    position: { lat: value.lat, lng: value.lng },
												    map: map,
												    title: value.title
											  	});
											  	marker.addListener('click', function () {
											  		window.location = value.url;
											  	});												
											}
										});
									}
								});
							}, 100);
						});
					}
				});
			})();
		
		// / Map
		
	// / Search

	// Gallery
	
		// $('.gallery-ctn img').on({
		// 	'mouseenter click': function () {
		// 		var $img = $(this);

		// 		// Check status
		// 		if ($img.hasClass('active')) {
		// 			return;
		// 		}

		// 		$img.addClass('active').siblings('.active').removeClass('active');
		// 	}
		// });

	// / Gallery

	// Rating
	
		(function () {
			$('.rating-ctn .btn').on('click', function () {
				popupPrompt({
					title: 'Cám ơn bạn',
					content: 'Cám ơn bạn đã đánh giá',
					buttons: [
						{
							text: 'Xem bất động sản',
							type: 'green',
							handle: function () {
								window.location = '/bat-dong-san';
								return false;
							}
						},
						{
							text: 'Xem dự án',
							type: 'green',
							handle: function () {
								window.location = '/du-an';
								return false;
							}
						},
						{
							text: 'Đóng'
						}
					]
				});
			});
		})();
	
	// / Rating


});