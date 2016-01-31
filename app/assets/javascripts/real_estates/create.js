var signed;

$(function () {
	var 
		$formNavigator = $('#form_navigator'),
		$focusingBox,
		$form = $('#create_re');
	
	_temp['form'] = $form;

	// Init

	initShapeWidthConstraint();
	initForm($form, {
		submit_status: true,
		object: 'real_estate',
		submit: function () {
			toggleLoadStatus(true);
			$.ajax({
				url: '/real_estates/create',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
				$form.submitStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					if ($form.find('#is_full').val() == 'true') {
						if (signed) {
							window.location = '/bat-dong-san/cua-toi';
						}
						else {
							popupPrompt({
								title: 'Đăng tin thành công',
								content: 'Tin của bạn sẽ được hiển thị sau khi xử lý',
								type: 'success',
								buttons: [
									{
										text: 'Về trang chủ',
										type: 'primary'
									}
								],
								onEscape: function () {
									window.location = '/';
								}
							})              
						}
					}
					else {
						popupPrompt({
							title: _t.form.success_title,
							content: _t.real_estate.view.create.success_content,
							type: 'success',
							esc: false,
							buttons: [
								{
									text: _t.form.yes,
									type: 'primary',
									handle: function () {
										// Hidden id input
										$form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');
										$form.find('#is_full').val(true);
										toggleUntilFull(1);

										$form.find('#user_email').prop('disabled', true);
									}
								}, {
									text: _t.form.no,
									handle: function () {
										if (signed) {
											window.location = '/bat-dong-san/cua-toi';
										}
										else {
											popupPrompt({
												title: 'Đăng tin thành công',
												content: 'Bạn vui lòng vào email để kích hoạt tin',
												type: 'success',
												buttons: [
													{
														text: 'Về trang chủ',
														type: 'primary'
													}
												],
												onEscape: function () {
													window.location = '/';
												}
											});
											return false;          
										}
									}
								}
							]
						})
					}
				}
				else {
					popupPrompt({
						title: _t.form.error_title,
						type: 'danger',
						content: _t.form.error_content
					})
				}
			}).fail(function () {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: _t.form.error_content
				})
			});
		}
	});
	initUnitInput();
	initSaveDraft();
	initLocation();
	initCheckArea();
	initUncheck();
	initUntilFull();
	initReadPrice();

	// / Init

	// Toggle until full elements

	function toggleUntilFull(type) {
		// undefined type => off
		if (typeof type == 'undefined') {
			$('[aria-click="unfull"]').addClass('active');
			$('[aria-click="full"]').removeClass('active');

			$form.find('.until-full').hide().find(':input').prop('disabled', true);
			$formNavigator.find('.until-full').hide();

			$form.find('[aria-name="basic"]').show().find(':input').prop('disabled', false); 

			$form.find('#real_estate_type_group_basic').val($form.find('#real_estate_type_group').val());
			$form.find('#real_estate_type_land_basic').val($form.find('#real_estate_type_land').val());
			$form.find('#real_estate_type_house_basic').val($form.find('#real_estate_type_house').val());
			$form.find('#real_estate_type_apartment_basic').val($form.find('#real_estate_type_apartment').val());
			$form.find('#real_estate_type_space_basic').val($form.find('#real_estate_type_space').val());
			$form.find('#campus_area_basic').val($form.find('#campus_area').val() || $form.find('#using_area').val() || $form.find('#constructional_area').val());

			$form.find('#is_full').val(false);
		}
		else {        
			// as addition
			if (type == 1) {
				$form.find('.hide-until-full').each(function () {
					var $element = $(this);

					if ($element.is('.box-body')) {
						$element.children().hide();
						$element.prepend('<a href="javascript:void(0)" class="show-hide-until-full">...</a>');
					}
					else {
						$element.hide();

						var $box = $element.closest('.box-body');
						if ($box.children('.show-hide-until-full').length == 0) {
							$box.prepend('<a href="javascript:void(0)" class="show-hide-until-full">...</a>');
						}
					}
				});

				$form.find('.show-hide-until-full').on('click', function () {
					var $btn = $(this);
					var $box = $btn.closest('.box-body');

					$btn.remove();
					if ($box.is('.hide-until-full')) {
						$box.children().show();
					}
					else {
						$box.find('.hide-until-full').show();
					}
				});
			}

			$('[aria-click="unfull"]').removeClass('active');
			$('[aria-click="full"]').addClass('active');

			$form.find('#is_full').val(true);

			// on
			$form.find('.until-full').show().find(':input').prop('disabled', false);
			$formNavigator.find('.until-full').show();
			$form.find('.until-full').closest('.box').removeClass('box-primary').data('status', 'normal').trigger('changeStatus');

			$form.find('#real_estate_type_group').val($form.find('#real_estate_type_group_basic').val());
			$form.find('#real_estate_type_land').val($form.find('#real_estate_type_land_basic').val());
			$form.find('#real_estate_type_house').val($form.find('#real_estate_type_house_basic').val());
			$form.find('#real_estate_type_apartment').val($form.find('#real_estate_type_apartment_basic').val());
			$form.find('#real_estate_type_space').val($form.find('#real_estate_type_space_basic').val());
			$form.find('#constructional_area, #using_area, #campus_area').val($form.find('#campus_area_basic').val());

			$form.find('[aria-name="basic"]').hide().find(':input').prop('disabled', true); 

			if (type == 1) {
				var $box = $form.find('.box .until-full:eq(0)').closest('.box');
				if (!canSee($box.find('.box-header'))) {
					$body.animate({ scrollTop: $box.offset().top - 40 }, function () {
						focusBox($box);
					});
				}
				else {
					focusBox($box);
				}
			}
			else {
				var $box = $form.find('.box[aria-name]:eq(0)').closest('.box');
				if (!canSee($box.find('.box-header'))) {
					$body.animate({ scrollTop: $box.offset().top - 40 }, function () {
						focusBox($box);
					});
				}
				else {
					focusBox($box);
				}
			}
		}

		$form.data('toggle_inputs')();
	}

	// / Toggle until full elements

	// Unit format

	function initUnitInput() {
		changeCurrency();

		$form.find('#currency_id').on('change', function () {
			changeCurrency();
		});
		
		function changeCurrency() {
			$form.find('.unit-label').attr('data-currency', $form.find('#currency_id :selected').text());
		}

		$form.find('[aria-click="change-unit"]').on('click', function () {
			var $button = $(this);

		// Change text
		$button.closest('ul').siblings('button').find('.text').text($button.text());

		// Change value
		$button.closest('ul').siblings('input[type="hidden"]').val($button.data('value')).change();
		});
	}

	// / Unit format

	// Check area

	function initCheckArea() {
		var 
			$campusArea = $form.find('#campus_area'),
			$constructionalArea = $form.find('#constructional_area'),
			$usingArea = $form.find('#using_area'),
			$widthX = $form.find('#width_x'),
			$widthY = $form.find('#width_y'),
			$areaAlert = $form.find('#area_alert');

		$campusArea.add($constructionalArea).add($usingArea).add($widthX).add($widthY).on({
			'change_2 disable enable': function () {
				var $area;

				if ($campusArea.is(':enabled')) {
					$area = $campusArea;
				}
				else if ($constructionalArea.is(':enabled')) {
					$area = $constructionalArea;
				}
				else {
					$area = $usingArea;
				}

				// If empty => valid too
				if ($area.val() && $widthX.val() && $widthY.val() && !isValidArea($area.val(), $widthX.val(), $widthY.val())) {
					$areaAlert.show();
				}
				else {
					$areaAlert.hide();
				}
			},
			change: function () {
				$(this).trigger('change_2');
			}
		}).trigger('change_2');

		function isValidArea(area, widthX, widthY) {
			return separateToFloat(widthX) * separateToFloat(widthY) <= separateToFloat(area);
		}
	}

	// / Check area

	// Uncheck

	function initUncheck() {
		$form.find('[aria-click="uncheck"]').on('click', function () {
			$(this).closest('.form-group').find('[type="checkbox"]').prop('checked', false);
		});
	}

	// / Uncheck

	// Init location

	function initLocation() {
		var 
			$lat = $form.find('#lat'),
			$long = $form.find('#long')
			options = {
				radius: 100,
				inputBinding: {
					latitudeInput: $lat,
					longitudeInput: $long,
					locationNameInput: $form.find('#location'),
					streetInput: $form.find('#street'),
					wardInput: $form.find('#ward'),
					districtInput: $form.find('#district'),
					provinceInput: $form.find('#province')
				},
				enableAutocomplete: true
			};

		if ($lat.val() && $long.val()) {
			options.location = { latitude: $lat.val(), longitude: $long.val() }
		}

		$form.find('#map').css({
			height: '300px'
		}).locationpicker(options, {
			'isNew': $form.find('#location').data('new')
		});
	}

	// / Init location

	// Until full

	function initUntilFull() {
		var $isFull = $form.find('#is_full');
		
		if ($isFull.val() == '') {
			popupPrompt({
				title: 'Xác nhận',
				content: 'Bạn muốn đăng thông tin nhanh hay chi tiết?',
				type: 'primary',
				overlay: 'gray',
				buttons: [
					{
						text: 'Tin nhanh',
						type: 'primary',
						handle: function () {
							toggleUntilFull();
						}
					},
					{
						text: 'Chi tiết',
						type: 'primary',
						handle: function () {
							toggleUntilFull(0);
						}
					}
				],
				onEscape: function (isButtonClick) {
					if (!isButtonClick) {
						toggleUntilFull();
					}
					initNavigator();
				}
			});
		}
		else {
			initNavigator();
			if ($isFull.val() == 'false') {
				toggleUntilFull();
			}
			else {
				toggleUntilFull(0);
			}
		}

		$('[aria-click="unfull"]').on('click', function () {
			$button = $(this);
			if (!$button.hasClass('acitve')) {
				toggleUntilFull();
			}
		});

		$('[aria-click="full"]').on('click', function () {
			$button = $(this);
			if (!$button.hasClass('acitve')) {
				toggleUntilFull(0);
			}
		});
	}

	// / Init until full

	// Shape width

	function initShapeWidthConstraint() {
		var 
			$shape = $form.find('#shape');
			$shapeWidth = $form.find('#shape_width'),
			$widthX = $form.find('#width_x');

		$shapeWidth.add($widthX).data('validate', function () {
			if ($shapeWidth.is(':enabled') && $widthX.is(':enabled')) {
				var
					shapeWidth = $shapeWidth.val(),
					width = $widthX.val();

				if (shapeWidth && width) {
					switch ($shape.children(':selected').val()) {
						case '1':
							if (parseFloat(shapeWidth) <= parseFloat(width)) {
								return {
									status: false,
									input: $shapeWidth,
									constraint: 'width'
								};
							}
							break;
						case '2':
							if (parseFloat(shapeWidth) >= parseFloat(width)) {
								$form.toggleValidInput($shapeWidth, false, 'width');
								return {
									status: false,
									input: $shapeWidth,
									constraint: 'width'
								};
							}
							break;
					}
				}  
			}

			if ($shapeWidth.is(':disabled') || $widthX.is(':disabled')) {
				return;
			}

			return {
				status: true,
				input: $shapeWidth,
				constraint: 'width'
			};    
		});
	}

	// / Shape width

	// Init navigator

	function focusBox(params) {
		var name, $box;

		if (typeof params == 'string') {
			name = params;
			$box = $($form.find('.box[aria-name="' + name + '"]'));
			$body.animate({ scrollTop: $box.offset().top - 40 + 'px' }, 200);
		}
		else {
			$box = params;
			name = $box.attr('aria-name');
		}

		if ($box.data('focusing')) {
			return;
		}

		var topReach;
		if ($box.is('[aria-name="button"]')) {
			topReach = $box.offset().top;
		}
		else {
			topReach = $box.find('.box-header').offset().top;
		}
		var $navItem = $formNavigator.find('[aria-name="' + name + '"]');

		$box.data('focusing', true);
		$focusingBox = $box;
		$formNavigator.css('top', topReach - ($navItem.offset().top - $formNavigator.offset().top));

		$formNavigator.find('.active').removeClass('active');
		$navItem.addClass('active');

		$form.find('.box[aria-name].box-primary').removeClass('box-primary').data('focusing', false);
		$box.addClass('box-primary');
	}

	function initNavigator() {
		focusBox($form.find('.box[aria-name]:visible:eq(0)'));

		$('.box[aria-name]').on('changeStatus', function () {
			var $box = $(this);

			$formNavigator.find('[aria-name="' + $box.attr('aria-name') + '"]').attr('data-status', $box.data('status'));
		});

		$('.box[aria-name] :input').on('focus', function () {
			var $box = $(this).closest('.box');

			if (!$box.data('focusing')) {
				focusBox($box);
			}
		});

		_temp['focus_scroll'] = null;
		var 
			lastScrollTop = $window.scrollTop(),
			currentScrollTop;
		$window.on('scroll', function (e) {
			clearTimeout(_temp['focus_scroll']);
			_temp['focus_scroll'] = setTimeout(function () {
				currentScrollTop = $window.scrollTop();

				if (!canSee($focusingBox.is('[aria-name="button"]') ? $focusingBox : $focusingBox.find('.box-header'), {
							// Scroll down => -
							addTop: lastScrollTop < currentScrollTop ? 0 : 300
						})) {
					$form.find('.box[aria-name] .box-header').each(function () {
						if (canSee($(this))) {
							focusBox($(this).closest('.box'));
							return false;
						}
					});
				}

				lastScrollTop = currentScrollTop;
			}, 100);
		});

		$formNavigator.on('mousewheel', function (e) {
			e.preventDefault();
			e = e.originalEvent;
			// Down
			if (e.wheelDeltaY < 0) {
				$formNavigator.css('top', '+=80');
			}
			// Up
			else {
				$formNavigator.css('top', '-=80');
			}
		});

		$formNavigator.find('.item').on('click', function () {
			focusBox($(this).attr('aria-name'));
		});
	}

	// / Init navigator

	// Read price

	function initReadPrice() {
		_temp['read_money_to'] = null;
		$form.find('#sell_price, #rent_price').on({
			keyup: function () {
				var $input = $(this);

				clearTimeout(_temp['read_money_to']);
				_temp['read_money_to'] = setTimeout(function () {
					if ($input.val() != $input.data('old-value')) {
						var value = $input.val().replace(/\D/g, '');

						$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : 'Giá thỏa thuận');

						$input.data('old-value', $input.val());
					}
				}, 200);
			},
			change: function () {
				var $input = $(this);
				
				var value = $input.val().replace(/\D/g, '');

				$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : 'Giá thỏa thuận');

				$input.data('old-value', $input.val());
			}
		});
	}

	// / Read price

	// Save draft

	function initSaveDraft() {
		$form.find('[aria-click="save-draft"]').on('click', function () {
			toggleLoadStatus(true);
			$form.submitStatus(true);
			$.ajax({
				url: '/real_estates/create',
				method: 'POST',
				data: $form.serialize() + '&draft',
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
				$form.submitStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					$form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');
					popupPrompt({
						title: _t.form.success_title,
						content: _t.real_estate.view.create.save_draft_success_content,
						type: 'success'
					})
				}
				else {
					popupPrompt({
						title: _t.form.error_title,
						type: 'danger',
						content: _t.form.error_content
					});
				}
			}).fail(function () {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: _t.form.error_content
				});
			});
		});
	}

	// / Save draft
});