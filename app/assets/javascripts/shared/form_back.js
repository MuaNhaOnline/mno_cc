/*
	object:
		object form (for validate)
	submit:
		function will be implement after submit
*/
function initForm($form, params) {
	if (typeof(params) === 'undefined') {
		params = {};
	}

	initToggle();
	initFileInput();
	initSeparateNumber();
	initConstraint();
	initSubmit();
	if ($form.is('[data-entertotab]')) {
		initEnterKey();	
	}

	$form.find('.box').on('click', function (e) {
		if ($(e.target).is('.box, .box-header, .box-body, .box-footer, .form-group, .checkbox, .radio')) {
			$(this).find('[data-widget="collapse"]').click();
		}
	});

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

					$element.find(':input').prop('disabled', false).trigger('enable');
					// .each(function () {
					// 	var $input = $(this);
					// 	var invalid = checkInvalidInput($input);
					// 	if (invalid) {
					// 		toggleValidInput($input, false, invalid);	      		
					// 	}
					// });
				}
				else {
					$element.addClass('off');

					$element.find(':input').prop('disabled', true).trigger('disable').each(function () {
						var $input = $(this);

						toggleValidInput($input, true);
					});
				}

				// if ($element.is('.form-group')) {
				// 	initConstraintFormGroup($element);
				// }
				// else {
				// 	initConstraintFormGroup($element.find('.form-group'));
				// }
			}
			else {
				$element.prop('disabled', !on);
				if (on) {
					$element.removeClass('off').trigger('enable');

					// var invalid = checkInvalidInput($element);
					// if (invalid) {
					// 	toggleValidInput($element, false, invalid);	      		
					// }
				}
				else {
					$element.addClass('off').trigger('disable');;

					toggleValidInput($element, true);	  
				}

				// initConstraintFormGroup($element.closest('.form-group'));
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

			var $label = $('<div class="file-upload-label"><div class="fa fa-photo"></div><div>' + _t.form.label_image_upload + '</div></div>');

			$fileUpload.after($wrapper);
			$fileUpload.appendTo($wrapper);
			$label.appendTo($wrapper);

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

					$wrapper.prepend($item);
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
			var $fileUpload = $(this),
				amount = $fileUpload.data('amount'),
				size = $fileUpload.data('size'),
				types = $fileUpload.data('type'),
				ratio = $fileUpload.data('ratio');

			if (types) {
				types = types.split(' ');
			}

			var isMulti = $fileUpload.is('[multiple]');

			// Get wrapper
			var $wrapper = $fileUpload.parent();

			var $hiddenInput = $wrapper.find('input[type="hidden"]');

			// Check amount
			var currentAmount = $hiddenInput.val().split(',').length;

			/* 
				Init for read file
			*/

			var $html = $('<article class="cropper-container"><section class="image-cropper"></section><section class="button-group clearfix"><button aria-click="close" title="' + _t.form.cancel_tooltip + '" class="btn btn-link pull-left"><span class="fa fa-close"></span></button><button aria-click="crop" title="' + _t.form.crop_tooltip + '" class="btn btn-link pull-right"><span class="fa fa-crop"></span></button></section></article>');
			var fileReader = new FileReader();
			fileReader.onload = function (e, i) {

				/*
					Crop
				*/

				var $img = $('<img src="' + e.target.result + '" />');

				$html.find('.image-cropper').html($img);

				var $popup = popupFull({
					html: $html,
					esc: false
				});

				// Create image cropper
				$img.cropper({
				  aspectRatio: ratio
				});

				/*
					Set button event
				*/

				$html.find('[aria-click="close"]').on('click', function () {
					$popup.off();
					readNext();
				});

				$html.find('[aria-click="crop"]').on('click', function () {
					$popup.off();
					readNext();

					var imageData = $img.cropper('getCroppedCanvas').toDataURL();

					var $item = $('<article class="preview"></article>');
					$item.html('<img src="' + imageData + '" /><section class="control"><a class="close" aria-click="remove"><span>×</span></a></section><section class="progress no-margin"><article class="progress-bar" role="progressbar" style="width: 0%;"></article></section>');

					if (!isMulti) {
						$wrapper.children('.preview').remove();
					}
					$wrapper.prepend($item);

					// Get data
					var data = new FormData();
					data.append('file', dataURLToBlob(imageData, fileReader.fileType));
					data.append('file_name', fileReader.fileName);

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
							if (isMulti) {
								$hiddenInput.val($hiddenInput.val() ? $hiddenInput.val() + ',' + data.result : data.result).change();	
							}
							else {
								$hiddenInput.val(data.result).change();
							}
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
				});

				/*
					/ Set button event
				*/

				/*
					Crop
				*/
			}

			/* 
				/ Init for read file
			*/

			// Read files
			var files = this.files;
			var currentIndex = 0;
			function readNext() {
				// Check index & amount
				if (currentIndex >= files.length || (amount && currentAmount > amount)) {
					return false;
				}

				// Get file
				var file = files[currentIndex++];

				// Check type
				if (types && $.inArray(file.name.split('.').pop(), types) === -1) {
					return;
				}

				// Set info
				fileReader.fileName = file.name;
				fileReader.fileType = file.type;

				// Read file
				fileReader.readAsDataURL(file);
			}
			readNext();

			/*
			// Process files
			$(this.files).each(function () {
				var file = this;

				// Check type
				if (types && $.inArray(file.name.split('.').pop(), types) === -1) {
					return;
				}

				// Check size
				if (size && file.size > size) {
					return;
				}

				// Check amount
				if (amount && ++currentAmount > amount) {
					return false;
				}




				var fileReader = new FileReader();

				return;
				fileReader.onload = function (e) {
					// Create item
					var $item = $('<article class="preview"></article>');
					$item.html('<img src="' + e.target.result + '" /><section class="control"><a class="close" aria-click="remove"><span>×</span></a></section><section class="progress"><article class="progress-bar" role="progressbar" style="width: 0%;"></article></section>');

					if (!isMulti) {
						$wrapper.children('.preview').remove();
					}
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
							if (isMulti) {
								$hiddenInput.val($hiddenInput.val() ? $hiddenInput.val() + ',' + data.result : data.result).change();	
							}
							else {
								$hiddenInput.val(data.result).change();
							}
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
			});*/
		});
	}

	/*
		/ File input
	*/

  /*
    Price format
  */

  function initSeparateNumber() {
    $form.find('.separate-number').on({
      focus: function () {
        _temp['price'] = this.value;
      },
      keyup: function () {
        var input = this;
        var value = input.value;

        var oldPrice = _temp['price'];
        if (oldPrice == value) {
          return;
        }

        // Get current selection end
        var selectionEnd = value.length - input.selectionEnd;

        value = moneyFormat(intFormat(value), ',');
        input.value = value;
        selectionEnd = value.length - selectionEnd;
        input.setSelectionRange(selectionEnd, selectionEnd);

        _temp['price'] = value;
      },
      paste: function () {
        var input = this;
        var value = input.value;

        var oldPrice = _temp['price'];
        if (oldPrice == value) {
          return;
        }

        // Get current selection end
        var selectionEnd = value.length - input.selectionEnd;

        value = moneyFormat(intFormat(value), ',');
        input.value = value;
        selectionEnd = value.length - selectionEnd;
        input.setSelectionRange(selectionEnd, selectionEnd);

        _temp['price'] = value;
      }
    }).keyup();
  }

  /*
    / Price format
  */

	/*
		Constraint
	*/

	// function initConstraintFormGroup($formGroups) {
	// 	$formGroups.filter(function () {
	// 		var ok = false;

	// 		$(this).find('[data-constraint~="required"]').each(function () {
	// 			if (!this.value) {
	// 				$(this).data('invalid', ok = true);
	// 				return false;
	// 			}
	// 		});

	// 		return ok;
	// 	}).addClass('has-error');
	// }

	function initConstraint() {
		// initConstraintFormGroup($form.find('.form-group'));

		$form.find('[data-constraint]').on({
			'change': function () {
				var $input = $(this);
				if ($input.data('invalid')) {
					checkInvalidInput($(this));	
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
					$input.val($input.val().replace(/\D/g, '')).change();
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

					$input.val(value).change();
				});
			}
		});

    // Email
    $form.find('[data-constraint~="email"]').on({
      'focusout': function () {
        var $input = $(this);
        if ($input.val() && !/^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i.test($input.val())) {
          $input.val('').change();
        }
      }
    });

		// Range
		$form.find('[data-constraint~="range"]').on({
			'change': function () {
				var $input = $(this);

				var 
					minValue = $input.data('minvalue'),
					maxValue = $input.data('maxvalue');

				if (minValue && this.value < minValue) {
					$(this).val(minValue).change();
				}

				if (maxValue && maxValue < this.value) {
					$(this).val(maxValue).change();
				}
			}
		});

		// $form.find('[data-constraint~="required"]').on({
		// 	change: function () {
		// 		if (!this.value) {
		// 			$(this).data('invalid', true).closest('.form-group').addClass('has-error');
		// 		}
		// 	}
		// });
	};

	//Check input
	function checkInvalidInput($input) {
		if ($input.is('[data-constraint~="required"]')) {
			if (!$input.val()) {
				toggleValidInput($input, false, 'required');
				return 'required';
			}
		}

		if (typeof $input.data('validate') === 'function') {
			var result = $input.data('validate')();

			if (result.status === true) {
				var $validInput = result.input || $input;
				toggleValidInput($validInput, true, result.constraint || 'custom');
			}
			else {
				var $invalidInput = result.input || $input;
				toggleValidInput($invalidInput, false, result.constraint || 'custom');
			}
			return;
		}

		toggleValidInput($input, true);
	}

	/*
		Toggle valid input
	*/
	$form.toggleValidInput = function ($input, isValid, constraint, name) {
		toggleValidInput($input, isValid, constraint, name);
	};

	function toggleValidInput($input, isValid, constraint, name) {
		var name = name || $input.attr('name');

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
				$callout = $box.find('.callout-error');

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
			var $callout = $box.find('.callout-error');
			if ($callout.length == 0) {
				$callout = $('<section class="callout-error"></section>');
				$box.find('.box-body').prepend($callout);
			}

			// Get error message
			var $errorMessage = $callout.find('[aria-name="' + name + '"]');
			if ($errorMessage.length == 0) {
				$errorMessage = $('<p aria-name="' + name + '"></p>');
				$callout.append($errorMessage);
			}

			$errorMessage.text(_t[params.object]['validate'][name + '_' + constraint]);
		}
	}

	/*
		/ Constraint
	*/

	/*
		Enter key
	*/

	function initEnterKey() {
		$form.find(':input').on({
			keypress: function (e) {
		    if (e.keyCode == 13 && !e.shiftKey) {
		    	e.preventDefault();

	        var inputs = $form.find(":input:focusable");
	        var idx = inputs.index(this);

	        if (idx == inputs.length - 1) {
	          inputs[0].focus();
	        } 
	        else {
	          inputs[idx + 1].focus();
	        }
	      }
			}
		});
	}

	/*
		/Enter key
	*/

	/*
		Submit
	*/

	function initSubmit() {
		$form.on('submit', function (e) {
			e.preventDefault();

			// Check validate
			$form.find('[data-constraint]:enabled').each(function () {
				var $input = $(this);
				if (!$input.data('invalid')) {
					checkInvalidInput($input);	
				}
			})

			var $dangerBox = $form.find('.box-danger');
			if ($dangerBox.length) {
	    	$body.animate({
	    		scrollTop: $dangerBox.offset().top - 20 
	    	});	
				return;	
			}

			//Submit
			if ('submit' in params) {
				params.submit();
			}
		});
	}

	/*
		/ Submit
	*/
}