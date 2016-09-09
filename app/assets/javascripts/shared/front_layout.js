_offsetTop = 80;

$(function () {

	_initScrollBackgroundImage($('.main-navigator'));

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
						$element.css('background-position-y', (99 - ((scrollTop - range[0]) * 100 / (range[1] - range[0]))) + '%')
					}
				})
			});
		}

	// / Scroll background image

	// Fixed header

		var isFixedHeader = false;

		function fixedHeader() {
			if (isFixedHeader) {
				return;
			}

			isFixedHeader = true;

			// Add padding
			$('.content-wrapper').css('padding-top', $('header').height() + 'px');
			// Check fixed
			if (document.body.scrollTop < 20) {
				$('header').removeClass('fixed');
			}
			else {
				$('header').addClass('fixed');
			}
			// Add event
			$(window).on({
				'scroll.fixedHeader': 	function () {
											if (document.body.scrollTop < 20) {
												$('header').removeClass('fixed');
											}
											else {
												$('header').addClass('fixed');
											}
										}
			});
		}
		function disableFixedHeader() {
			if (!fixedHeader) {
				return;
			}

			isFixedHeader = false;

			// Remove padding
			$('.content-wrapper').css('padding-top', '0');
			// Remove fixed
			$('header').removeClass('fixed');
			// Remove event
			$(window).off('.fixedHeader');
		}

		if (window.innerWidth >= 992) {
			fixedHeader();
		}

		$(window).on('resize', function () {
			if (window.innerWidth >= 992) {
				fixedHeader();
			}
			else {
				disableFixedHeader();
			}

		});

	// / Fixed header

	// Mobile menu button
	
		$('#main_menu_toggle').on('click', function () {
			openMobileMenu();
		});

		$('#main_menu, #main_menu nav h2').on('click', function () {
			closeMobileMenu();
		});

		$('#main_menu nav').on('click', function (e) {
			e.stopPropagation();
		});

		$('#main_menu .submenu').each(function () {
			var	$menu 	=	$(this),
				$item 	=	$menu.closest('li'),
				$button =	$item.find('> a');

			$button.on('click', function () {
				if ($item.hasClass('expand')) {
					$item.removeClass('expand');

					$menu.slideUp(300);
				}
				else {
					$item.addClass('expand');

					$menu.slideDown(300);
				}
			});
		});

		function openMobileMenu() {
			$('#main_menu').show().css('overflow-y', 'scroll');

			$('#main_menu nav').css({
				left: '-100%'
			}).animate({
				left: '0'
			}, 500);

			$('body').css({
				width: $('body').width() + 'px'
			}).addClass('no-scroll');
		}

		function closeMobileMenu() {
			$('#main_menu').fadeOut(500).css('overflow-y', 'hidden');
			$('#main_menu nav').animate({
				left: '-100%'
			}, 300);

			$('body').css({
				width: 'auto'
			}).removeClass('no-scroll');
		}
	
	// / Mobile menu button

	// Search box
	
		$('.search-box-container.in-top .box-title').on('click', function () {
			$(this).closest('.search-box').find('.box-content').stop().slideToggle();
		});

		(function () {
			var $forms = $('form[data-object="search-form"], .search-box-container form');

			$forms.each(function () {
				var $form = $(this);
				initForm($form);

				$form.find('[name="search[province]"]').on('change', function () {
					var $district = $form.find('[name="search[district]"]');

					if (this.value) {
						$.ajax({
							url: '/districts/get_by_province',
							data: { province_id: this.value },
							dataType: 'JSON'
						}).done(function (data) {
							if (data.status == 0) {
								$district
									.html('<option value="">Quận/huyện</option>' + data.result.map(function (district) {
										return '<option value="' + district.id + '">' + district.name + '</option>'
									}).join(''))
									.prop('disabled', false);
							}
							else {
								$district.prop('disabled', true);
							}
						}).fail(function () {
							$district.prop('disabled', true);
						});
					}
					else {
						$district.prop('disabled', true);
					}
				});

				// $form.find('[name="search[price_to]"], [name="search[price_from]"], [name="search[area_from]"], [name="search[area_to]"]').on('change', function () {
				// 	var
				// 		$input = $(this),
				// 		$besideInput;

				// 	switch($input.attr('name')) {
				// 		case 'search[price_to]':
				// 			$besideInput = $form.find('[name="search[price_from]"]:enabled');
				// 			break;
				// 		case 'search[price_from]':
				// 			$besideInput = $form.find('[name="search[price_to]"]:enabled');
				// 			break;
				// 		case 'search[area_from]':
				// 			$besideInput = $form.find('[name="search[area_to]"]:enabled');
				// 			break;
				// 		case 'search[area_to]':
				// 			$besideInput = $form.find('[name="search[area_from]"]:enabled');
				// 			break;
				// 		default:
				// 			return;
				// 	}

				// 	$besideInput.find('option:disabled').prop('disabled', false);
				// 	if ($input.val()) {
				// 		$besideInput.find('option[value="' + $input.val() + '"]').prop('disabled', true);
				// 	}
				// });

				$form.find('[name="search[price_to]"], [name="search[price_from]"], [name="search[area_from]"], [name="search[area_to]"]').on('change', function () {
					var
						$input = $(this),
						$besideInput,
						// If from => disable up else => disable down
						isFrom;

					switch($input.attr('name')) {
						case 'search[price_from]':
							isFrom = true;
							$besideInput = $form.find('[name="search[price_to]"]:enabled');
							break;
						case 'search[price_to]':
							isFrom = false;
							$besideInput = $form.find('[name="search[price_from]"]:enabled');
							break;
						case 'search[area_from]':
							isFrom = true;
							$besideInput = $form.find('[name="search[area_to]"]:enabled');
							break;
						case 'search[area_to]':
							isFrom = false;
							$besideInput = $form.find('[name="search[area_from]"]:enabled');
							break;
						default:
							return;
					}

					$besideInput.find('option:disabled').prop('disabled', false);
					if ($input.val()) {
						var $selectedOption = $besideInput.find('option[value="' + $input.val() + '"]');
						
						$selectedOption.prop('disabled', true);
						(isFrom ? $selectedOption.prevUntil('[value=""]') : $selectedOption.nextUntil('[value=""]')).prop('disabled', true);
					}
				});
			})
		})();
	
	// / Search box

	// Main menu

		$('[data-action="on_next_element"] + *').on('mousedown', function (e) {
			e.stopPropagation();
		});
	
		$('[data-action="on_next_element"]').on('mousedown', function () {
			var $menu = $(this).next();

			// Check if on-ing
			if ($menu.hasClass('on')) {
				return;
			}

			// On
			$menu.addClass('on');

			// Set close event
			setTimeout(function () {
				$(document).on('mousedown.close_menu', function (e) {
					$menu.removeClass('on');
					$(document).off('mousedown.close_menu');
				});	
			});
		});
	
	// / Main menu
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
	function _initMap(id, params, options) {
		if (typeof params === 'undefined') {
			params = {}
		}
		if (typeof options === 'undefined') {
			options = {}
		}

		options.scrollwheel = false;
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

		if (!('center' in params) && !('markers' in params && params.markers.length > 0)) {
			var geoSuccess = function(position) {
				startPos = position;
				map.setCenter({
					lat: startPos.coords.latitude,
					lng: startPos.coords.longitude
				})
			};
			navigator.geolocation.getCurrentPosition(geoSuccess);
		}

		return map;
	}

