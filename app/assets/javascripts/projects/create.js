$(function () {
	var 
		$form = $('#create_p'),
		$formNavigator = $('#form_navigator'),
		$focusingBox;

	initForm($form, {
		submit_status: true,
		object: 'project',
		submit: function () {
			// Validate

			toggleLoadStatus(true);
			$.ajax({
				url: '/projects/create',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
				$form.submitStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					popupPrompt({
						title: _t.form.success_title,
						content: 'Chúc mừng, Bạn đã đăng dự án thành công. Bạn có muốn tiếp tục đăng chi tiết không?',
						// content: 'Bạn đã đăng dự án thành công, nếu đăng chi tiết, bạn có thể xây dựng dự án rõ ràng hơn. Bạn có muốn tiếp tục đăng chi tiết hay không?',
						type: 'success',
						esc: false,
						buttons: [
							{
								text: 'Có',
								type: 'primary',
								handle: function () {
									window.location = '/du-an/dang-chi-tiet/' + data.result;
									// window.location = '/projects/set_is_full_status/' + data.result + '/1';
								}
							}, {
								text: 'Để sau',
								handle: function () {
									window.location = '/du-an/cua-toi';
									// window.location = '/projects/set_is_full_status/' + data.result + '/0';
								}
							}
						]
					})
				}
				else {
					popupPrompt({
						title: _t.form.error_title,
						type: 'danger',
						content: _t.form.error_content
					});
					window.location.reload();
				}
			}).fail(function () {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: _t.form.error_content
				});
				window.location.reload();
			});
		}
	});
	initColorIcon();
	initLocation();
	initChangeCurrency();
	initSaveDraft();
	initCheckDates();
	initNavigator();
	initUnitInput();
	initReadPrice();

	// Color icon
	
		function initColorIcon () {
			$form.find('[aria-object="icon_color"]').on('changeColor', function () {
				$input = $(this);
				$icon = $input.closest('.tab-content').find('[aria-object="icon_key"]');
				$icon.data('set_color')($input.val());
			}).each(function () {
				$input = $(this);
				$icon = $input.closest('.tab-content').find('[aria-object="icon_key"]');
				$icon.data('set_color')($input.val());
			});
		}
	
	// / Color icon

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

	// Change currency

	function initChangeCurrency() {
		var 
			$currency = $('#currency_id'),
			$display = $('#currency_display');

		changeCurrency();

		$form.find('#currency_id').on('change', function () {
			changeCurrency();
		});
		
		function changeCurrency() {
			$display.text($currency.children(':selected').text());
		}
	}

	// / Change currency

	// Save draft

	function initSaveDraft() {
		$form.find('[aria-click="save-draft"]').on('click', function () {
			toggleLoadStatus(true);
			$form.submitStatus(true);
			$.ajax({
				url: '/projects/create',
				method: 'POST',
				data: $form.serialize() + '&draft',
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
				$form.submitStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					$form.prepend('<input type="hidden" name="project[id]" value="' + data.result + '" />');
					popupPrompt({
						title: _t.form.success_title,
						content: _t.project.view.create.save_draft_success_content,
						type: 'success'
					});
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

	// Check dates

	function initCheckDates() {
		var
			$estimate_starting_date = $form.find('#estimate_starting_date'),
			$estimate_finishing_date = $form.find('#estimate_finishing_date'),
			$starting_date = $form.find('#starting_date'),
			$finished_base_date = $form.find('#finished_base_date'),
			$transfer_date = $form.find('#transfer_date'),
			$docs_issue_date = $form.find('#docs_issue_date');

		$estimate_starting_date.add($estimate_finishing_date).on('change', function () {
			if ($estimate_starting_date.val() && $estimate_finishing_date.val()) {
				if (isLesser($estimate_finishing_date, $estimate_starting_date)) {
					$form.toggleValidInput($estimate_finishing_date, false, 'greater_start');
				}
				else {
					$form.toggleValidInput($estimate_finishing_date, true, 'greater_start');
				}
			}
		});

		$starting_date.add($finished_base_date).on('change', function () {
			if ($starting_date.val() && $finished_base_date.val()) {
				if (isLesser($finished_base_date, $starting_date)) {
					$form.toggleValidInput($finished_base_date, false, 'greater_start');
				}
				else {
					$form.toggleValidInput($finished_base_date, true, 'greater_start');
				}
			}
		});

		$transfer_date.add($finished_base_date).on('change', function () {
			if ($transfer_date.val() && $finished_base_date.val()) {
				if (isLesser($transfer_date, $finished_base_date)) {
					$form.toggleValidInput($transfer_date, false, 'greater_finish');
				}
				else {
					$form.toggleValidInput($transfer_date, true, 'greater_finish');
				}
			}
		});

		$docs_issue_date.add($finished_base_date).on('change', function () {
			if ($docs_issue_date.val() && $finished_base_date.val()) {
				if (isLesser($docs_issue_date, $finished_base_date)) {
					$form.toggleValidInput($docs_issue_date, false, 'greater_finish');
				}
				else {
					$form.toggleValidInput($docs_issue_date, true, 'greater_finish');
				}
			}
		});

		function isLesser($d1, $d2) {
			var 
				p1 = $d1.val().split('/'),
				p2 = $d2.val().split('/'),
				date1 = new Date(p1[2], p1[1] - 1, p1[0]),
				date2 = new Date(p2[2], p2[1] - 1, p2[0]);

			return date1 < date2
		}
	}

	// / Check dates

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
		$form.find('#unit_price').on({
			keyup: function () {
				var $input = $(this);

				clearTimeout(_temp['read_money_to']);
				_temp['read_money_to'] = setTimeout(function () {
					if ($input.val() != $input.data('old-value')) {
						var value = $input.val().replace(/\D/g, '');

						$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : '');

						$input.data('old-value', $input.val());
					}
				}, 200);
			},
			change: function () {
				var $input = $(this);
				
				var value = $input.val().replace(/\D/g, '');

				$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : '');

				$input.data('old-value', $input.val());
			}
		});
	}

	// / Read price
})