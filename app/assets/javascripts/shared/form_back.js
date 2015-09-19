/*
	object:
		object form (for validate)
	submit:
		function will be implement after submit
*/
function initForm($form, params) {
	if (typeof params == 'undefined') {
		params = {};
	}

	if (!('object' in params)) {
		params.object = 'form';
	}

	// <a class="fa fa-info pull-right" data-toggle="popover" data-trigger="focus hover" data-placement="left" data-content=""></a>
	$form.find('[data-toggle="popover"]').popover({
		html: true
	});

	initToggle();
	initFileInput();
	initFileInput_2();
	initAutoComplete();
	initSeparateNumber();
	initConstraint();
	initSubmit();
	initHelper();
	if ($form.is('[data-entertotab]')) {
		initEnterKey(); 
	}

	// $form.find('.box').on('click', function (e) {
	// 	if ($(e.target).is('.box, .box-header, .box-body, .box-footer, .form-group, .checkbox, .radio')) {
	// 		$(this).find('[data-widget="collapse"]').click();
	// 	}
	// });

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

					// if ($element.is('#level')) {
					// 	console.log($input);	
					// }

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
					// if ($element.is('.input-toggle')) {
					// 	// toggle($element);
					// }

					// // Process element's child if exists
					// $element.find('.input-toggle').each(function () {
					// 	// toggle($(this));
					// });
				});
			}
		}

		function toggleElement($element, on) {
			if (!$element.is(':input')) {
				// if ($element.is('#level')) {
				// 	console.log(on);	
				// }
				if (on) {
					$element.removeClass('off');

					$element.find(':input:disabled').prop('disabled', false).trigger('enable');
					// .each(function () {
					//  var $input = $(this);
					//  var invalid = checkInvalidInput($input);
					//  if (invalid) {
					//    toggleValidInput($input, false, invalid);           
					//  }
					// });
				}
				else {
					$element.addClass('off');

					$element.find(':input:enabled').prop('disabled', true).trigger('disable').each(function () {
						var $input = $(this);

						removeSuccessLabel($input);
						toggleValidInput($input, 1);
					});
				}

				// if ($element.is('.form-group')) {
				//  initConstraintFormGroup($element);
				// }
				// else {
				//  initConstraintFormGroup($element.find('.form-group'));
				// }
			}
			else {
				if ($element.prop('disabled') == !on) {
					return;
				}

				$element.prop('disabled', !on);
				if (on) {
					removeSuccessLabel($element.removeClass('off').trigger('enable'));

					// var invalid = checkInvalidInput($element);
					// if (invalid) {
					//  toggleValidInput($element, false, invalid);           
					// }
				}
				else {
					$element.addClass('off').trigger('disable');;

					removeSuccessLabel($element);
					toggleValidInput($element, 1);   
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
		var $fileUploads = $form.find('.file-upload'), currentAmount;

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
			currentAmount = $hiddenInput.val().split(',').length;

			/* 
				Init for read file
			*/

			var $html = $('<article class="box box-solid no-margin"><section class="box-header padding-bottom-0"><h3 class="box-title">' + _t.form.crop_title + '</h3></section><section class="box-body cropper-container no-padding"><section class="image-cropper"></section></section><section class="box-footer no-padding"><section class="button-group clearfix"><button aria-click="close" title="' + _t.form.delete_tooltip + '" class="btn btn-link pull-left no-underline"><span class="fa fa-close"></span> ' + _t.form.delete + '</button><button aria-click="crop" title="' + _t.form.crop_tooltip + '" class="btn btn-link pull-right no-underline"><span class="fa fa-crop"></span> ' + _t.form.crop + '</button></section></article></section></article>');
			var fileReader = new FileReader();
			var currentIndex = 0;
			fileReader.onload = function (e, i) {

				/*
					Crop
				*/

				var $img = $('<img src="' + e.target.result + '" />');

				$html.find('.image-cropper').html($img);

				var $popup = popupFull({
					html: $html,
					id: 'image_cropper',
					'z-index': 35,
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
					currentAmount++;
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
															$progressBar.css('width', (e.loaded/e.total * 100) + '%');
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

						currentAmount--;
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
			function readNext() {
				// Check index & amount
				if (currentIndex >= files.length || (amount && currentAmount >= amount)) {
					return false;
				}

				// Get file
				var file = files[currentIndex++];

				// Check type
				if (types && $.inArray(file.name.split('.').pop().toLowerCase(), types) == -1) {
					return;
				}

				// Set info
				fileReader.fileName = file.name;
				fileReader.fileType = file.type;

				// Read file
				fileReader.readAsDataURL(file);
			}
			readNext();
		});

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

			$fileUpload.removeAttr('name data-init-value data-constraint').attr('data-nonvalid', '');

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

						currentAmount--;
						$(hiddenInput).change();
					});

					$wrapper.prepend($item);
				});
			}
		});
	}

	function initFileInput_2() {
		$form.find('.file-upload-2').each(function () {
			var 
				$fileUpload = $(this),
				$wrapper = $('<button class="btn btn-default btn-file"></button>'),
				size = $fileUpload.data('size');

			$fileUpload.after($wrapper);
			$fileUpload.appendTo($wrapper);
			$wrapper.append($fileUpload.data('label'));
			$wrapper.after('<button type="button" style="display: none; position: relative;" class="btn btn-default margin-left-5">&times;<div class="progress progress-xxs progress-inside"><div class="progress-bar progress-bar-primary" role="progressbar"></div></div></button><span class="margin-left-5"></span>');

			var constraint = $fileUpload.attr('data-constraint');
			constraint = constraint ? 'data-constraint="' + constraint + '"' : '';

			$wrapper.append('<input type="hidden" ' + constraint + ' name="' + $fileUpload.attr('name') + '" />');

			$fileUpload.removeAttr('name data-constraint');

			$wrapper.next().on('click', function () {
				$wrapper.find('[type="hidden"]').val('').change();
        $wrapper.show().next().hide().next().text('');
			});

			if ($fileUpload.data('value')) {
				$wrapper.find('[type="hidden"]').val($fileUpload.data('value'));
				$wrapper.hide().next().show().next().text($fileUpload.data('text'));
			}

			$fileUpload.on('change', function () {
				if (this.files.length == 0) { 
					return; 
				}

				var file = this.files[0];

				$wrapper.find('[type="hidden"]').val('').change();
				$wrapper.hide().next().show().next().text(file.name);

				// Get data
				var data = new FormData();
				data.append('file', file);

				// Preparing upload
				var $progressBar = $wrapper.next().find('.progress-bar');

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
										$progressBar.css('width', (e.loaded/e.total * 100) + '%');
									}
								}, false); //For handling the progress of the upload
							}
							return xhr;
						}
				}).done(function(data) {
					if (data.status == 0) {
						// Display
						$wrapper.hide();
						$progressBar.css('width', '0%');

						$wrapper.children('[type="hidden"]').val(data.result).change();
					}
					else {
		        popupPrompt({
		          title: _t.form.error_title,
		          type: 'danger',
		          content: _t.form.error_content
		        });
		        $wrapper.next().hide().next('.file-name').text('');
					}
				}).fail(function() {
	        popupPrompt({
	          title: _t.form.error_title,
	          type: 'danger',
	          content: _t.form.error_content
	        });
	        $wrapper.next().hide().next('.file-name').text('');
				});
			});
		});
	}

	/*
		/ File input
	*/

	/*
		Auto complete
	*/

	function initAutoComplete() {
		var prefix = 'ac_';
		var $currentList, $currentInput;
		_temp[prefix + 'ajax'] = false;

		$form.find('[aria-input-type="autocomplete"]').each(function () {
			var 
				$input = $(this),
				isFree = $input.is('[data-free]');

			// Create full element
      $input.wrap('<article class="autocomplete-container"></article>');
      var 
      	acName = name = $input.attr('name'),
      	value = $input.data('value');

      if (name[name.length - 1] == ']') {
      	acName = acName.substr(0, acName.length - 1) + '_ac]';
      }
      else {
      	acName = name + '_ac'
      }

      $input.after('<input data-constraint="' + $input.attr('data-constraint') + '" type="hidden" value="' + (value || '') + '" name="' + name + '"><section class="autocomplete-list-container"><ul class="list"></ul><span' + (isFree ? ' style="cursor: pointer"' : '') + '></span></section>');
      $input.removeAttr('data-constraint');
      $input.attr({
      	'name': acName,
      	'data-nonvalid': ''
      });

			var $listContainer = $input.find('~ .autocomplete-list-container');
			var $list = $listContainer.children('ul');

			// For prevent when choose by click
			$listContainer.on('click', function (e) {
				e.stopPropagation();
			});

			$list.next().on({
				click: function () {
					$currentInput.removeClass('focus');
					$(document).off('click.off');

					if (_temp[prefix + 'change']) {
						closeAutoComplete();
					}
				}
			})

			$input.on({
				focus: function () {
					$currentList = $list;
					$currentInput = $input;

					if ($currentInput.hasClass('focus')) {
						return;
					}

					$currentInput.addClass('focus');
					$list.empty().next().text(isFree ? _t.form.keyword_for_search_or_new : _t.form.keyword_for_search);	
					_temp[prefix + 'old'] = $currentInput.val();

					// For click outside
					$(document).on('click.off', function (e) {
						if (!$currentInput.is(':focus')) {
							$currentInput.removeClass('focus');
							$(document).off('click.off');

							if (_temp[prefix + 'change']) {
								closeAutoComplete();
							}
						}
					});
				},
				keyup: function () {
					if (_temp[prefix + 'value'] == $currentInput.val()) {
						return;
					}

					if (!$currentInput.hasClass('focus')) {
						$currentInput.focus();
					}

					_temp[prefix + 'change'] = true;
					clearTimeout(_temp[prefix + 'to']);
					_temp[prefix + 'to'] = setTimeout(function () {
						_temp[prefix + 'value'] = $currentInput.val();

						var data = $.parseJSON($currentInput.data('data') || '{}');
						data.keyword = $currentInput.val();

						if (data.keyword) {
							if (_temp[prefix + 'ajax']) {
								_temp[prefix + 'ajax'].abort();	
							}
							_temp[prefix + 'ajax'] = $.ajax({
								url: $input.data('url'),
								data: data,
								dataType: 'JSON'
							}).done(function (data) {
								if (data.status != 0 || data.result.length == 0) {
									searchNoResult();
								}
								else {
									var html = create_auto_complete(data.result);
									$list.html(html);

									initAutoCompleteList()

									$list.children(':first-child').addClass('selected');
								}
							}).fail(function (xhr, status) {
								if (status != 'abort') {
									searchNoResult();
								}
							});
						}
						else {
							searchNoResult();
						}
					}, 200)
				},
				keydown: function (e) {
					switch (e.which) {
						// Up
						case 38:
							e.preventDefault();

							var $selected = $list.children('.selected');
							if ($selected.length == 0) {
								selectAutoComplete($list.children(':last-child'), 1);
							}
							else {
								var $prev = $selected.prev();
								if ($prev.length == 0) {
									selectAutoComplete($list.children(':last-child'), 1);
								}
								else {
									selectAutoComplete($prev, 1);
								}
							}
							break;

						// Down
						case 40:
							e.preventDefault();

							var $selected = $list.children('.selected');
							if ($selected.length == 0) {
								selectAutoComplete($list.children(':first-child'), -1);
							}
							else {
								var $next = $selected.next();
								if ($next.length == 0) {
									selectAutoComplete($list.children(':first-child'), -1);
								}
								else {
									selectAutoComplete($next, -1);
								}
							}
							break;

						// Enter
						case 13:
							e.preventDefault();
							getAutoComplete();

						//Tab
						case 9:
							$currentInput.removeClass('focus');
							if (_temp[prefix + 'change']) {
								getAutoComplete();
							}
							break;

						//Esc
						case 27:
							e.preventDefault();
							$currentInput.val(_temp[prefix + 'old']);
						default:
							break;
					}
				}
			});
		})

		function initAutoCompleteList() {
			var $items = $currentList.find('li');
			$items.on({
				mouseenter: function () {
					selectAutoComplete($(this));
				},
				click: function () {
					getAutoComplete($(this));
				},
			});
		}

		// type: 1 => prev, -1 => next
		function selectAutoComplete($item, type) {
			$item.siblings('.selected').removeClass('selected');
			$item.addClass('selected');

			if (type == 1 || type == -1) {
				var 
					itemTop = $item.offset().top,
					itemHeight = $item.height(),
					containerTop = $currentList.offset().top,
					containerHeight = $currentList.height();

				if (itemTop <= containerTop || itemTop + itemHeight >= containerTop + containerHeight) {
					$currentList.animate({
						scrollTop: $currentList.scrollTop() - containerTop + itemTop - (itemHeight * (2 + type)) - 2 - type
					});
				}
			}
		}

		function searchNoResult() {
			if ($currentInput.is('[data-free]')) {
				$currentList.empty().next().text(_t.form.add_new);
			}
			else {
				$currentList.empty().next().text(_t.form.keyword_for_search);	
			}
		}

		function closeAutoComplete() {
			var 
				$input = $currentInput;

			if ($input.is('[data-free]') && $input.val()) {
				$input.next().val('0').change();
				$input.removeClass('focus');	
			}
			else {
				$input.next().val('').change();
				$input.removeClass('focus').val('');	
				_temp[prefix + 'value'] = '';
			}

			_temp[prefix + 'change'] = false;
			clearTimeout(_temp[prefix + 'to']);
		}

		function getAutoComplete($item) {
			if (!$item) {
				$item = $currentList.find('.selected')
			}

			var 
				$selected = $item.children(),
				$input = $item.closest('.autocomplete-container').children(':first-child'),
				text = $selected.text() || '',
				value = $selected.data('value') || '';

			$input.next().val(value).change();
			$input.removeClass('focus').val(text).change();

			_temp[prefix + 'change'] = false;
			_temp[prefix + 'value'] = $input.val();
			clearTimeout(_temp[prefix + 'to']);
		}

		function create_auto_complete(data) {
			var 
				html = '', 
				length = data.length;

			for (var i = 0; i < length; i++) {
				html += '<li><span title="' + (data[i].description || '') + '" data-value="' + data[i].value + '">' + data[i].text + '</span></li>';
			}

			return html;
		}
	}

	/*
		/ Auto complete
	*/

	/*
		Price format
	*/

	function initSeparateNumber() {
		$form.find('.separate-number').on({
			focus: function () {
				_temp['price'] = this.value;
				_temp['is_changed'] = false;
			},
			keyup: function () {
				var input = this;
				var value = input.value;

				if (_temp['price'] == value) {
					return;
				}

				// Get current selection end
				var selectionEnd = value.length - input.selectionEnd;

				var value_ = value.split('.');
				value_[0] = moneyFormat(intFormat(value_[0]), ',');
				value = value_.join('.');

				this.value = value;
				selectionEnd = value.length - selectionEnd;
				input.setSelectionRange(selectionEnd, selectionEnd);

				_temp['price'] = value;
				_temp['is_changed'] = true;
			},
			focusout: function () {
				if (_temp['is_changed']) {
					$(this).change();
					_temp['is_changed'] = false;
				}
			},
			'paste change': function () {
				var input = this;
				var value = input.value;

				if (_temp['price'] == value) {
					return;
				}

				// Get current selection end
				var selectionEnd = value.length - input.selectionEnd;

				var value_ = value.split('.');
				value_[0] = moneyFormat(intFormat(value_[0]), ',');
				value = value_.join('.');
				
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
	//  $formGroups.filter(function () {
	//    var ok = false;

	//    $(this).find('[data-constraint~="required"]').each(function () {
	//      if (!this.value) {
	//        $(this).data('invalid', ok = true);
	//        return false;
	//      }
	//    });

	//    return ok;
	//  }).addClass('has-error');
	// }

	function initConstraint() {
		// initConstraintFormGroup($form.find('.form-group'));

		$form.find(':input:not([data-nonvalid])').on({
			'change': function () {
				checkInvalidInput($(this));
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
			change: function () {
				var $input = $(this);

				var 
					minValue = $input.data('minvalue'),
					maxValue = $input.data('maxvalue');

				value = $input.val().replace(/\D/g, '');
				if (minValue && value < minValue) {
					$(this).val(minValue).change();
				}

				if (maxValue && maxValue < value) {
					$(this).val(maxValue).change();
				}
			}
		});

		// $form.find('[data-constraint~="required"]').on({
		//  change: function () {
		//    if (!this.value) {
		//      $(this).data('invalid', true).closest('.form-group').addClass('has-error');
		//    }
		//  }
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

		if (typeof $input.data('validate') == 'function') {
			var result = $input.data('validate')();

			if (typeof result != 'undefined') {
				if (result.status) {
					var $validInput = result.input || $input;
					toggleValidInput($validInput, true, result.constraint || 'custom');
				}
				else {
					var $invalidInput = result.input || $input;
					toggleValidInput($invalidInput, false, result.constraint || 'custom');
					return;
				}	
			}
		}

		toggleValidInput($input, true);
	}

	/*
		Toggle valid input
	*/
	$form.toggleValidInput = function ($input, isValid, constraint, name) {
		toggleValidInput($input, isValid, constraint, name);
	};

	function removeSuccessLabel($input) {
		$input.closest('.form-group').removeClass('has-success').find('.success-label').remove();

		var 
			$box = $input.closest('.box');

		if ($box.data('status') == 'success') {
			$box.removeClass('box-success').data('status', 'normal').trigger('changeStatus');
		}
	}

	function toggleValidInput($input, isValid, constraint, name, isNotCheckSuccess) {
		var name = name || $input.attr('name');

		if (isValid) {
			// Set valid input
			$input.data('invalid', false);

			// Remove error class from form group if all input in valid
			var $formGroup = $input.closest('.form-group');
			// if ($formGroup.find('[data-constraint]').filter(function () { return $(this).data('invalid'); }).length == 0) {
			// 	$formGroup.removeClass('has-error');
			// }

			// Remove error message, remove error class from box

			var $box = $input.closest('.box');

			// Callout success
			if (isValid !== 1 && $formGroup.find('.success-label').length == 0) {
				$formGroup.addClass('has-success').append('<section class="success-label text-right"><i class="fa fa-check fa-lg"></i></section>');
			}	

			// Remove callout error
			$formGroup.removeClass('has-error').find('.callout-error').remove();

			currentStatus = $box.data('status');
			if (currentStatus == 'error' && $box.find('.callout-error').length == 0) {
				$box.removeClass('box-danger');
				$box.data('status', 'normal');
			}
			if (currentStatus != 'success' && $box.find('.form-group:not(.has-success):visible').length == 0) {
				$box.addClass('box-success');
				$box.data('status', 'success');
			}
			if (currentStatus != $box.data('status')) {
				$box.trigger('changeStatus');
			}

			// 	$callout = $formGroup.find('.callout-error');

			// // Remove error message
			// $callout.find('[aria-name="' + name + '"]').remove();

			// // Check if not exist error => remove error class
			// if ($callout.children().length == 0) {
			// 	$callout.remove();
			// }
		}
		else {
			// Check if input was invalid with this constraint => return
			if ($input.data('invalid') == constraint) {
				return;
			}

			// Set invalid input with constraint
			$input.data('invalid', constraint);

			// Add error class to form group
			var $formGroup = $input.closest('.form-group');
			$formGroup.removeClass('has-success').addClass('has-error');

			// Add error class to box
			var 
				$box = $formGroup.closest('.box');

			if ($box.data('status') != 'error') {
				$box.addClass('box-danger').removeClass('box-success').data('status', 'error').trigger('changeStatus');	
			}

			// Add error message
			// Get callout
			var $callout = $formGroup.find('.callout-error');
			if ($callout.length == 0) {
				$callout = $('<section class="callout-error"></section>');
				$formGroup.append($callout);
			}

			$callout.text(_t[params.object]['validate'][name + '_' + constraint]);

			// Remove success label
			$formGroup.find('.success-label').remove();

			// Get error message
			// var $errorMessage = $callout.find('[aria-name="' + name + '"]');
			// if ($errorMessage.length == 0) {
			// 	$errorMessage = $('<p class="no-margin" aria-name="' + name + '"></p>');
			// 	$callout.append($errorMessage);
			// }
			// $errorMessage.text(_t[params.object]['validate'][name + '_' + constraint]);
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
		Helper
	*/

	function initHelper() {
		if ($window.isWidthType(['xs'])) {
			$form.find('.helper-label').popover({
				placement: 'left',
				template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
				html: true,
				trigger: 'focus'
			});
		}
		else {
			var 
				$content = $form.find('.helper-container .helper-content'),
				fixedTop = $form.offset().top + 20;
			var $labels = $form.find('.helper-label');

			$labels.on('click mouseenter', function () {
				showHelper($(this));
			});

			$labels.closest('.form-group').find(':input').on({
				focus: function () {
					showHelper($(this).closest('.form-group').find('.helper-label'));
				}
			});

			function showHelper($label) {
				if ($label.is($content.data('current'))) {
					return;
				}

				$content.data('current', $label);
				$content.html($label.data('content'));
				$content.css('top', $label.offset().top - fixedTop);
				$content.addClass('show');
				setTimeout(function () {
					$content.removeClass('show');
				}, 400)	
			}	
		}
	}

	/*
		/ Helper
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
