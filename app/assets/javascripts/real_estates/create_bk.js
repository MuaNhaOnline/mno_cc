$(function () {
	var
		$form 		= 	$('#re_form');

	initForm($form, {
		submit_status:	true,
		submit:			function (submitData) {
							if (typeof submitData != 'object') {
								submitData = {};
							}
							$('#is_draft').val(submitData.draft == true);

							return $.ajax({
								url:		$form.attr('action'),
								method:		'POST',
								data:		$form.serialize()
							}).done(function (data) {
								if (data.status == 0) {
									if ($('body').is('[data-signed]')) {
										window.location = data.result.redirect;
									}
									else {
										popupPrompt({
											title:		'Thành công',
											content:	'Đăng tin thành công. Vui lòng vào hộp thư để kích hoạt tin đăng',
											onEscape:	function () {
															window.location = data.result.redirect;
														}
										})
									}
								}
								else {
									_errorPopup();
								}
							}).fail(function () {
								_errorPopup();
							});
						}
	});
	$('#save_draft').on('click', function () {
		$form.trigger('submit', {
			draft: true
		});
	});

	// Currency

		var $currency = $('#currency');

		function updateCurrency() {
			$form.find('[data-object="currency"]').text(
				$currency.find(':selected').text()
			);
		}
		
		$currency.on('change', function () {
			updateCurrency();
		});
		updateCurrency();
	
	// / Currency

	// Money
		
		function fillMoneyText($input, text) {
			$input.closest('.row').find('[data-object="money"]').text(text)
		}
		$('[data-object="price"]').on({
			change_money_text: function (e, text) {
				fillMoneyText($(this), text);
			},
			keyup: function () {
				$(this).trigger('retoggle');
			}
		}).each(function () {
			fillMoneyText($(this), read_money(separateToInt(this.value)));
		});
	
	// / Money

	// Location
	
		var 
			$lat = $('#lat'),
			$lng = $('#lng')
			options = {
				radius: 100,
				inputBinding: {
					latitudeInput: $lat,
					longitudeInput: $lng,
					locationNameInput: $('#location'),
					streetInput: $('#street'),
					wardInput: $('#ward'),
					districtInput: $('#district'),
					provinceInput: $('#province')
				},
				enableAutocomplete: true
			};

		if ($lat.val() && $lng.val()) {
			options.location = { latitude: $lat.val(), longitude: $lng.val() }
		}

		$('#map').css({
			height: '300px'
		}).locationpicker(options, {
			'isNew': $form.find('#location').data('new'),
			required: true
		});
	
	// / Location

	// Area, shape width
	
		var 
			$campusArea 		= 	$('#campus_area'),
			$constructionalArea = 	$('#constructional_area'),
			$usingArea 			= 	$('#using_area'),
			$widthX 			= 	$('#width_x'),
			$widthY 			= 	$('#width_y'),
			$areaAlert 			= 	$('#area_alert'),
			$shape 				= 	$('#shape'),
			$shapeWidth 		= 	$('#shape_width');

		// Area
		
			function checkArea() {
				var $area =
					$campusArea.is(':enabled') ?
						$campusArea :
						$constructionalArea.is(':enabled') ?
							$constructionalArea :
							$usingArea.is(':enabled') ?
								$usingArea :
								false;

				if (
					$area &&
					$area.val() && $widthX.val() && $widthY.val() &&
					separateToFloat($widthX.val()) * separateToFloat($widthY.val()) > separateToFloat($area.val())
				) {				
					$areaAlert.show();
				}
				else {
					$areaAlert.hide();
				}
			}

			$([
				$campusArea.get(0),
				$constructionalArea.get(0),
				$usingArea.get(0),
				$widthX.get(0),
				$widthY.get(0)
			]).on('change disable enable', function () {
				checkArea();
			});
		
		// / Area

		// Shape width
		
			$([
				$shape.get(0),
				$shapeWidth.get(0),
				$widthX.get(0)
			]).data('validate', function () {
				if ($shapeWidth.is(':disabled') || $widthX.is(':disabled')) {
					return;
				}

				var	shapeWidth 	=	$shapeWidth.val(),
					widthX 		=	$widthX.val();
				if (shapeWidth && widthX) {
					switch ($shape.find(':selected').data('value')) {
						case 'less':
							if (parseFloat(shapeWidth) >= parseFloat(widthX)) {
								return {
									status: false,
									input: $shapeWidth,
									constraint: 'width'
								};
							}
							break;
						case 'greater':
							if (parseFloat(shapeWidth) <= parseFloat(widthX)) {
								return {
									status: false,
									input: $shapeWidth,
									constraint: 'width'
								};
							}
							break;
					}
				}

				return {
					status: true,
					input: $shapeWidth,
					constraint: 'width'
				};
			});
		
		// / Shape width
	
	// / Area, shape width

	// Navigator
	
		var
			$menu = $('#menu_list'),
			$follow = $form.find('.box.box-form').parent();

		// Padding top
		function setPaddingTop() {
			$menu.parent().css(
				'padding-top',
				($follow.offset().top - $menu.parent().offset().top) + 'px'
			)
		}
		setPaddingTop();
		$(window).on('resize', function () {
			setPaddingTop();
		});

		// Fixed
		_initFixedScroll($menu, $follow);

		// Active

			function activeByBoxName(boxName) {
				var $activeItem = $menu.find('.active');
				if ($activeItem.data('value') != boxName) {
					$activeItem.removeClass('active');

					$menu.find('[data-value="' + boxName + '"]').addClass('active');
				}
			}
		
			// Active item
			$form.find(':input').on('focus', function () {
				activeByBoxName($(this).closest('[data-object="box"]').data('value'));
			});
			// Active when scroll
			$(window).on('scroll', function () {
				$form.find('[data-object="box"]').each(function () {
					if ($(this).offset().top >= _offsetTop + _currentScrollTop()) {
						activeByBoxName($(this).data('value'));
						return false;
					}
				});
			});
		
		// / Active

		// Click item
		$menu.find('[data-value]').on('click', function () {
			_scrollTo($form.find('[data-object="box"][data-value="' + $(this).data('value') + '"]').offset().top)
		});
	
	// / Navigator
});