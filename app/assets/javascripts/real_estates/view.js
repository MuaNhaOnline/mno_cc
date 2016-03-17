var realEstateId;

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
						$removeClass = $infosRow.find('.has-more.active');
						$removes = $infosRow.children('.more, .buffer-more');
						$removeMore = $infosRow.children('.more');
						$removeMore.slideUp(300, function () {
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

			_initMap('map', {
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

	// Buttons
	
		// Register

			var
				registerFormData = null,
				$registerForm = $('#register_form');
		
			$('#re_register').on('click', function () {
				if ($('body').is('[data-signed]')) {
					var $html = $(_popupContent['re_register']);

					var $popup = popupFull({
						html: $html,
						width: 'medium'
					});

					var $form = $html.find('form:eq(0)');

					if (registerFormData) {
						$form.find('[name="request[id]"]').val(registerFormData['id']);
						$form.find('[name="request[message]"]').val(registerFormData['message']);
					}

					initForm($form, {
						submit: function () {
							$.ajax({
								url: '/contact_requests/new',
								method: 'POST',
								data: $form.serialize(),
								dataType: 'JSON'
							}).done(function (data) {
								if (data.status == 0) {
									// Save data & async data other form
									
										registerFormData = {
											id: data.result,
											message: $form.find('[name="request[message]"]').val()
										};
										$registerForm.find('[name="request[id]"]').val(registerFormData['id']);
										$registerForm.find('[name="request[message]"]').val(registerFormData['message']);

									// / Save data & async data other form

									$popup.off();
									popupPrompt({
										title: 'Đăng ký thành công',
										content: 'Bạn đã đăng ký sản phẩm thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
									});
								}
								else {
									errorPopup();
								}
							}).fail(function () {
								errorPopup();
							});
						}
					})

					$html.find(':input:visible:eq(0)').focus();
				}
				else {
					_openSignInPopup();
				}
			});

			initForm($registerForm, {
				submit: function () {
					$.ajax({
						url: '/contact_requests/new',
						method: 'POST',
						data: $registerForm.serialize(),
						dataType: 'JSON'
					}).done(function (data) {
						if (data.status == 0) {
							// Save data & fill id to form
							
								registerFormData = {
									id: data.result,
									message: $registerForm.find('[name="request[message]"]').val()
								};
								$registerForm.find('[name="request[id]"]').val(registerFormData['id']);

							// / Save data & fill id to form

							popupPrompt({
								title: 'Đăng ký thành công',
								content: 'Bạn đã đăng ký sản phẩm thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
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
		
		// / Register

		// Favorite
		
			$('#re_favorite').on('click', function () {
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
							$button.text('Đã quan tâm').attr('data-actived', '');
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

});