// / Map

// Open sign-in popup

	function _openSignInPopup() {
		var
			$html = $(_popupContent['sign_in']),
			$form = $html.find('form');

		popupFull({
			html: $html,
			width: 'small',
			id: 'sign_in_popup'
		});

		$html.find('[aria-click="facebook_login"]').on('click', function () {
			facebookLogin();
		});

		initForm($form, {
			submit: function () {
				$.ajax({
					url: '/signin',
					method: 'POST',
					data: $form.serialize(),
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						window.location.reload();
					}
					else if (data.status == 5) {
						if (data.result.status == 3) {
							window.location = '/users/active_callout/' + data.result.result + '?status=unactive';
							return;
						}

						popupPrompt({
							title: _t.form.error_title,
							content: data.result.result,
							type: 'danger',
							onEscape: function () {
								$form.find('#password').val('').focus();
								if (data.result.status == 1) {
									// Account wrong
									$form.find('#account').select();
								}
							}
						});
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			}
		});

		$form.find(':input:visible:eq(0)').focus();
	}

// / Open sign-in popup

// Same contact popup

	function _openSameContactPopup($html, params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		var $popup = popupFull({
			html: $html,
			width: 'medium',
			esc: false,
			id: 'same_contact_popup'
		});

		$html.find('[aria-click="yes"]').on('click', function () {
			$popup.off();

			if ('yes' in params) {
				params['yes']();
			}
		});

		$html.find('[aria-click="no"]').on('click', function () {
			$popup.off();

			if ('no' in params) {
				params['no']();
			}
		});

		$html.find('[aria-click="sign_in"]').on('click', function () {
			$popup.off();
			_openSignInPopup();
		});
	}

// / Same contact popup

// Init contact form
	
	/*
		params:
			requestInfo
			contactInfo
			done:
				function(data)
					data: {
						requestInfo,
						contactInfo
					}
	*/
	function _initContactForm($form, params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		$form.data('refill', function (newData) {
			if (typeof newData == 'undefined') {
				newData = {};
			}

			if (newData.requestInfo) {
				params.requestInfo = newData.requestInfo;
			}

			if (newData.contactInfo) {
				params.contactInfo = newData.contactInfo;
			}

			if (params.requestInfo) {
				$form.find('[name="request[id]"]').val(params.requestInfo['id']);
				$form.find('[name="request[request_type]"]').val(params.requestInfo['request_type']);
				if ($form.find('[name="request[object_type]"]').is('input[type="radio"]')) {
					$form.find('[name="request[object_type]"][value="' + params.requestInfo['object_type'] + '"]').prop('checked', true);
				}
				else {
					$form.find('[name="request[object_type]"]').val(params.requestInfo['object_type']);
				}
				$form.find('[name="request[object_id]"]').val(params.requestInfo['object_id']);
				$form.find('[name="request[message]"]').val(params.requestInfo['message']);
			}
			if (params.contactInfo) {
				$form.find('[name="contact[id]"]').val(params.contactInfo['id']);
				if ($form.find('[name="contact[default_name]"]').val(params.contactInfo['name']).length == 0) {
					$form.find('[name="contact[name]"]').val(params.contactInfo['name']);
				}
				if ($form.find('[name="contact[default_email]"]').val(params.contactInfo['email']).length == 0) {
					$form.find('[name="contact[email]"]').val(params.contactInfo['email']);
				}
				if ($form.find('[name="contact[default_phone_number]"]').val(params.contactInfo['phone_number']).length == 0) {
					$form.find('[name="contact[phone_number]"]').val(params.contactInfo['phone_number']);
				}
			}
		});

		$form.data('refill')();

		initForm($form, {
			submit: function () {
				$.ajax({
					url: '/contact_requests/save',
					method: 'POST',
					data: $form.serialize(),
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						if (params.done) {
							params.requestInfo = {
								id: data.result.request_id,
								request_type: $form.find('[name="request[request_type]"]').val(),
								object_type: $form.find('[name="request[object_type]"]').val(),
								object_id: $form.find('[name="request[object_id]"]').val(),
								message: $form.find('[name="request[message]"]').val()
							};
							$form.find('[name="request[id]"]').val(params.requestInfo['id']);

							if (!$('body').is('[data-signed]')) {
								params.contactInfo = {
									id: data.result.contact_id,
									name: $form.find('[name="contact[default_name]"]:enabled,[name="contact[name]"]:enabled').val(),
									email: $form.find('[name="contact[default_email]"]:enabled,[name="contact[email]"]:enabled').val(),
									phone_number: $form.find('[name="contact[default_phone_number]"]:enabled,[name="contact[phone_number]"]:enabled').val()
								}
								$form.find('[name="contact[id]"]').val(params.contactInfo['id']);
							}

							if (params.contactInfo) {
								$form.find('[name="contact[default_name]"]').val(params.contactInfo['name']);
								$form.find('[name="contact[default_email]"]').val(params.contactInfo['email']);
								$form.find('[name="contact[default_phone_number]"]').val(params.contactInfo['phone_number']);
								$form.find('[name="use_default_contact"][value="t"]').prop('checked', true).change();	
							}

							params['done']({
								requestInfo: params.requestInfo,
								contactInfo: params.contactInfo
							});
						}
					}
					else if (data.status == 5) {
						data.result.same_contact = JSON.parse(data.result.same_contact);
						
						_openSameContactPopup($(data.result.html), {
							yes: function () {
								$.ajax({
									url: '/contact_requests/save',
									method: 'POST',
									data: $form.serialize() + '&contact[id]=' + data.result.same_contact.id,
									dataType: 'JSON'
								}).done(function (data) {
									if (params.done) {
										params.requestInfo = {
											id: data.result.request_id,
											request_type: $form.find('[name="request[request_type]"]').val(),
											object_type: $form.find('[name="request[object_type]"]').val(),
											object_id: $form.find('[name="request[object_id]"]').val(),
											message: $form.find('[name="request[message]"]').val()
										};
										$form.find('[name="request[id]"]').val(params.requestInfo['id']);

										if (!$('body').is('[data-signed]')) {
											params.contactInfo = {
												id: data.result.contact_id,
												name: $form.find('[name="contact[default_name]"]:enabled,[name="contact[name]"]:enabled').val(),
												email: $form.find('[name="contact[default_email]"]:enabled,[name="contact[email]"]:enabled').val(),
												phone_number: $form.find('[name="contact[default_phone_number]"]:enabled,[name="contact[phone_number]"]:enabled').val()
											}
											$form.find('[name="contact[id]"]').val(params.contactInfo['id']);
										}

										if (params.contactInfo) {
											$form.find('[name="contact[default_name]"]').val(params.contactInfo['name']);
											$form.find('[name="contact[default_email]"]').val(params.contactInfo['email']);
											$form.find('[name="contact[default_phone_number]"]').val(params.contactInfo['phone_number']);
											$form.find('[name="use_default_contact"][value="t"]').prop('checked', true).change();
										}

										params['done']({
											requestInfo: params.requestInfo,
											contactInfo: params.contactInfo
										});
									}
								}).fail(function () {
									errorPopup();
								});
							}
						});
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			}
		});
	}

// / Init contact form

// Toggle page spinner (GLOBAL)

	function _togglePageSpinner(down) {
		if (down) {
			$('#page_spinner').slideDown();
		}
		else {
			$('#page_spinner').slideUp();
		}
	}

// / Toggle page spinner

// Init medium items list

	function _initMediumItemsList($listBox) {

		// Dotdotdot title
			
			$listBox.find('.item .title a').dotdotdot({
				watch: 'window',
				height: 50
			});
		
		// / Dotdotdot title

	}

// / Init medium items list

// Init large items list

	function _initLargeItemsList($listBox) {
		var
			$listContainer = $listBox.find('> .list-container'),
			$list = $listBox.find('> .list-container > .list'),
			$itemsPaging = $listContainer.next('.circle-paging');

		// Dotdotdot title
		
			setTimeout(function () {
				$listBox.find('.item .infos-container .title > * > *').dotdotdot({
					watch: 'window',
					height: 54
				});
			}, 500);
		// / Dotdotdot title

		$list.children().each(function () {
			var $item = $(this);

			// Images list each item

				var
					$imagesList = $item.find('.images-container .circle-paging'),
					$img = $item.find('.images-container .image img');

				// Set buttons event
				$imagesList.children().on('click', function () {
					var $button = $(this);

					// Check if is active => stop
					if ($item.hasClass('active')) {
						button;
					}

					// Set src
					$img[0].src = $button.data('data')['slide'];

					// Set status
					$button.addClass('active').siblings('.active').removeClass('active');
				});

				if ($imagesList.children().length > 1) {
					$item.find('.images-container .image').on('click', function () {
						var $currentButton = $imagesList.children('.active');

						if (!$currentButton.is(':last-child')) {
							$currentButton.next().click();
						}
						else {
							$imagesList.children(':first-child').click();
						}
					}).css('cursor', 'pointer');
				}
			
			// / Images list each item
		});

		// Items list

			var $currentItem = $list.children(':eq(0)');
		
			if ($itemsPaging.length != 0) {
				$itemsPaging.children().on('click', function () {
					var
						$button = $(this),
						$item = $list.children(':eq(' + $button.index() + ')');

					// Check if active => return
					if ($button.hasClass('active')) {
						return;
					}

					// Remove active status in old button
					$button.siblings().removeClass('active');

					// Set active status
					$button.addClass('active');

					// Scroll left to item
					$listContainer.scrollLeft($item.position().left);

					// Make animation
					var $cloneItem = $currentItem.clone();

					// Append clone item for animation
					$list.append($cloneItem);
					$cloneItem.css({
						position: 'absolute',
						top: $item.position().top + 'px',
						left: $item.position().left + 'px',
						width: $currentItem.width() + 'px',
						height: $currentItem.height() + 'px'
					}).find('.container').css('box-shadow', 'none');

					// Make animation
					$cloneItem.find('.images-container, .infos-container-background').css({
						transform: 'none',
						'-webkit-transform': 'none',
						opacity: 1,
						transition: 'transform .5s, opacity .2s .3s',
						'-webkit-transition': 'transform .5s, opacity .2s .3s',
						'transition-timing-function': 'cubic-bezier(.4, .1, .5, .9)',
						'-webkit-transition-timing-function': 'cubic-bezier(.4, .1, .5, .9)'
					});
					setTimeout(function () {
						$cloneItem.find('.images-container').css({
							transform: 'translateX(-50%)',
							'-webkit-transform': 'translateX(-50%)',
							opacity: 0
						});
						$cloneItem.find('.infos-container-background').css({
							transform: 'translateX(50%)',
							'-webkit-transform': 'translateX(50%)',
							opacity: 0
						});
						setTimeout(function () {
							$cloneItem.remove();
						}, 700);
					}, 200);

					$currentItem = $item;
				});
			}

			// Reset position if resize
			$(window).on('resize', function () {
				$listContainer.scrollLeft($currentItem.position().left);
			});
		
		// / Items list

	}

// / Init large items list