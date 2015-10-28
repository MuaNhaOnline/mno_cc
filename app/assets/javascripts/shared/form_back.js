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

	$form.find('[data-toggle="popover"]').popover({
		html: true
	});

	initToggle();
	initFileInput();
	initFileInput_2();
	initAutoComplete();
	initEditor();
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
			$form.find('.input-toggle:enabled').each(function () {
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
		var $fileUploads = $form.find('.file-upload');

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
				ratio = $fileUpload.data('ratio'),
				hasDescription = $fileUpload.is('[data-has_description]'),
				hasAvatar = $fileUpload.is('[data-has_avatar]');

			if (types) {
				types = types.split(' ');
			}

			var isMulti = $fileUpload.is('[multiple]');

			// Get params

			var controls = null, onItemRemove = null, onItemAdd = null;

			if ('imageInputs' in params && $fileUpload.attr('aria-name') in params['imageInputs']) {
				if ('controls' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					controls = params['imageInputs'][$fileUpload.attr('aria-name')]['controls'];					
				}
				if ('onItemRemove' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					onItemRemove = params['imageInputs'][$fileUpload.attr('aria-name')]['onItemRemove'];
				}
				if ('onItemAdd' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					onItemAdd = params['imageInputs'][$fileUpload.attr('aria-name')]['onItemAdd'];
				}
			}

			// Get wrapper
			var $wrapper = $fileUpload.parent();

			// Check amount
			currentAmount = $wrapper.find('.preview').count;

			/* 
				Init for read file
			*/

			var $html = $('<article class="box box-solid no-margin"><section class="box-header padding-bottom-0"><h3 class="box-title">' + _t.form.crop_title + '</h3></section><section class="box-body cropper-container no-padding"><section class="image-cropper"></section></section>' + (hasDescription ? '<section class="box-body"><input class="form-control" aria-name="description" placeholder="Mô tả" /></section>' : '') + '<section class="box-footer no-padding"><section class="button-group clearfix"><button aria-click="close" title="' + _t.form.delete_tooltip + '" class="btn btn-link pull-left no-underline"><span class="fa fa-close"></span> ' + _t.form.delete + '</button><button aria-click="crop" title="' + _t.form.crop_tooltip + '" class="btn btn-link pull-right no-underline"><span class="fa fa-crop"></span> ' + _t.form.crop + '</button>' + (ratio ? '' : '<button aria-click="uncrop" title="' + _t.form.uncrop_tooltip + '" class="btn btn-link pull-right no-underline"><span class="fa fa-check"></span> ' + _t.form.uncrop + '</button>') + '</section></article></section></article>'),
				fileReader = new FileReader(),
				currentIndex = 0;

			fileReader.onload = function (e, i) {

				/*
					Crop
				*/

				var
					orginalImageData = e.target.result,
					$img = $('<img src="' + orginalImageData + '" />');

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

				$html.find('[aria-click="crop"],[aria-click="uncrop"]').on('click', function () {
					var description = hasDescription ? $popup.find('[aria-name="description"]').val() : '';

					currentAmount++;
					$popup.off();
					readNext();

					var imageData = $(this).is('[aria-click="crop"]') ? $img.cropper('getCroppedCanvas').toDataURL() : orginalImageData;

					var $item = $('<article class="preview" data-uploading></article>');
					$item.html($fileUpload.data('input') + '<section class="image"><img src="' + imageData + '" /></section><section class="control">' + (hasAvatar ? '<button class="btn btn-flat btn-primary btn-block font-bold" aria-click="avatar">Làm ảnh đại diện</button>' : '')  + (hasDescription ? '<button class="btn btn-flat btn-primary btn-block font-bold" aria-click="description">Mô tả</button>' : '') + '<button class="btn btn-flat btn-danger btn-block font-bold" aria-click="remove">Xóa</button></section><section class="progress no-margin"><article class="progress-bar" role="progressbar" style="width: 0%;"></article></section>');

					$item.data('control_show', null);

					$form.submitStatus(true);

					// Create control from param
					if (controls) {
						var 
							$controls = $item.find('.control');

						$(controls).each(function () {
							var controlParams = this;
							var $control = $('<button ' + controlParams['attribute'] + ' class="btn btn-flat btn-' + (controlParams['type'] || 'default') + ' btn-block font-bold">' + (controlParams['text'] || 'Xử lý') + '</button>');

							if ('handle' in controlParams) {
								$control.on('click', function (e) {
									controlParams['handle']($item);
								});
							}

							$controls.prepend($control);
						});		
					}

					// Event click to control
					$item.on('click', function (e) {
						e.preventDefault();
						if ($item.hasClass('control-show')) {
							clearTimeout($item.data('control_show'));
							$item.removeClass('control-show');
						}
						else {
							$item.addClass('control-show');
							clearTimeout($item.data('control_show'));
							$item.data('control_show', setTimeout(function () {
								$item.removeClass('control-show');
							}, 5000));	
						}
					});

					$item.find('.btn').on('click', function (e) {
						e.preventDefault();
					});

					$item.find('[aria-click="description"]').on('click', function () {
						var 
							$html = $('<article aria-popupcontent="image_description" style="width: 400px; max-width: 80vw" class="box box-solid box-default"><form class="form box-body"><section class="margin-bottom-15" style="display:flex;display:-webkit-flex;display:-ms-flex;justify-content: center;-webkit-justify-content: center;"><img aria-name="preview_image" style="max-width: 100%; max-height: 250px"></section><article class="form-group"><input class="form-control" name="description" placeholder="Mô tả" data-nonvalid /></article><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">Hoàn tất</button> <button type="button" class="btn btn-default btn-flat">Hủy</button></article></form></article>'),
              $descriptionForm = $html.find('form');

            var $popup = popupFull({
              html: $html
            });

            // Adjust values
            $descriptionForm.find('[aria-name="preview_image"]').attr('src', $item.find('img').attr('src'));
            $descriptionForm[0].elements['description'].value = $item.data('value')['description'] || '';

            initForm($descriptionForm, {
              submit: function () {
                $popup.off();

                var value = $item.data('value');
                value['description'] = $descriptionForm[0].elements['description'].value;
                $item.data('value', value);
                $item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));
              }
            });

            $descriptionForm.find('[type="button"]').on('click', function () {
              $popup.off();
            });
					});

					$item.find('[aria-click="avatar"]').on('click', function () {
						if ($item.is('[data-avatar]')) {
              var value = $item.data('value');
              value['is_avatar'] = false
              $item.data('value', value);
              $item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));

              $item.removeClass('bg-light-blue').removeAttr('data-avatar').find('[aria-name="avatar-button"]').text('Làm ảnh đại diện');
            }
            else {
              var value = $item.data('value');
              value['is_avatar'] = true
              $item.data('value', value);
              $item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));

              $item.siblings('[data-avatar]').removeClass('bg-light-blue').removeAttr('data-avatar').each(function () {
                var $item2 = $(this)
                var value2 = $item2.data('value');
                value2['is_avatar'] = false
                $item2.data('value', value2);
                $item2.find('[aria-name="hidden_input"]').val(JSON.stringify(value2));
              }).find('[aria-name="avatar-button"]').text('Làm ảnh đại diện');

              $item.addClass('bg-light-blue').attr('data-avatar', '').find('[aria-name="avatar-button"]').text('Hủy ảnh đại diện');
            }
					});

					$item.find('[aria-click="remove"]').on('click', function () {
						if ($item.is('[data-uploading]') && $form.find('[data-uploading]').length == 1) {
							$form.submitStatus(false);
						}

						if (onItemRemove) {
							onItemRemove($item);
						}

						$item.remove();
					});

					if (!isMulti) {
						$wrapper.children('.preview').remove();
					}

					$wrapper.append($item);

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
							url: '/temporary_files/upload',
							method: 'POST',
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
					}).always(function () {
						$item.removeAttr('data-uploading');
						if ($form.find('[data-uploading]').length == 0) {
							$form.submitStatus(false);
						}
					}).done(function(data) {
						if (data.status == 0) {
							var value = {
								'id': data.result,
								'is_new': true,
								'description': description
							}

							$item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));
							// Display
							$item.data('value', value);
							$item.find('img').css('opacity', '1');
							$progressBar.parent().remove();

							if (onItemAdd) {
								onItemAdd($item);
							}
						}
						else {
							$progressBar.parent().remove();
						}
					}).fail(function() {
						$progressBar.parent().remove();
					});
				});

				/*
					/ Set button event
				*/

				/*
					/ Crop
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

		// Create element

		$fileUploads.each(function () {
			var 
				$fileUpload = $(this),
				hasDescription = $fileUpload.is('[data-has_description]'),
				hasAvatar = $fileUpload.is('[data-has_avatar]'),
				controls = null, onItemRemove = null, onItemAdd = null, onInitItemAdd = null;

			// Get params

			if ('imageInputs' in params && $fileUpload.attr('aria-name') in params['imageInputs']) {
				if ('controls' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					controls = params['imageInputs'][$fileUpload.attr('aria-name')]['controls'];					
				}
				if ('onItemRemove' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					onItemRemove = params['imageInputs'][$fileUpload.attr('aria-name')]['onItemRemove'];
				}
				if ('onInitItemAdd' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					onInitItemAdd = params['imageInputs'][$fileUpload.attr('aria-name')]['onInitItemAdd'];
				}
				if ('onItemAdd' in params['imageInputs'][$fileUpload.attr('aria-name')]) {
					onItemAdd = params['imageInputs'][$fileUpload.attr('aria-name')]['onItemAdd'];
				}
			}

			// Create html

			var $wrapper = $('<label class="file-uploader form-control"></label>');
			var $label = $('<div class="file-upload-label"><div class="fa fa-photo"></div><div>' + _t.form.label_image_upload + '</div></div>');

			$fileUpload.after($wrapper);
			$fileUpload.appendTo($wrapper);
			$label.appendTo($wrapper);

			var constraint = $fileUpload.attr('data-constraint');
			constraint = constraint ? 'data-constraint="' + constraint + '"' : '';			

      var 
      	fuName = name = $fileUpload.attr('name');

      if (name[name.length - 1] == ']') {
      	fuName = fuName.substr(0, fuName.length - 1) + '_fu]';
      }
      else {
      	fuName = name + '_fu'
      }

			$fileUpload.data('input', '<input type="hidden" aria-name="hidden_input" data-nonvalid name="' + name + '" />');
			$fileUpload.attr('name', fuName);

			// Init value

			var initValues = $fileUpload.data('init-value');
			if (initValues) {
				$(initValues).each(function () {
					value = this;
					value['is_new'] = false;

					// Create item
					var $item = $('<article class="preview"></article>');
					$item.data('value', value);
					$item.data('control_show', null);

					$item.html($fileUpload.data('input') + '<section class="image"><img src="' + value['url'] + '" /></section><section class="control">' + (hasAvatar ? '<button class="btn btn-flat btn-primary btn-block font-bold" aria-click="avatar">Làm ảnh đại diện</button>' : '') + (hasDescription ? '<button class="btn btn-flat btn-primary btn-block font-bold" aria-click="description">Mô tả</button>' : '') + '<button class="btn btn-flat btn-danger btn-block font-bold" aria-click="remove">Xóa</button></section>');
					$item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));

					// Avatar
					if (value['is_avatar']) {
						$item.addClass('bg-light-blue').attr('data-avatar', '').find('[aria-name="avatar-button"]').text('Hủy ảnh đại diện');
					}

					// Create control from param
					if (controls) {
						var 
							$controls = $item.find('.control');

						$(controls).each(function () {
							var controlParams = this;
							var $control = $('<button ' + controlParams['attribute'] + ' class="btn btn-flat btn-' + (controlParams['type'] || 'default') + ' btn-block font-bold">' + (controlParams['text'] || 'Xử lý') + '</button>');

							if ('handle' in controlParams) {
								$control.on('click', function (e) {
									controlParams['handle']($item);
								});
							}

							$controls.prepend($control);
						});		
					}

					// Event click to control
					$item.on('click', function (e) {
						e.preventDefault();
						if ($item.hasClass('control-show')) {
							clearTimeout($item.data('control_show'));
							$item.removeClass('control-show');
						}
						else {
							$item.addClass('control-show');
							clearTimeout($item.data('control_show'));
							$item.data('control_show', setTimeout(function () {
								$item.removeClass('control-show');
							}, 5000));	
						}
					});

					$item.find('.btn').on('click', function (e) {
						e.preventDefault();
					});

					$item.find('[aria-click="description"]').on('click', function () {
						var 
							$html = $('<article aria-popupcontent="image_description" style="width: 400px; max-width: 80vw" class="box box-solid box-default"><form class="form box-body"><section class="margin-bottom-15" style="display:flex;display:-webkit-flex;display:-ms-flex;justify-content: center;-webkit-justify-content: center;"><img aria-name="preview_image" style="max-width: 100%; max-height: 250px"></section><article class="form-group"><input class="form-control" name="description" placeholder="Mô tả" data-nonvalid /></article><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">Hoàn tất</button> <button type="button" class="btn btn-default btn-flat">Hủy</button></article></form></article>'),
              $descriptionForm = $html.find('form');

            var $popup = popupFull({
              html: $html
            });

            // Adjust values
            $descriptionForm.find('[aria-name="preview_image"]').attr('src', $item.find('img').attr('src'));
            $descriptionForm[0].elements['description'].value = $item.data('value')['description'] || '';

            initForm($descriptionForm, {
              submit: function () {
                $popup.off();

                var value = $item.data('value');
                value['description'] = $descriptionForm[0].elements['description'].value;
                $item.data('value', value);
                $item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));
              }
            });

            $descriptionForm.find('[type="button"]').on('click', function () {
              $popup.off();
            });
					});

					$item.find('[aria-click="avatar"]').on('click', function () {
						if ($item.is('[data-avatar]')) {
              var value = $item.data('value');
              value['is_avatar'] = false
              $item.data('value', value);
              $item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));

              $item.removeClass('bg-light-blue').removeAttr('data-avatar').find('[aria-name="avatar-button"]').text('Làm ảnh đại diện');
            }
            else {
              var value = $item.data('value');
              value['is_avatar'] = true
              $item.data('value', value);
              $item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));

              $item.siblings('[data-avatar]').removeClass('bg-light-blue').removeAttr('data-avatar').each(function () {
                var $item2 = $(this)
                var value2 = $item2.data('value');
                value2['is_avatar'] = false
                $item2.data('value', value2);
                $item2.find('[aria-name="hidden_input"]').val(JSON.stringify(value2));
              }).find('[aria-name="avatar-button"]').text('Làm ảnh đại diện');

              $item.addClass('bg-light-blue').attr('data-avatar', '').find('[aria-name="avatar-button"]').text('Hủy ảnh đại diện');
            }
					});

					$item.find('[aria-click="remove"]').on('click', function () {
						if (onItemRemove) {
							onItemRemove($item);
						}

						$item.remove();
					});

					$wrapper.append($item);
					if (onInitItemAdd) {
						onInitItemAdd($item);
					}
					if (onItemAdd) {
						onItemAdd($item);
					}
				});
			}
		});
	}

	function initFileInput_2() {
		$form.find('.file-upload-2').each(function () {
			var 
				$fileUpload = $(this),
				$wrapper = $('<button type="button" data-nonvalid class="btn btn-default btn-file"></button>'),
				size = $fileUpload.data('size');

			$fileUpload.after($wrapper);
			$fileUpload.appendTo($wrapper);
			$wrapper.append($fileUpload.data('label'));
			$wrapper.after('<button type="button" data-nonvalid style="display: none; position: relative;" class="btn btn-default margin-left-5">&times;<div class="progress progress-xxs progress-inside"><div class="progress-bar progress-bar-primary" role="progressbar"></div></div></button><span class="margin-left-5"></span>');

			var constraint = $fileUpload.attr('data-constraint');
			constraint = constraint ? 'data-constraint="' + constraint + '"' : '';

			$wrapper.append('<input type="hidden" ' + constraint + ' name="' + $fileUpload.attr('name') + '" />');

			$fileUpload.removeAttr('name data-constraint').attr('data-nonvalid', '');

			$wrapper.next().on('click', function () {
				$wrapper.find('[type="hidden"]').val('').change();
        $wrapper.show().next().hide().next().text('');
			});

			if ($fileUpload.data('value')) {
				value = $fileUpload.data('value');
				value['is_new'] = false;
				$wrapper.find('[type="hidden"]').val(JSON.stringify(value));
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

				$fileUpload.attr('data-uploading', '');
				// Upload file
				$.ajax({
						url: '/temporary_files/upload',
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
				}).always(function () {
					$fileUpload.removeAttr('data-uploading');
					if ($form.find('[data-uploading]').length == 0) {
						$form.submitStatus(false);
					}
				}).done(function(data) {
					if (data.status == 0) {
						var value = {
							'id': data.result,
							'is_new': true
						}

						// Display
						$wrapper.hide();
						$progressBar.css('width', '0%');

						$wrapper.children('[type="hidden"]').val(JSON.stringify(value));
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
		Editor
	*/

	function initEditor() {
		$form.find('[aria-input-type="editor"]').each(function () {
			CKEDITOR.replace(this.id);

			var $input = $(this);
			
			CKEDITOR.on('instanceReady', function() { $input.siblings('.cke').addClass('form-control'); }); 

			var ckeditor = CKEDITOR.instances[this.id];

			ckeditor.on('blur', function () {
				$input.val(ckeditor.getData()).change();
			});
		});
	}

	/*
		Editor
	*/

	/*
		Price format
	*/

	function initSeparateNumber() {
		_temp['separate_number_to'] = null;
		$form.find('.separate-number').on({
			focus: function () {
				_temp['price'] = this.value;
				_temp['is_changed'] = false;
			},
			keyup: function () {
				clearTimeout(_temp['separate_number_to']);
				var input = this;
				_temp['separate_number_to'] = setTimeout(function () {
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
					_temp['is_changed'] = true;
				}, 200);
			},
			focusout: function () {
				_temp['is_changed'] = false;
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
			},
			'init': function () {
				var input = this;
				var value = input.value;

				// Get current selection end
				var selectionEnd = value.length - input.selectionEnd;

				var value_ = value.split('.');
				value_[0] = moneyFormat(intFormat(value_[0]), ',');
				value = value_.join('.');
				
				input.value = value;
				selectionEnd = value.length - selectionEnd;
				input.setSelectionRange(selectionEnd, selectionEnd);
			}
		}).trigger('init');
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

		// Radio, checkbox
		$form.find('[type="radio"][data-constraint~=required],[type="checkbox"][data-constraint~=required]').each(function () {
			var $input = $(this);

			$form.find('[name="' + $input.attr('name') + '"]').not($input).attr('data-nonvalid', '').on('change', function () {
				$input.change();
			});
		});

		// Auto check valid
		$form.find(':input:not(.file-upload):not([data-nonvalid])').on({
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

					if (floatPoint == -1) {
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
			'change': function () {
				var $input = $(this);
				if ($input.val() && !/^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i.test($input.val())) {
					toggleValidInput($input, false, 'invalid');
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

				var value = $input.val(), floatPoint = value.indexOf('.');

				if (floatPoint == -1) {
					value = value.replace(/\D/g, '');
				}
				else {
					value = value.slice(0, floatPoint).replace(/\D/g, '') + '.' + value.slice(floatPoint).replace(/\D/g, '');
				}

				if (minValue && value < minValue) {
					$input.val(minValue).change();
				}

				if (maxValue && maxValue < value) {
					$input.val(maxValue).change();
				}
			}
		});
	};

	//Check input
	function checkInvalidInput($input) {
		if ($input.is('[data-constraint~="required"]')) {
			if ($input.is('[type="radio"],[type="checkbox"]')) {
				if ($form.find('[name="' + $input.attr('name') + '"]:checked').length == 0) {
					toggleValidInput($input, false, 'required');
					return 'required';
				}
			}
			else if ($input.is('.file-upload')) {
				if ($input.siblings('.preview').length == 0) {
					toggleValidInput($input, false, 'required');
					return 'required';
				}
			}
			else {
				if (!$input.val()) {
					toggleValidInput($input, false, 'required');
					return 'required';
				}	
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
		$form.submitStatus = function (submitting) {
			$form.data('submitting', submitting);
			$form.find('[type="submit"],[data-type="submit"]').prop('disabled', submitting);
		}

		$form.submitStatus(false);

		$form.on('submit', function (e) {
			e.preventDefault();

			if ($form.data('submitting')) {
				return;
			}

			if (params['submit_status']) {
				$form.submitStatus(true);	
			}

			// Check validate
			$form.find(':input:enabled:not([data-nonvalid])').each(function () {
				checkInvalidInput($(this));  
			});

			var $dangerBox = $form.find('.box-danger:visible');
			if ($dangerBox.length) {
				$body.animate({
					scrollTop: $dangerBox.offset().top - 20 
				}); 
			
				$form.submitStatus(false);
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

function separateToInt(value) {
	var floatPoint = value.indexOf('.');

	if (floatPoint == -1) {
		return parseInt(value.replace(/\D/g, ''));
	}
	else {
		return parseInt(value.slice(0, floatPoint).replace(/\D/g, ''));
	}
}

function separateToFloat(value) {
	var floatPoint = value.indexOf('.');

	if (floatPoint == -1) {
		return parseFloat(value.replace(/\D/g, ''));
	}
	else {
		return parseFloat(value.slice(0, floatPoint).replace(/\D/g, '') + '.' + value.slice(floatPoint).replace(/\D/g, ''));
	}
}