$(function () {

	// Images container
	
		(function () {
			// Get img element
			var $img = $('.images-container .image img');

			// Set buttons event
			$('.images-container .images-list .item').on('click', function () {
				$item = $(this);

				// Check if is active => stop
				if ($item.hasClass('active')) {
					return;
				}

				// Set src
				$img[0].src = $item.data('data')['slide'];

				// Set status
				$item.addClass('active').siblings('.active').removeClass('active');
			})
		})();
	
	// / Images container

	// Infos container
	
		(function () {
			// Get infos row
			var $infos_row = $('.infos-container .infos > .row');

			// Find all more element
			$('.infos-container .info-item .more').each(function () {

				// Each more, get parent (item element)
				var $item = $(this).closest('.info-item');

				// Add class has more for parent
				$item.closest('.info-item').addClass('has-more');

				// Set click event
				$item.on('click', function () {
					// If is active => off
					if ($item.hasClass('active')) {
						// Set status
						$item.removeClass('active');

						// Remove current more
						$removes = $infos_row.children('.more, .buffer-more');
						$more = $infos_row.children('.more');
						$more.animate({
							top: '-10px'
						}, 200, function () {
							$more.slideUp(300, function () {
								$removes.remove();
							});
						});
					}
					// Else => on
					else {
						// Remove current more
						$remove_class = $infos_row.find('.has-more.active');
						$removes = $infos_row.children('.more, .buffer-more');
						$remove_more = $infos_row.children('.more');
						$remove_more.slideUp(300, function () {
							$removes.remove();
							$remove_class.removeClass('active')
						});
						
						// Set status
						$item.addClass('active');

						// Append element

							// Get more element
							$more = $item.find('.more').clone();

							// Get parent
							$parent = $item.parent();

							// If this is last child => append last
							if ($parent.is(':last-child')) {
								$infos_row.append($more);
							}
							// Else => find while checked element in other line (offset top !=)
							else {
								$pos = (function findPosition($checkedElement) {
									// If is last child => append last, return true
									if ($checkedElement.is(':last-child')) {
										$infos_row.append($more);
										return true;
									}

									// If != offset top => choose
									if ($checkedElement.offset().top != $parent.offset().top) {
										return $checkedElement;
									}

									// Next
									return findPosition($checkedElement.next());
								})($parent.next());

								if ($pos != true) {
									$pos.before($more);
								}
							}

							// Add buffer for display (true position for clear left)
							$more.after($('<article class="buffer-more"></article><article class="buffer-more"></article><article class="buffer-more"></article>'))
							$more.hide().slideDown(300);
							$more.css({
								top: '-10px'
							}).animate({
								top: '0px'
							}, 200);

						// / Append element
					}
				})
			});
		})();
	
	// / Infos container

	// Description container
	
		(function () {
			var 
				$map = $('#map'),
				lat = $map.data('lat'),
				long = $map.data('long');

			_init_map('map', {
				markers: [
					{ 
						latLng: { lat: lat, lng: long } 
					}
				]
			});
		})();
	
	// / Description container

	// Contact container
	
		(function () {

			// Fixed

				var 
					$contactContainer = $('.contact-container'),
					$descriptionContainer = $('.description-container'),
					lastScrollTop = $(window).scrollTop(),

					// Top range = [(min),(max)]
					// Min = top of description
					// Max = bottom of description - height of contact
					offsetTopRange = null,
					flag,
					forceStatic;

				function resetData() {
					// Top range = [(min),(max)]
					// Min = top of description
					// Max = bottom of description - height of contact
					offsetTopRange = [
						$descriptionContainer.offset().top,
						$descriptionContainer.offset().top + $descriptionContainer.height() - $contactContainer.height()
					];

					// Base width = width of parent
					$contactContainer.css('width', $contactContainer.parent().width() + 'px');

					// Force static if < 992
					forceStatic = $window.width() < 992;
				}

				// Base width = width of parent
				$contactContainer.css('width', $contactContainer.parent().width() + 'px');

				$(window).on('resize', function () {
					offsetTopRange = null;
					$contactContainer.css('width', 'auto');
					$contactContainer.css('position', 'static');
					flag = 1
				});

				$(window).on('scroll', function () {
					if (offsetTopRange == null) {
						resetData();
					}

					if (forceStatic == true) {
						if (flag != 1) {
							$contactContainer.css('position', 'static');
							flag = 1
						}
						return;
					}

					// Get current scrollTop
					var scrollTop = $(window).scrollTop();

					// If scrollTop < min => static
					if (scrollTop < offsetTopRange[0]) {
						if (flag != 1) {
							$contactContainer.css('position', 'static');
							flag = 1
						}
					}
					// If scrollTop > max => absolute
					else if (scrollTop > offsetTopRange[1]) {
						if (flag != 2) {
							$contactContainer.css({
								position: 'absolute',
								top: (offsetTopRange[1] - $contactContainer.parent().offset().top) + 'px'
							});	
							flag = 2
						}
					}
					// If scrollTop in range => Fixed
					else {
						if (flag != 3) {
							$contactContainer.css({
								position: 'fixed',
								top: '0px'
							});
							flag = 3;
						}
					}
				});
			
			// / Fixed

		})();
	
	// / Contact container

});