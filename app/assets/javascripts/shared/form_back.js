var iconList = {
	fa: [
		'fa-shopping-basket',
		'fa-shopping-bag',
		'fa-automobile',
		'fa-balance-scale',
		'fa-bank',
		'fa-beer',
		'fa-bed',
		'fa-bell',
		'fa-bell-slash',
		'fa-bicycle',
		'fa-birthday-cake',
		'fa-book',
		'fa-building',
		'fa-bullhorn',
		'fa-bus',
		'fa-cab',
		'fa-calendar',
		'fa-camera-retro',
		'fa-child',
		'fa-clock-o',
		'fa-coffee',
		'fa-comments-o',
		'fa-compass',
		'fa-credit-card-alt',
		'fa-cutlery',
		'fa-desktop',
		'fa-eye',
		'fa-eye-slash',
		'fa-female',
		'fa-fire-extinguisher',
		'fa-film',
		'fa-futbol-o',
		'fa-gamepad',
		'fa-globe',
		'fa-gift',
		'fa-graduation-cap',
		'fa-group',
		'fa-home',
		'fa-key',
		'fa-leaf',
		'fa-lightbulb-o',
		'fa-lock',
		'fa-male',
		'fa-map-marker',
		'fa-map-o',
		'fa-money',
		'fa-motorcycle',
		'fa-music',
		'fa-newspaper-o',
		'fa-paint-brush',
		'fa-paper-plane-o',
		'fa-paw',
		'fa-phone',
		'fa-pie-chart',
		'fa-plane',
		'fa-plug',
		'fa-plus',
		'fa-puzzle-piece',
		'fa-question',
		'fa-recycle',
		'fa-road',
		'fa-share-alt',
		'fa-signal',
		'fa-star',
		'fa-street-view',
		'fa-taxi',
		'fa-thumbs-o-up',
		'fa-tint',
		'fa-tree',
		'fa-trophy',
		'fa-truck',
		'fa-umbrella',
		'fa-wifi',
		'fa-wheelchair',
		'fa-wrench',
		'fa-ambulance',
		'fa-bicycle',
		'fa-subway',
		'fa-train'
	]
}
/*
	object:
		object form (for validate)
	submit:
		function will be implement after submit
*/
function initForm($form, params) {
	var checkingList = {};

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
	initAutoComplete();
	initEditor();
	initColor();
	initIcon();
	initDropdownselect();
	initSeparateNumber();
	initReadMoney();
	initTabContainer();
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
	
	$form.data('reset_value', function ($container) {
		$container = $container || $form;

		$container.find(':input:not([type="checkbox"]):not([type="radio"])').val('').data('invalid', false);
		$container.find('.form-group').removeClass('has-success has-error').find('.callout-error').remove();
		$container.find('.money-text').text('');
		// Icon input
		$icon = $container.find('[aria-input-type="icon"]');
		$icon.val('');
		$icon.next().find('.text').show();
		$icon.next().find('.icon').remove();
	})

	/*
		params: 
			key,
			message
	*/
	$form.data('add_checking_list', function (params) {
		checkingList[params['key']] = params['message'];
	});
	$form.data('remove_checking_list', function (key) {
		delete checkingList[key]
	});

	// Toggle

		function initToggle() {
			$form.find('.input-toggle').on('change retoggle', function () {
				toggle($(this));
			}).each(function () {
				$input = $(this);
				if ($input.is('input[type="radio"]:not(:checked)')) {
					return;
				}
				toggle($(this));  
			});
			
			$form.data('toggle_inputs', function ($container) {
				if (typeof $container == 'undefined') {
					$container = $form;
				}
				$container.find('.input-toggle:enabled').each(function () {
					toggle($(this));
				});
			});

			function toggle($input) {
				if ($input.data('toggling')) {
					return;
				}
				$input.data('toggling', true);
				
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
				else {
					onElements = $input.attr('data-on');
					offElements = $input.attr('data-off');
				}

				var $context = $input.closest('.tab-content', $form[0]);
				if ($context.length == 0) {
					$context = $form;
				}

				// Turn on elements
				if (onElements && !$input.is(':disabled')) {
					// Create elements list
					var onElementsList = '';
					$(onElements.split(' ')).each(function () {
						onElementsList += ',[data-toggled-element~="' + this + '"]';
					});

					// Turn on all elements & process their child
					$context.find(onElementsList.substr(1)).each(function () {
						var $element = $(this);

						// Turn on element
						toggleElement($element, true);

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
					$context.find(offElementsList.substr(1)).each(function () {
						var $element = $(this);

						// Turn off element
						toggleElement($element, false);

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
				$input.data('toggling', false);
			}

			function toggleElement($element, on) {
				if (!$element.is(':input')) {
					if (on) {
						$element.removeClass('off');

						$element.find(':input:disabled').prop('disabled', false).trigger('enable');
					}
					else {
						$element.addClass('off');

						$element.find(':input:enabled').prop('disabled', true).trigger('disable').each(function () {
							var $input = $(this);

							removeSuccessLabel($input);
							// toggleValidInput($input, 1);
						});
					}
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
						// toggleValidInput($element, 1);   
					}
				}
			}
		}

	// / Toggle

	// File input
		/*
			params:
				fileUpload:
					types
					size
					amount
					ratio
					has_order
					has_avatar
		*/
		function initFileInput($fileUploads) {
			//Get element
			var $fileUploads = $fileUploads || $form.find('.file-upload');

			// Progress on choose new file

				$fileUploads.on('change', function () {
					if (this.files.length == 0) { 
						return; 
					}

					readFiles($(this), this.files);
				});

				function readFiles($fileUpload, files) {

					// Get fileupload
					var $wrapper = $fileUpload.parent(),
						$alert = $wrapper.find('.alert-text').hide(),
						amount = $fileUpload.data('amount') || false,
						size = $fileUpload.data('size') || false,
						ratio = $fileUpload.data('ratio') || false,
						dimension = $fileUpload.data('dimension') || false,
						types,
						hasDescription = $fileUpload.is('[data-has_description]'),
						hasOrder = $fileUpload.is('[data-has_order]'),
						hasAvatar = $fileUpload.is('[data-has_avatar]'),
						isMulti = $fileUpload.is('[multiple]');

					// Type
					types = $fileUpload.data('types');
					if (types == 'image') {
						types = ['jpg','jpeg','png','gif','bmp'];
					}
					else if (typeof types != 'undefined') {
						types = types.split(',');
					}
					else {
						types = false;
					}

					// Dimension 
					if (dimension) {
						dimension = dimension.split('x');
						dimension = { width: dimension[0], height: dimension[1] };
					}

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
					var $previewList = $wrapper.find('.preview-list');

					// Check amount
					currentAmount = $previewList.children('.preview').length;

					// Init for read file

					var $html = $('<article class="box box-solid no-margin"><section class="box-header padding-bottom-0"><h3 class="box-title">' + _t.form.crop_title + '</h3></section><section class="box-body cropper-container no-padding"><section class="image-cropper"></section></section>' + (hasDescription ? '<section class="box-body"><input class="form-control" aria-name="description" placeholder="Mô tả" /></section>' : '') + '<section class="box-footer no-padding"><section class="button-group clearfix"><button aria-click="close" title="' + _t.form.delete_tooltip + '" class="btn btn-link pull-left no-underline"><span class="fa fa-close"></span> ' + _t.form.delete + '</button><button aria-click="crop" title="' + _t.form.crop_tooltip + '" class="btn btn-link pull-right no-underline"><span class="fa fa-crop"></span> ' + _t.form.crop + '</button>' + (ratio ? '' : '<button aria-click="uncrop" title="' + _t.form.uncrop_tooltip + '" class="btn btn-link pull-right no-underline"><span class="fa fa-check"></span> ' + _t.form.uncrop + '</button>') + '</section></article></section></article>'),
						fileReader = new FileReader(),
						currentIndex = 0;

					fileReader.onload = function (e) {

						read = function () {
							if (!dimension && $.inArray(e.target.fileName.split('.').pop().toLowerCase(), ['jpg','jpeg','png','gif','bmp']) != -1) {

								// Crop

								console.log(e.target.result);
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

								// Set button event

								$html.find('[aria-click="close"]').on('click', function () {
									$popup.off();
									readNext();
								});

								$html.find('[aria-click="crop"],[aria-click="uncrop"]').on('click', function () {
									$wrapper.addClass('has');

									var description = hasDescription ? $popup.find('[aria-name="description"]').val() : '';

									currentAmount++;
									$popup.off();
									readNext();

									var imageData = $(this).is('[aria-click="crop"]') ? $img.cropper('getCroppedCanvas').toDataURL() : orginalImageData;

									var $item = $('<article class="preview" data-uploading></article>');
									$item.html($fileUpload.data('input') + '<section class="image"><img style="' + (dimension ? ('height: ' + dimension.height + 'px;') : '') + '" src="' + imageData + '" /></section><section class="control">' + (hasAvatar ? '<button type="button" class="btn btn-flat btn-primary btn-block font-bold" aria-click="avatar">Làm ảnh đại diện</button>' : '')  + (hasDescription ? '<button type="button" class="btn btn-flat btn-primary btn-block font-bold" aria-click="description">Mô tả</button>' : '') + '<button type="button" class="btn btn-flat btn-danger btn-block font-bold" aria-click="remove">Xóa</button></section><section class="progress no-margin"><article class="progress-bar" role="progressbar" style="width: 0%;"></article></section>');

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
									$item.on('click contextmenu', function (e) {
										e.preventDefault();

										if (ordering) {
											return;
										}

										if ($item.hasClass('control-show')) {
											clearTimeout($item.data('control_show'));
											$item.removeClass('control-show');
											$document.off('click.preview_image_control_show');
										}
										else {
											$item.addClass('control-show');
											clearTimeout($item.data('control_show'));
											
											setTimeout(function () {
												$document.on('click.preview_image_control_show', function () {
													clearTimeout($item.data('control_show'));
													$item.removeClass('control-show');
													$document.off('click.preview_image_control_show');
												});
											});
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
											html: $html,
											id: 'input_description_popup'
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
										$wrapper.removeClass('full');

										if ($previewList.children('.preview').length == 0) {
											$wrapper.removeClass('has')
										}
									});

									if (isMulti) {
										$previewList.children().last().before($item);
									}
									else {
										$previewList.html($item);
									}

									// Get data
									var data = new FormData();
									data.append('file', dataURLToBlob(imageData, fileReader.fileType));
									data.append('file_name', fileReader.fileName);

									// Preparing upload
									var $progressBar = $item.find('.progress-bar');
									$item.attr('data-status', 'uploading');
									$item.find('img').css('opacity', '.5');

									var order = currentAmount;
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

											if (hasOrder) {
												value['order'] = order;
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

								// / Set button event

								// / Crop
							}
							else {
								$wrapper.addClass('has');

								var orginalFileData = e.target.result;

								currentAmount++;
								readNext();

								var $item = $('<article class="preview" title="' + e.target.fileName + '" data-uploading></article>');
								if ($.inArray(e.target.fileName.split('.').pop().toLowerCase(), ['jpg','jpeg','png','gif','bmp']) != -1) {
									src = orginalFileData;
								}
								else {
									src = '/assets/file_extensions/' + e.target.fileName.split('.').pop() + '.png'
								}
								$item.html($fileUpload.data('input') + '<section class="image"><img style="' + (dimension ? ('height: ' + dimension.height + 'px;') : '') + '" src="' + src + '" onError="this.src=\'/assets/file_extensions/file.png\'" /></section><section class="control">' + (hasDescription ? '<button type="button" class="btn btn-flat btn-primary btn-block font-bold" aria-click="description">Mô tả</button>' : '') + '<button type="button" class="btn btn-flat btn-danger btn-block font-bold" aria-click="remove">Xóa</button></section><section class="progress no-margin"><article class="progress-bar" role="progressbar" style="width: 0%;"></article></section>');

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

									if (ordering) {
										return;
									}

									if ($item.hasClass('control-show')) {
										clearTimeout($item.data('control_show'));
										$item.removeClass('control-show');
										$document.off('click.preview_image_control_show');
									}
									else {
										$item.addClass('control-show');
										clearTimeout($item.data('control_show'));
										
										setTimeout(function () {
											$document.on('click.preview_image_control_show', function () {
												clearTimeout($item.data('control_show'));
												$item.removeClass('control-show');
												$document.off('click.preview_image_control_show');
											});
										});
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
										html: $html,
										id: 'input_description_popup'
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

								$item.find('[aria-click="remove"]').on('click', function () {
									if ($item.is('[data-uploading]') && $form.find('[data-uploading]').length == 1) {
										$form.submitStatus(false);
									}

									if (onItemRemove) {
										onItemRemove($item);
									}

									$item.remove();
									$wrapper.removeClass('full');

									if ($previewList.children('.preview').length == 0) {
										$wrapper.removeClass('has')
									}
								});

								if (isMulti) {
									$previewList.children().last().before($item);
								}
								else {
									$previewList.html($item);
								}


								// Get data
								var data = new FormData();
								data.append('file', dataURLToBlob(orginalFileData, fileReader.fileType));
								data.append('file_name', fileReader.fileName);

								// Preparing upload
								var $progressBar = $item.find('.progress-bar');
								$item.attr('data-status', 'uploading');
								$item.find('img').css('opacity', '.5');

								var order = currentAmount;
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
											'is_new': true
										}

										if (hasOrder) {
											value['order'] = order;
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
							}
						}

						if (dimension) {
							image = new Image();
							image.onload = function () {
								if (image.width == dimension.width && image.height == dimension.height) {
									read();
								}
								else {
									$alert.text('Kích thước yêu cầu: ' + dimension.width + 'x' + dimension.height).show();
									return;
									readNext();
								}
							}
							image.src = e.target.result;
						}
						else {
							read();
						}

					}

					// / Init for read file

					// Read files

					function readNext() {
						// Check index & amount
						if (amount && currentAmount >= amount) {
							$wrapper.addClass('full');

							if (currentIndex < files.length - 1) {
								$alert.text('Tối đa có ' + amount + ' tập tin').show();
							}

							return false;
						}
						if (currentIndex >= files.length) {
							return false;
						}

						// Get file
						var file = files[currentIndex++];

						// Check type
						if (types && $.inArray(file.name.split('.').pop().toLowerCase(), types) == -1) {
							$alert.text('Chỉ có thể thêm tập tin ' + types.join(', ')).show();
							return;
						}

						// Check size
						if (size && file.size > size) {
							$alert.text('Kích thước không thể lớn quá ' + size / 1024 + 'KB').show();
							return;
						}

						// Set info
						fileReader.fileName = file.name;
						fileReader.fileType = file.type;

						// Read file
						fileReader.readAsDataURL(file);
					}
					readNext();
				}

			// / Progress on choose new file

			// Create element

				$fileUploads.each(function () {
					var 
						$fileUpload = $(this),
						hasDescription = $fileUpload.is('[data-has_description]'),
						hasAvatar = $fileUpload.is('[data-has_avatar]'),
						hasOrder = $fileUpload.is('[data-has_order]'),
						dimension = $fileUpload.data('dimension') || false,
						controls = null, onItemRemove = null, onItemAdd = null, onInitItemAdd = null;
						ordering = false;

					// Recreate 

					$fileUpload.attr('data-recreate', '').data('original_object', $fileUpload.clone(true));
					$fileUpload.data('recreate', function (data) {
						if (typeof data == 'undefined') {
							data = {};
						}
						if (!('element' in data)) {
							data.element = $fileUpload;
						}

						$originalObject = data.element.data('original_object');
						$originalObject.attr('name', $originalObject.data('original_name'));
						if (data.new) {
							$originalObject.data('init-value', '');
						}
						data.element.closest('.file-uploader').replaceWith($originalObject);
						initFileInput($originalObject);
					});
					// Dimension 
					if (dimension) {
						dimension = dimension.split('x');
						dimension = { width: dimension[0], height: dimension[1] };
					}

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
						var $label = $('<div class="file-upload-label"><div class="fa fa-file-o"></div><div>' + _t.form.label_image_upload + '</div></div>');
						var $previewList = $('<div class="preview-list"></div>');

						if ($fileUpload.is('[multiple]')) {
							$previewList.html('<div class="add-button" style="' + (dimension ? ('width: ' + dimension.width + 'px; height: ' + dimension.height + 'px; ') : '') + '"><span class="fa fa-plus"></span></div>');
						}

						$fileUpload.after($wrapper);
						$fileUpload.appendTo($wrapper);
						$label.appendTo($wrapper);
						$previewList.appendTo($wrapper);
						$wrapper.append('<div class="alert-text" style="display: none;">asdfasdfds</div>')

					// / Create html

					// Drop event

						$wrapper[0].addEventListener('dragover', function (e) {
							e.stopPropagation();
							e.preventDefault();
							e.dataTransfer.dropEffect = 'copy';
							$wrapper.addClass('drag');
						}, false);

						$wrapper[0].addEventListener('dragleave', function (e) {
							$wrapper.removeClass('drag');
						}, false);

						$wrapper[0].addEventListener('drop', function (e) {
							e.stopPropagation();
							e.preventDefault();
							$wrapper.removeClass('drag');

							if (e.dataTransfer.files.length > 0) {
								readFiles($(this).find('.file-upload:eq(0)'), e.dataTransfer.files);
							}
							// else {
							// 	url = e.dataTransfer.getData('URL') || e.dataTransfer.getData('Text');
							// 	if (url) {
							// 		var fileName = url.split('/').pop().split('?').shift();
							// 		var $input = $(this).find('.file-upload:eq(0)');

							// 		var img = new Image();
							// 		img.setAttribute('crossOrigin', 'anonymous');
							// 		img.src = url;
							// 		img.onload = function (e) {
							// 			var canvas = document.createElement("canvas");
							// 			canvas.width = img.width;
							// 			canvas.height = img.height;
							// 			var ctx = canvas.getContext("2d");
							// 			ctx.drawImage(img, 0, 0);
							// 			canvas.toBlob(function (blob) {											
							// 				console.log(blob);
							// 			});
							// 			// readFiles($input, [new File([xhr.response], fileName, {type: xhr.response.type})]);
							// 		};
							// 	}
							// }
						}, false);

					// / Drop event

					// Create order button

						if (hasOrder) {
							var 
								$orderButtonContainer = $('<div class="margin-top-15 text-right order-button-container"><div>'),
								$orderButton = $('<button type="button" class="btn btn-flat btn-default">Sắp xếp</button>');

							$orderButtonContainer.html($orderButton);
							$wrapper.append($orderButtonContainer);

							$orderButton.on('click', function (e) {
								e.preventDefault();

								if (ordering) {
									// Set status
									ordering = false;
									$wrapper.removeClass('order');
									$orderButton.text('Sắp xếp').prev().remove();
									$previewList.find('.order').remove();
								}
								else {
									var $previewItems = $previewList.children('.preview');
									if ($previewItems.length == 0) {
										return;
									}

									// Set status
									ordering = true;
									$wrapper.addClass('order');
									$orderButton.text('Hủy').before('<small>(Hãy chọn hình theo thứ tự bạn muốn)</small> ');

									var order = 0;

									$previewItems.append('<section class="order" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; line-height: 150px; text-align: center; background-color: rgba(0,0,0,.6); font-size: 50px; color: #fff;"></section>')

									$previewItems.removeClass('control-show').data('order', false).on('click.order', function (e) {
										var $item = $(this);
										if ($item.data('order') == false) {
											$item.data('order', ++order);
											$item.find('.order').text(order);

											if (order >= $previewItems.length) {
												// Done
												var itemsWithOrder = new Array($previewItems.length);
												$previewItems.off('click.order').each(function () {
													$item = $(this);
													value = $item.data('value');
													value['order'] = $item.data('order');
													$item.data('value', value);
													$item.find('[aria-name="hidden_input"]').val(JSON.stringify(value));

													itemsWithOrder[$item.data('order') - 1] = $item;
												});

												itemsWithOrder.reverse();
												$(itemsWithOrder).each(function () {
													$(this).prependTo($previewList);
												});
												
												$orderButton.click();
											}
										}
									});
								}
							});

							$wrapper.on('click', function (e) {
								if (ordering) {
									e.preventDefault();
								}
							})
						}

					// / Create order button

					var constraint = $fileUpload.attr('data-constraint');
					constraint = constraint ? 'data-constraint="' + constraint + '"' : '';

					$fileUpload.data('original_name', $fileUpload.attr('name'));

					$fileUpload.on('nameChanged', function () {
						var 
							$fileUpload = $(this),
							$wrapper = $fileUpload.closest('label');
						var fuName = name = $fileUpload.attr('name');

						if (name[name.length - 1] == ']') {
							fuName = fuName.substr(0, fuName.length - 1) + '_fu]';
						}
						else {
							fuName = name + '_fu'
						}

						$fileUpload.data('input', '<input type="hidden" aria-name="hidden_input" data-nonvalid name="' + name + '" />');
						$fileUpload.attr('name', fuName);

						$wrapper.find('input[type="hidden"]').attr('name', name);
					});

					$fileUpload.trigger('nameChanged');

					// Init value
					$fileUpload.on({
						'initValue': function () {
							$previewList.children('.preview').remove();
							var initValues = $fileUpload.data('init-value');
							if (initValues) {
								$(initValues).each(function () {
									value = this;
									value['is_new'] = false;

									// Create item
									var $item = $('<article class="preview"></article>');
									$item.data('value', value);
									$item.data('control_show', null);

									if (value['file_name']) {
										ext = value['file_name'].split('.').pop().toLowerCase();
										if ($.inArray(ext, ['jpg','jpeg','png','gif','bmp']) == -1) {
											value['url'] = '/assets/file_extensions/' + ext + '.png';
										}
									}
									$item.html($fileUpload.data('input') + '<section class="image" title="' + (value['file_name'] || '') + '"><img style="' + (dimension ? ('height: ' + dimension.height + 'px;') : '') + '" onError="this.src=\'/assets/file_extensions/file.png\'" src="' + value['url'] + '" /></section><section class="control">' + (hasAvatar ? '<button type="button" class="btn btn-flat btn-primary btn-block font-bold" aria-click="avatar">Làm ảnh đại diện</button>' : '') + (hasDescription ? '<button type="button" class="btn btn-flat btn-primary btn-block font-bold" aria-click="description">Mô tả</button>' : '') + '<button type="button" class="btn btn-flat btn-danger btn-block font-bold" aria-click="remove">Xóa</button></section>');
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

									initPreviewItem($item);

									if ($fileUpload.is('[multiple]')) {
										$previewList.children().last().before($item);
									}
									else {
										$previewList.html($item);
									}
									if (onInitItemAdd) {
										onInitItemAdd($item);
									}
									if (onItemAdd) {
										onItemAdd($item);
									}
								});
							}
							if ($previewList.children('.preview').length == 0) {
								$wrapper.removeClass('has');
							}
							else {
								$wrapper.addClass('has');
								if ($previewList.children('.preview').length == $fileUpload.data('amount')) {
									$wrapper.addClass('full');
								}
							}
						}
					}).trigger('initValue');

					// Init item
					$fileUpload.on('initItem', function () {
						$previewList.children('.preview').each(function () {
							initPreviewItem($(this));
						})
					});

					function initPreviewItem($item) {

						// Event click to control
						$item.on('click', function (e) {
							e.preventDefault();

							if (ordering) {
								return;
							}

							if ($item.hasClass('control-show')) {
								clearTimeout($item.data('control_show'));
								$item.removeClass('control-show');
								$document.off('click.preview_image_control_show');
							}
							else {
								$item.addClass('control-show');
								clearTimeout($item.data('control_show'));
								
								setTimeout(function () {
									$document.on('click.preview_image_control_show', function () {
										clearTimeout($item.data('control_show'));
										$item.removeClass('control-show');
										$document.off('click.preview_image_control_show');
									});
								});
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
								html: $html,
								id: 'input_description_popup'
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
							$wrapper.removeClass('full');

							if ($previewList.children('.preview').length == 0) {
								$wrapper.removeClass('has')
							}
						});
					}
				});

			// Create element
		}

	// / File input

	// Auto complete

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
					acName = name + '_ac';
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
						switch (e.which || e.keyCode) {
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
					$input.next().val('0').change().trigger('valueChange');
					$input.removeClass('focus');	
				}
				else {
					$input.next().val('').change().trigger('valueChange');
					$input.removeClass('focus').val('');	
					_temp[prefix + 'value'] = '';
				}

				_temp[prefix + 'change'] = false;
				clearTimeout(_temp[prefix + 'to']);
			}

			function getAutoComplete($item) {
				if (!$item) {
					$item = $currentList.find('.selected');
				}

				var 
					$selected = $item.children(),
					$input = $item.closest('.autocomplete-container').children(':first-child'),
					text = $selected.text() || '',
					value = $selected.data('value') || '';

				$input.next().val(value).change().trigger('valueChange');
				$input.data('value', value).removeClass('focus').val(text).change().trigger('valueChange');

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

	// / Auto complete

	// Editor

		function initEditor() {
			$form.find('[aria-input-type="editor"]').each(function () {
				var $input = $(this);

				var extraPlugins = 'autogrow,justify';
				extraPlugins += $input.data('editor-extra-plugins') || '';

				CKEDITOR.replace(this.id, {
					extraPlugins: extraPlugins
				});
				
				CKEDITOR.on('instanceReady', function() { $input.siblings('.cke').addClass('form-control'); }); 

				var ckeditor = CKEDITOR.instances[this.id];

				ckeditor.on('change', function () {
					$input.val(ckeditor.getData());
				});

				ckeditor.on('blur', function () {
					$input.change();
				});
			});

			$form.on('submit', function () {
				$form.find('[aria-input-type="editor"]').each(function () {
					this.value = CKEDITOR.instances[this.id].getData();
				});
			});
		}

	// Editor

	// Color

		function initColor() {
			$form.find('[aria-input-type="color"]').attr('data-recreate', '').data('recreate', function (data) {
				createColorInput(data.element);
			}).each(function () {
				$input = $(this);
				createColorInput($input);
			});

			function createColorInput($input) {
				
				color = $input.val() || $input.data('default_color') || '#FFFFFF';

				$input.css('background-color', color);
				if (isLightColor(color)) {
					$input.css('color', '#333');
				}
				else {
					$input.css('color', '#fff');
				}

				if ($input.hasClass('colorpicker-element')) {
					$input.removeData('colorpicker').off('.colorpicker').removeClass('colorpicker-element');
				}

				$input.colorpicker({
					color: color
				}).on({
					changeColor: function () {
						$input.css('background-color', $input.val());
						if (isLightColor($input.val())) {
							$input.css('color', '#333');
						}
						else {
							$input.css('color', '#fff');
						}
					}
				});	

				// color = new jscolor(input);
				// if (input.value.length > 0 && input.value[0] != '#') {
				// 	input.value = '#' + input.value;
				// }
				// color.hash = true;
			}
		}

	// / Color

	// Icon
	
		function initIcon() {
			$form.find('[aria-input-type="icon"]').attr('type', 'hidden').attr('data-recreate', '').each(function () {
				$input = $(this);
				
				// Create wrapper
				$wrapper = $('<article class="form-icon-select"></article>');
				$input.after($wrapper);
				$input.appendTo($wrapper);

				// Create button
				$button = $('<button class="btn btn-default btn-flat" type="button"><span class="text">Chọn</span></button>');
				$wrapper.append($button);

				// Init value
				if ($input.val()) {
					$input.next().append('<span style="color: ' + color + '" class="icon fa ' + $input.val() + '"></span>').find('.text').hide();
				}

				createIconInput($input[0]);
			}).data('recreate', function (data) {
				createIconInput(data.element[0]);
			});

			function createIconInput(input) {
				var $input = $(input),
					color = '#333';

				// Set color method
				$input.data('set_color', function (new_color) {
					color = new_color;
					$input.next().find('.icon').css('color', color);
				});

				// Event
				$input.next().off('click').on('click', function () {
					$html = $(
						'<article class="box box-primary">' +
							'<section class="box-header with-border">' +
								'<div class="box-title">' +
									'Chọn biểu tượng' +
								'</div>' +
							'</section>' +
							'<section class="box-body form-icon-list">' +
							'</section>' +
							'<section class="box-footer text-center">' +
								'<button class="btn btn-flat btn-default" aria-click="close-popup">' +
									'Hủy' +
								'</button> ' +
								'<button aria-click="ok" class="btn btn-flat btn-primary">' +
									'Chọn' +
								'</button>' +
							'</section>' +
						'</article>'
					);

					var $popup = popupFull({
						html: $html
					});

					// Create icon list
					$html.find('.box-body').html(iconList['fa'].map(function (value) {
						return '<span class="fa ' + value + '" data-value="' + value + '"></span>';
					}).join('')).find('span').on('click', function () {
						if ($(this).hasClass('active')) {
							$(this).removeClass('active');
						}
						else {
							$(this).addClass('active').siblings('.active').removeClass('active');
						}
					});

					// Create event
					$html.find('[aria-click="ok"]').on('click', function () {
						$item = $html.find('.box-body').find('.active');

						if ($item.length == 0) {
							$input.val('');
							$input.next().find('.text').show();
							$input.next().find('.icon').remove();
						}
						else {
							$input.val($item.data('value'));
							$input.next().find('.icon').remove();
							$input.next().append('<span style="color: ' + color + '" class="icon fa ' + $item.data('value') + '"></span>').find('.text').hide();
						}

						$input.change();
						$popup.off();
					});
				});
			}
		} 
	
	// / Icon

	// Dropdownselect

		function initDropdownselect() {
			$form.find('[aria-input-type="dropdownselect"]').each(function () {
				var $container = $(this);

				// Init value

					// Get selected item
					var $selectedItem = $container.find('ul a[data-selected]');
					if ($selectedItem.length == 0) {
						$selectedItem = $container.find('ul a:eq(0)');
					}

					// Set text
					$container.find('button .text').text($selectedItem.text());

					// Set value
					$container.find('input[type="hidden"]').val($selectedItem.data('value')).change();

				// Init value

				// Event button

					$container.find('ul a').on('click', function () {

						// Set text
						$container.find('button .text').text($(this).text());

						// Set value
						$container.find('input[type="hidden"]').val($(this).data('value'));
					});

				// / Event button

			});
		}

	// / Dropdownselect

	// Read money

		function initReadMoney() {
			$form.find('.read-money').on({
				keyup: function () {
					var $input = $(this);

					if ($input.val() != $input.data('old-value')) {
						var value = $input.val().replace(/\D/g, '');

						$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : '');

						$input.data('old-value', $input.val());
					}
				},
				change: function () {
					var $input = $(this);
					
					var value = $input.val().replace(/\D/g, '');

					$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : '');

					$input.data('old-value', $input.val());
				}
			}).each(function () {
				var $input = $(this)
				var value = $input.val().replace(/\D/g, '');

				$input.closest('.form-group').find('.money-text').text(value ? read_money(value) : '');
			});
		}

	// Read money

	// Price format

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

					input.value = value;
					selectionEnd = value.length - selectionEnd;
					input.setSelectionRange(selectionEnd, selectionEnd);

					_temp['price'] = value;
					_temp['is_changed'] = true;
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

	// / Price format

	// Tab container

		function initTabContainer() {

			$form.resetTabName = function ($tabContainers) {
				$tabContainers.each(function () {
					$tabContainer = $(this);

					$tabContainer.find('.tab-list li[aria-name]').each(function (index) {
						var $item = $(this);

						newName = index + 1;

						if ($item.attr('aria-name') == newName) {
							return;
						}

						$item.find('[aria-click="change_tab"]').text(newName);
						$tabContainer.find('.tab-content[aria-name="' + $item.attr('aria-name') + '"]').attr('aria-name', newName).find(':input[data-base_name]').each(function () {
							$input = $(this);
							$input.attr('name', $input.attr('data-base_name').replace('[tab_name]', '[tab_' + newName + ']'));
							if ($input.is('.file-upload')) {
								$input.trigger('nameChanged');
							}
						});

						$item.attr('aria-name', newName);
					});
				});
			}

			$form.find('.tab-container.input').each(function () {
				var $tabContainer = $(this);

				// Create buttons

					$tabListButtons = $tabContainer.find('.tab-list ul');
					$tabContainer.find('.tab-content').each(function () {
						$tabListButtons.append(
							'<li class="horizontal-item" aria-name="' + this.getAttribute('aria-name') + '">' +
								'<a href="javascript:void(0)" aria-click="change_tab"></a>' +
								'<a href="javascript:void(0)" aria-click="remove_tab" class="remove">&times;</a>' +
							'</li>');
					});

					_initTabContainer($tabContainer);

				// / Create buttons

				// Set inputs

					$(this).find(':input').on({
						change_valid_status: function () {
							var $input = $(this);
							$container = $input.closest('.tab-container');
							$tabContent = $input.closest('.tab-content');
							
							switch ($input.attr('data-valid-status')) {
								case 'error':
									$container.find('.tab-list li[aria-name="' + $tabContent.attr('aria-name') + '"]').attr('data-status', 'error');
									break;
								case 'success':
									if ($tabContent.find(':input:enabled[data-valid-status="error"]').length == 0) {
										$container.find('.tab-list li[aria-name="' + $tabContent.attr('aria-name') + '"]').attr('data-status', '');
									}
									break;
							}
						}
					}).each(function () {
						$input = $(this);
						$input.attr('data-base_name', $input.is('.file-upload') ? $input.data('original_name') : $input.attr('name'));
						if ($input.data('original_object')) {
							$input.data('original_object').attr('data-base_name', $input.is('.file-upload') ? $input.data('original_name') : $input.attr('name'));
						}
					});

					$form.resetTabName($tabContainer);
					// Recheck radio buttons
					
						// Recheck radio button because in begin, all radio button name in tab is same
						$(this).find(':input[type="radio"][checked]').each(function () {
							this.checked = true;
							$(this).trigger('retoggle');
						});
					
					// / Recheck radio buttons

				// / Set inputs
								
				// Remove

					$tabContainer.find('.tab-list [aria-click="remove_tab"]').on('click', function (e) {
						var $item = $(this).parent();

						// Remove button
						$item.remove();

						$tabContainer.find('.tab-list [aria-click="change_tab"]:visible:eq(0)').click();

						// Remove tab content
						$tabContainer.find('.tab-content[aria-name="' + $item.attr('aria-name') + '"]').remove();

						$form.resetTabName($tabContainer);
					});

				// / Remove

				// Add

					$tabContainer.find('.tab-list [aria-click="add_tab"]').on('click', function () {
						// Get contents
						var
							$tabButton = $tabContainer.find('.tab-list li[aria-name]:last').clone(true).attr('aria-name', 'new').attr('data-status', '').removeClass('active'),
							$tabContent = $tabContainer.find('.tab-content:last').clone(true).attr('aria-name', 'new').removeClass('active');

						// Replace name off radio input for don't lose radio input in other tabs
						$tabContent.find(':input[type="radio"]').attr('name', '');

						$form.data('reset_value')($tabContent);
						$tabContent.find(':input[data-recreate]').each(function () {
							$(this).data('recreate')({ new: true, element: $(this) });
						});
						
						// Append
						$tabContainer.find('.tab-list ul').append($tabButton);
						$tabContainer.find('.tab-content-list').append($tabContent);

						// Set new values
						$form.resetTabName($tabContainer);
						$tabButton.find('[aria-click="change_tab"]').click();

						if ($tabContainer.data('relative_inputs')) {
							$($tabContainer.data('relative_inputs').split(' ')).each(function () {
								$form.find('[name="' + this + '"]').change();
							});	
						}

						$form.data('toggle_inputs')($tabContent);
					});

				// / Add

			});
			_initHorizontalListScroll($form.find('.tab-container .horizontal-list-container'));
		}

	// / Tab container

	// Constraint

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
					var keyCode = e.which || e.keyCode;

					if (
							// Number
							(48 <= keyCode &&
							keyCode <= 57) ||

							// Enter key
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

			// Phone
			$form.find('[data-constraint~="phone"]').on({
				'keypress': function (e) {
					var keyCode = e.which || e.keyCode;

					if (
							// Number
							(48 <= keyCode &&
							keyCode <= 57) ||

							// Comma
							keyCode == 44 ||

							// Enter key
							keyCode == 13
						) {
						return;
					}
					e.preventDefault();
				},
				'paste': function () {
					var $input = $(this);

					setTimeout(function () {
						$input.val($input.val().replace(/[^\d,]/g, '')).change();
					});
				}
			});

			// Real
			$form.find('[data-constraint~="real"]').on({
				'keypress': function (e) {
					var keyCode = e.which || e.keyCode;
					if (
							//Number
							(48 <= keyCode &&
							keyCode <= 57) ||

							//Float point
							(keyCode == 46 && this.value.indexOf('.') == -1) ||
							
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
				change: function () {
					var $input = $(this);
					if ($input.val() && !/^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i.test($input.val())) {
						toggleValidInput($input, false, 'invalid');
					}
				}
			});
			$form.find('[data-constraint~="multi-email"]').on({
				change: function () {
					var $input = $(this);
					if ($input.val()) {
						$($input.val().split(',')).each(function () {
							if (!/^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i.test(this)) {
								toggleValidInput($input, false, 'invalid');
								return;
							}	
						})	
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

			// Length
			$form.find('[data-constraint~="length"]').on({
				change: function () {
					var
						$input = $(this),
						minLength = $input.data('minlength'),
						maxLength = $input.data('maxlength');
					
					if (minLength && $input.val().length < minLength || maxLength && $input.val().length > maxLength) {
						$input.val('');
					}
				},
				keypress: function (e) {
					var
						$input = $(this),
						maxLength = $input.data('maxlength');

					if (maxLength && $input.val().length >= maxLength) {
						e.preventDefault();
					}
				}
			});

			// Regexp
			// $form.find('[data-constraint~="regexp"]').on({
			// 	'keypress': function (e) {
			// 		$input = $(this);
			// 		c = String.fromCharCode(e.which);

			// 		if (eval($input.data('regexp')).test(c)) {
			// 			return;
			// 		}

			// 		e.preventDefault();
			// 	},

			// 	'paste': function () {
			// 		var $input = $(this);

			// 		setTimeout(function () {
			// 			regexp = eval('/^' + $input.data('regexp').slice(1));

			// 			newString = '';

			// 			$($input.val().split('')).each(function () {
			// 				if (regexp.test(this[0])) {
			// 					newString += this[0];
			// 				}
			// 			});

			// 			$input.val(newString).change();
			// 		});
			// 	}
			// });
		};
	
	// / Constraint

	// Check input

		function checkInvalidInput($input) {
			if ($input.is('[data-constraint~="required"]')) {
				if ($input.is('[type="radio"],[type="checkbox"]')) {
					if ($form.find('[name="' + $input.attr('name') + '"]:checked').length == 0) {
						toggleValidInput($input, false, 'required');
						return 'required';
					}
				}
				else if ($input.is('.file-upload')) {
					if ($input.siblings('.preview-list').children('.preview').length == 0) {
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
				// result: { status, input, constraint, params: {} }
				var result = $input.data('validate')($input);

				if (typeof result != 'undefined') {
					if (result instanceof Array) {
						toggleValidInput(result);
						return;
					}
					if (result.status) {
						if ('params' in result) {
							result['params']['is_valid'] = result['params']['is_valid'] || true;
							toggleValidInput(result['params']);
						}
						else {
							toggleValidInput(result.input || $input, true, result.constraint || 'custom');
						}
					}
					else {
						if ('params' in result) {
							result['params']['is_valid'] = result['params']['is_valid'] || false;
							toggleValidInput(result['params']);
						}
						else {
							toggleValidInput(result.input || $input, false, result.constraint || 'custom');
						}
						return;
					}	
				}
			}

			toggleValidInput($input, true);
		}

	// / Check input

	// Toggle valid input
	
		$form.toggleValidInput = function ($inputs, isValid, constraint, name, errorMessage) {
			toggleValidInput($inputs, isValid, constraint, name, errorMessage);
		};

		function removeSuccessLabel($input) {
			$input.closest('.form-group').removeClass('has-success');

			var $box = $input.closest('.box', $form[0]);
				if ($box.length == 0) {
					$box = $form;
				}

			if ($box.data('status') == 'success') {
				$box.removeClass('box-success').data('status', 'normal').trigger('changeStatus');
			}
		}

		function toggleValidInput($inputs, isValid, constraint, name, errorMessage, replaceInvalid) {
			if (!($inputs instanceof $)) {
				if ($inputs instanceof Array) {
					$($inputs).each(function () {
						toggleValidInput(this);
					});
					return;
				}
				else {
					validInputParams = $inputs;

					$inputs = validInputParams['inputs'] || validInputParams['input'];
					isValid = validInputParams['is_valid'];
					constraint = validInputParams['constraint'];
					name = validInputParams['name'];
					errorMessage = validInputParams['error_message'];
					replaceInvalid = validInputParams['replace_invalid'];
				}
			}
			
			$inputs.each(function () {
				$input = $(this);
				name = name || $input.attr('name');

				if (isValid) {
					// Set valid input
					$input.data('invalid', false);
					$input.attr('data-valid-status', 'success').trigger('change_valid_status');

					// Remove error class from form group if all input in valid
					var $formGroup = $input.closest('.form-group');
					// if ($formGroup.find('[data-constraint]').filter(function () { return $(this).data('invalid'); }).length == 0) {
					// 	$formGroup.removeClass('has-error');
					// }

					// Remove error message, remove error class from box

					var $box = $input.closest('.box', $form[0]);
					if ($box.length == 0) {
						$box = $form;
					}

					// Callout success
					$formGroup.addClass('has-success');

					// Remove callout error
					$formGroup.removeClass('has-error').find('.callout-error').remove();

					currentStatus = $box.data('status');
					if ($box.hasClass('box-danger') && $box.find('.callout-error').length == 0) {
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
					if ($input.data('invalid') == constraint && !replaceInvalid) {
						return;
					}

					// Set invalid input with constraint
					$input.data('invalid', constraint);
					$input.attr('data-valid-status', 'error').trigger('change_valid_status');

					// Add error class to form group
					var $formGroup = $input.closest('.form-group');
					$formGroup.removeClass('has-success').addClass('has-error');

					// Add error class to box
					var $box = $formGroup.closest('.box', $form[0]);
					if ($box.length == 0) {
						$box = $form;
					}

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

					$callout.html(errorMessage || _t[params.object]['validate'][name + '_' + constraint]);

					// Get error message
					// var $errorMessage = $callout.find('[aria-name="' + name + '"]');
					// if ($errorMessage.length == 0) {
					// 	$errorMessage = $('<p class="no-margin" aria-name="' + name + '"></p>');
					// 	$callout.append($errorMessage);
					// }
					// $errorMessage.text(_t[params.object]['validate'][name + '_' + constraint]);
				}
			});
		}

	// / Toggle valid input

	// Enter key

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

	// / Enter key

	// Helper

		function initHelper() {
			if (true || $window.isWidthType(['xs'])) {
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

	// / Helper

	// Submit

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

				// Check validate before check
				if ($form.hasClass('box-danger')) {
					return; 
				}
				else {
					var $dangerBox = $form.find('.box-danger:visible');
					if ($dangerBox.length) {
						$body.animate({
							scrollTop: $dangerBox.offset().top - 20 
						}); 
					
						return; 
					}	
				}

				if (params['submit_status']) {
					$form.submitStatus(true);
				}

				// Check validate
				$form.find(':input:enabled:not([data-nonvalid]):not(button)').each(function () {
					checkInvalidInput($(this));
				});
				
				function waitCheckingList() {
					setTimeout(function () {
						if (Object.keys(checkingList).length > 0) {
							waitCheckingList();
						}
						else {
							submit();
						}
					}, 100);
				}

				function submit() {
					// Check validate after check
					if ($form.hasClass('box-danger')) {
						$form.submitStatus(false);
						return; 
					}
					else {
						var $dangerBox = $form.find('.box-danger:visible');
						if ($dangerBox.length) {
							$body.animate({
								scrollTop: $dangerBox.offset().top - 20 
							}); 
						
							$form.submitStatus(false);
							return; 
						}	
					}

					//Submit
					if ('submit' in params) {
						if (params.submit() == false) {
							var $dangerBox = $form.find('.box-danger:visible');
							if ($dangerBox.length) {
								$body.animate({
									scrollTop: $dangerBox.offset().top - 20 
								}); 
							
								$form.submitStatus(false);
							}
						}
					}
				}

				if (Object.keys(checkingList).length > 0) {
					waitCheckingList()
				}
				else {
					submit();
				}
			});
		}

	// / Submit
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