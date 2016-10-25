var realEstateId;

$(function () {

	// Images container
	
		(function () {
			// Get img element
			var $img = $('.images-container .image img');

			// Set buttons event
			$('.images-container .circle-paging > *').on('click', function () {
				$item = $(this);

				// Check if is active => stop
				if ($item.hasClass('active')) {
					return;
				}

				// Set src
				$img[0].src = $item.data('value')['slide'];

				// Set status
				$item.addClass('active').siblings('.active').removeClass('active');
			})

			if ($('.images-container .circle-paging > *').length > 1) {
				// Click to next image event
				$('.images-container .image').css('cursor', 'pointer').on('click', function () {
					var $currentItem = $('.images-container .circle-paging > *.active');

					if (!$currentItem.is(':last-child')) {
						$currentItem.next().click();
					}
					else {
						$('.images-container .circle-paging > :first-child').click();
					}
				});
			}

			$('.images-container .full-button a').on('click', function () {
				// Get data
				var currentIndex = $('.images-container .circle-paging > .active').index();
				var imageData = $('.images-container .circle-paging > *').map(function () {
					return $(this).data('value')['original'];
				});

				// Build html
				var $html = $('<img />');
				$html.css({
					'max-height': 	'90vh',
					cursor: 		'pointer'
				})

				// Set src
				$html.attr('src', imageData[currentIndex]);

				// Call popup
				popupFull({
					html: $html
				});

				$html.wrap('<center></center>');

				// Next image when click
				$html.on('click', function () {
					if (currentIndex == imageData.length) {
						currentIndex = 0;
					}
					else {
						currentIndex++;
					}
					$html.attr('src', imageData[currentIndex])
				});
			})
		})();
	
	// / Images container

	// Infos container
	
		(function () {
			// Get infos row
			var $infosRow = $('.infos-container .infos > .row');

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
						$removes = $infosRow.children('.more, .buffer-more');
						$more = $infosRow.children('.more');
						$more.stop().animate({
							top: '-10px'
						}, 200, function () {
							$more.stop().slideUp(300, function () {
								$removes.remove();
								$item.removeClass('active');
							});
						});
					}
					// Else => on
					else {
						// Remove current more
						$removeClass = $infosRow.find('.has-more.active');
						$removes = $infosRow.children('.more, .buffer-more');
						$removeMore = $infosRow.children('.more');
						$removeMore.stop().slideUp(300, function () {
							$removes.remove();
							$removeClass.removeClass('active')
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
								$infosRow.append($more);
							}
							// Else => find while checked element in other line (offset top !=)
							else {
								$pos = (function findPosition($checkedElement) {
									// If is last child => append last, return true
									if ($checkedElement.is(':last-child')) {
										$infosRow.append($more);
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
							$more.hide().stop().slideDown(300).css({
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
				lng = $map.data('lng');

			var map = _initMap('map', {
				markers: [
					{ 
						latLng: { lat: lat, lng: lng } 
					}
				]
			});

			var objects = {}, markers = [], to = null;
			objects[realEstateId] = null;
			$('#view_surround').on('change', function () {
				if (this.checked) {
					$(markers).each(function () {
						this.setMap(map);
					});

					getData();

					map.addListener('bounds_changed', function() {
						clearTimeout(to);
						to = setTimeout(function () {
							getData();
						}, 50);
					});
				}
				else {
					google.maps.event.clearListeners(map, 'bounds_changed');
					$(markers).each(function () {
						this.setMap(null);
					});
				}
			});

			function getData() {
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
									title: value.title,
									animation: google.maps.Animation.DROP,
									icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
								});
								marker.addListener('click', function () {
									window.location = value.url;
								});

								markers.push(marker);
							}
						});
					}
				});
			}
		})();
	
	// / Description container

	// Contact container
	
		(function () {

			// Fixed

				$(window).on('resize', function () {
					$('.contact-container').css('width', $('.contact-container').parent().width() + 'px');
				});
				$('.contact-container').css('width', $('.contact-container').parent().width() + 'px');
				
				_initFixedScroll(
					$('.contact-container'),
					$('.description-container'),
					{
						staticTop: true
					}
				);
			
			// / Fixed

			// Form

				// Scroll to form
				$('#re_register').on('click', function () {
					_scrollTo($('.contact-container').offset().top);
					$('.contact-container [name="mail[requested_info][requested_type]"]').val('2');
					$('.contact-container [name="mail[content"]]').focus();
				});
			
				var $contactForm = $('#contact_form');

				initForm($contactForm, {
					submit: function () {
						$.ajax({
							url: 		'/mails/save',
							method: 	'POST',
							data: 		$contactForm.serialize()
						}).done(function (data) {
							if (data.status == 0) {
								popupPrompt({
									title: 'Đăng ký thành công',
									content: 'Bạn đã đăng ký sản phẩm thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
								});
							}
							else {
								_errorPopup();
							}
						}).fail(function () {
							_errorPopup();
						});
					}
				});
			
			// / Form

		})();

	// / Contact container

	// Buttons
	
		// Register

			// var
			// 	$registerForm = $('#register_form'),
			// 	requestInfo = $registerForm.data('request_info'),
			// 	contactInfo = $registerForm.data('contact_info');

			// $('#re_register').on('click', function () {
			// 	var $html = $(_popupContent['re_register']);

			// 	var $popup = popupFull({
			// 		html: $html,
			// 		width: 'medium'
			// 	});

			// 	var $form = $html.find('form:eq(0)');

			// 	_initContactForm($form, {
			// 		requestInfo: requestInfo,
			// 		contactInfo: contactInfo,
			// 		done: function (data) {
			// 			requestInfo = data.requestInfo;
			// 			contactInfo = data.contactInfo;
			// 			$registerForm.data('refill')({
			// 				requestInfo: requestInfo,
			// 				contactInfo: contactInfo
			// 			});
			// 			$registerForm.find('[name="use_default_contact"][value="t"]').prop('checked', true).change();

			// 			$('#re_register').text('Đã đăng ký');
						
			// 			$popup.off();
			// 			popupPrompt({
			// 				title: 'Đăng ký thành công',
			// 				content: 'Bạn đã đăng ký sản phẩm thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
			// 			});
			// 		}
			// 	});

			// 	$form.find(':input:visible:eq(0)').focus();
			// });

			// _initContactForm($registerForm, {
			// 	requestInfo: requestInfo,
			// 	contactInfo: contactInfo,
			// 	done: function (data) {
			// 		requestInfo = data.requestInfo;
			// 		contactInfo = data.contactInfo;

			// 		$('#re_register').text('Đã đăng ký');

			// 		popupPrompt({
			// 			title: 'Đăng ký thành công',
			// 			content: 'Bạn đã đăng ký sản phẩm thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
			// 		});
			// 	}
			// });
		
		// / Register

		// Favorite
		
			$('#re_favorite').on('click', function () {
				if ($('body').is('[data-signed]')) {
					var
						$button = $(this),
						active = !$button.is('[data-actived]');

					$button.attr('disabled', true);
					$.ajax({
						url: '/real_estates/user_favorite/' + realEstateId,
						method: 'POST',
						data: {
							is_add: active ? '1' : '0'
						},
						dataType: 'JSON'
					}).done(function (data) {
						if (data.status == 0) {
							if (active) {
								$button.text('Đang quan tâm').attr('data-actived', '');
							}
							else {
								$button.text('Quan tâm').removeAttr('data-actived');
							}
						}
						else {
							errorPopup();
						}
					}).fail(function () {
						errorPopup();
					}).always(function () {
						$button.attr('disabled', false);
					});
				}
				else {
					_openSignInPopup()
				}
			});

			{
				var $button = $('#re_favorite');
				if ($button.is('[data-actived]')) {
					$button.text('Đã quan tâm');
				}
				else {
					$button.text('Quan tâm');
				}
			}
		
		// / Favorite
	
	// / Buttons

	// Relative res
	
		_initMediumItemsList($('.medium-items-list'));
	
	// / Relative res

});