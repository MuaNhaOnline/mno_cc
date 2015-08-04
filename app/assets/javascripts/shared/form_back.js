function initForm($form, params) {
	if (typeof(params) === 'undefined') {
		params = {};
	}

	initToggle();
	initFileInput();
	initConstraint();
	initSubmit();

	/*
		Toggle
	*/

	function initToggle() {
		$form.find('.input-toggle').on('change', function () {
			toggle($(this));
		}).each(function () {
			toggle($(this));	
		});
		
		$form.inputToggle = function () {
			$form.find('.input-toggle').each(function () {
				toggle($(this));	
			});
		}

		function toggle($input) {
			// Get elements will be affect
			var offElements = onElements = '';
			if ($input.is('input[type="checkbox"], input[type="radio"]')) {
				if ($input.prop('checked')) {
					onElements = $input.attr('data-on');
					offElements = $input.attr('data-off');
				}
				else {
					onElements = $input.attr('data-off');
					offElements = $input.attr('data-on');
				}
			}
			else if ($input.is('select')) {
				var $option = $input.children(':selected');

				onElements = $option.attr('data-on');
				offElements = $option.attr('data-off');
			}

			// Turn on elements
			if (onElements && !$input.is(':disabled')) {
				// Create elements list
				var onElementsList = '';
				$(onElements.split(' ')).each(function () {
					onElementsList += ',[data-toggled-element~="' + this + '"]';
				});

				// Turn on all elements & process their child
				$form.find(onElementsList.substr(1)).each(function () {
					var $element = $(this);

					// Turn on element
					toggleElement($element, true)

					// Process this element
					if ($element.is('.input-toggle')) {
						toggle($element);
					}

					// Process element's child if exists
					$element.find('.input-toggle').each(function () {
						toggle($(this));
					});
				});
			}

			// Turn off elements
			if (offElements) {
				// Create elements list
				var offElementsList = '';
				$(offElements.split(' ')).each(function () {
						offElementsList += ',[data-toggled-element~="' + this + '"]';
				});

				// Turn off all elements & process their child
				$form.find(offElementsList.substr(1)).each(function () {
					var $element = $(this);

					// Turn off element
					toggleElement($element, false)

					// Process this element
					if ($element.is('.input-toggle')) {
						// toggle($element);
					}

					// Process element's child if exists
					$element.find('.input-toggle').each(function () {
						// toggle($(this));
					});
				});
			}
		}

		function toggleElement($element, on) {
			if (!$element.is(':input')) {
				if (on) {
					$element.removeClass('off');

					$element.find(':input').prop('disabled', false);
					// .each(function () {
					// 	var $input = $(this);
					// 	var invalid = checkInvalidInput($input);
					// 	if (invalid) {
					// 		toggleValidInput($input, false, $input.attr('name'), invalid);	      		
					// 	}
					// });
				}
				else {
					$element.addClass('off');

					$element.find(':input').prop('disabled', true).each(function () {
						var $input = $(this);
						toggleValidInput($input, true, $input.attr('name'));	      		
					});
				}
			}
			else {
				$element.prop('disabled', !on);
				if (on) {
					$element.removeClass('off');

					// var invalid = checkInvalidInput($element);
					// if (invalid) {
					// 	toggleValidInput($element, false, $element.attr('name'), invalid);	      		
					// }
				}
				else {
					$element.addClass('off');

					toggleValidInput($element, false, $element.attr('name'));	  
				}
			}
		}
	}

	/*
		/Toggle
	*/

	/*
		File input
	*/

	function initFileInput() {
		//Get element
		var $fileUploads = $form.find('.file-upload');

		//Create element
		$fileUploads.each(function () {
			var $fileUpload = $(this);

			var $wrapper = $('<label class="file-uploader form-control"></label>');

			$fileUpload.after($wrapper);
			$fileUpload.appendTo($wrapper);

			var initValue = $fileUpload.attr('data-init-value') || '';
			var constraint = $fileUpload.attr('data-constraint');
			constraint = constraint ? 'data-constraint="' + constraint + '"' : '';
			$fileUpload.after('<input ' + constraint + ' type="hidden" name="' + $fileUpload.attr('name') + '" value="' + ($fileUpload.attr('data-init-value') || '') + '" />');

			$fileUpload.removeAttr('name data-init-value data-constraint');

			if (initValue) {
				$(initValue.split(',')).each(function () {
					var $item = $('<article class="preview"></article>');
					$item.html('<img src="/images/' + this + '" /><section class="control"><a class="close" aria-click="remove"><span>×</span></a></section>');
					$item.data('value', this);
					$item.find('[aria-click="remove"]').on('click', function (e) {
						e.preventDefault();
						var itemValue = $item.data('value');
						$item.remove();

						var hiddenInput = $wrapper.find('input[type="hidden"]')[0];
						hiddenInput.value = '';

						if (itemValue) {
							$wrapper.find('.preview').each(function () {
								var value = $(this).data('value');

								if (value) {
									hiddenInput.value += ',' + value;
								}
							});
						}

						if (hiddenInput.value) {
							hiddenInput.value = hiddenInput.value.substr(1);
						}

						$(hiddenInput).change();
					});

					$wrapper.append($item);
				});
			}
		});

		/*
			Progress on choose new file
		*/
		$fileUploads.on('change', function () {
			if (this.files.length == 0) { 
				return; 
			}

			// Get fileupload
			var $fileUpload = $(this);

			// Get type of image
			var type = $fileUpload;

			// Get wrapper
			var $wrapper = $fileUpload.parent();

			// Process files
			$(this.files).each(function () {
				var file = this;

				var fileReader = new FileReader();

				fileReader.onload = function (e) {
					// Create item
					var $item = $('<article class="preview"></article>');
					$item.html('<img src="' + e.target.result + '" /><section class="control"><a class="close" aria-click="remove"><span>×</span></a></section><section class="progress"><article class="progress-bar" role="progressbar" style="width: 0%;"></article></section>');

					$wrapper.prepend($item);

					// Get data
					var data = new FormData();
					data.append('file', file);
					data.append('type', type);

					// Preparing upload
					var $progressBar = $item.find('.progress-bar');
					$item.attr('data-status', 'uploading');
					$item.find('img').css('opacity', '.5');

					// Upload file
					$.ajax({
							url: '/images/upload',
							type: 'POST',
							data: data,
							processData: false,
							contentType: false,
							dataType: 'JSON',
							xhr: function() {
									var xhr = $.ajaxSettings.xhr();
									if(xhr.upload){ //Check if upload property exists
											xhr.upload.addEventListener('progress', function(e) {
													if(e.lengthComputable){
															$progressBar.css('width', Math.ceil(e.loaded/e.total) * 100 + '%');
													}
											}, false); //For handling the progress of the upload
									}
									return xhr;
							}
					}).done(function(data) {
						if (data.status == 0) {
							// Display
							$item.attr('data-status', 'done');
							$item.find('img').css('opacity', '1');
							$progressBar.parent().remove();

							// Value
							var $hiddenInput = $wrapper.find('input[type="hidden"]');
							$hiddenInput.val($hiddenInput.val() ? $hiddenInput.val() + ',' + data.result : data.result).change();
							$item.data('value', data.result);
						}
						else {
							$item.attr('data-status', 'error');
						}
					}).fail(function() {
						$item.attr('data-status', 'error');
					});

					// Remove event
					$item.find('[aria-click="remove"]').on('click', function (e) {
						e.preventDefault();

						var itemValue = $item.data('value');
						$item.remove();

						var hiddenInput = $wrapper.find('input[type="hidden"]')[0];
						hiddenInput.value = '';

						if (itemValue) {
							$wrapper.find('.preview').each(function () {
								var value = $(this).data('value');

								if (value) {
									hiddenInput.value += ',' + value;
								}
							});
						}

						if (hiddenInput.value) {
							hiddenInput.value = hiddenInput.value.substr(1);
						}

						$(hiddenInput).change();
					});
				}

				fileReader.readAsDataURL(file);
			});
		});
	}

	/*
		/ File input
	*/

	/*
		Constraint
	*/

	function initConstraint() {
		$form.find('.form-group').filter(function () {
			var ok = false;

			$(this).find('[data-constraint~="required"]').each(function () {
				if (!this.value) {
					$(this).data('invalid', ok = true);
					return false;
				}
			});

			return ok;
		}).addClass('has-error');

		$form.find('[data-constraint~="required"]').on({
			change: function () {
				if (!this.value) {
					$(this).data('invalid', true).closest('.form-group').addClass('has-error');	
				}
			}
		})

		$form.find('[data-constraint]').on({
			'change': function () {
				var $input = $(this);
				if ($input.data('invalid')) {
					if (!checkInvalidInput($input)) {
						toggleValidInput($input, true, $input.attr('name'));
					}
				}
			}
		});

		// Interger
		$form.find('[data-constraint~="integer"]').on({
			'keypress': function (e) {
				var keyCode = e.which;

				if (
						//Number
						(48 <= keyCode &&
						keyCode <= 57) ||

						//Enter key
						keyCode == 13
					) {
					return;
				}
				e.preventDefault();
			},

			'paste': function () {
				var $input = $(this);

				setTimeout(function () {
					$input.val($input.val().replace(/\D/g, ''));
				});
			}
		});

		// Real
		$form.find('[data-constraint~="real"]').on({
			'keypress': function (e) {
				var keyCode = e.which;
				if (
						//Number
						(48 <= keyCode &&
						keyCode <= 57) ||

						//Float point
						(keyCode == 46 && this.value.indexOf('.') === -1) ||
						
						//Enter key
						keyCode == 13
					) {
					return;
				}
				e.preventDefault();
			},

			'paste': function () {
				var $input = $(this);

				setTimeout(function () {
					var value = $input.val();

					var floatPoint = value.indexOf('.');

					if (floatPoint === -1) {
							value = value.replace(/\D/g, '');
					}
					else {
							value = value.slice(0, floatPoint).replace(/\D/g, '') + '.' + value.slice(floatPoint).replace(/\D/g, '');
					}

					$input.val(value);
				});
			}
		});

		// Range
		$form.find('[data-constraint~="range"]').on({
			'change': function () {
				var $input = $(this);

				var 
					minValue = $input.data('min-value'),
					maxValue = $input.data('max-value');

				if (minValue && this.value < minValue) {
					this.value = minValue;
				}

				if (maxValue && maxValue < this.value) {
					this.value = maxValue;
				}
			}
		});
	};

	//Check input
	function checkInvalidInput($input) {
		if ($input.is('[data-constraint~="required"]')) {
			if (!$input.val()) {
				return 'required';
			}
		}

		return;
	}

	/*

	*/
	function toggleValidInput($input, isValid, name, constraint) {
		if (isValid) {
			// Set valid input
			$input.data('invalid', false);

			// Remove error class from form group if all input in valid
			var $formGroup = $input.closest('.form-group');
			if ($formGroup.find('[data-constraint]').filter(function () { return $(this).data('invalid'); }).length == 0) {
				$formGroup.removeClass('has-error');
			}

			// Remove error message, remove error class from box
			var 
				$box = $input.closest('.box'),
				$callout = $box.find('.callout-danger');

			// Remove error message
			$callout.find('[aria-name="' + name + '"]').remove();

			// Check if not exist error => remove error class
			if ($callout.children().length == 0) {
				$box.removeClass('box-danger');
				$callout.remove();
			}
		}
		else {
			// Check if input was invalid with this constraint => return
			if ($input.data('invalid') === constraint) {
				return;
			}

			// Set invalid input with constraint
			$input.data('invalid', constraint);

			// Add error class to form group
			$input.closest('.form-group').addClass('has-error');

			// Add error class to box
			var $box = $input.closest('.box');
			$box.addClass('box-danger');

			// Add error message
			// Get callout
			var $callout = $box.find('.callout-danger');
			if ($callout.length == 0) {
				$callout = $('<div class="callout callout-danger"></div>');
				$box.find('.box-body').prepend($callout);
			}

			// Get error message
			var $errorMessage = $callout.find('[aria-name="' + name + '"]');
			if ($errorMessage.length == 0) {
				$errorMessage = $('<p aria-name="' + name + '"></p>');
				$callout.prepend($errorMessage);
			}

			$errorMessage.text(_t[params.object]['validate'][name + '_' + constraint]);
		}
	}

	/*
		/ Constraint
	*/

	/*
		Submit
	*/

	function initSubmit() {
		$form.on('submit', function (e) {
			e.preventDefault();

			// Check validate
			var isValid = true;
			$form.find('[data-constraint]:enabled').each(function () {
				var $input = $(this);
				var invalid = checkInvalidInput($input);
				if (invalid) {
					toggleValidInput($input, false, $input.attr('name'), invalid)
					isValid = false;
				};				
			})

			//Submit
			if (isValid) {
				if ('submit' in params) {
					params.submit();
				}
			}
		});
	}

	/*
		/ Submit
	*/
}