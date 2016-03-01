var project_id;

$(function () {

	// Parse floor

		function parseFloors(stringList) {
			// Format
			stringList = stringList.replace(/[^0-9-,]/g, '');

			list = []
			$(stringList.split(',')).each(function () {
				// remove redundancy
				value = this.replace(/-.*-/, '-').split('-');

				// case: just a number
				if (value.length == 1) {
					list.push(parseInt(value));
				}
				// case: in range
				else {
					// case: full param
					if (value[0] && value[1]) {
						value[0] = parseInt(value[0]);
						value[1] = parseInt(value[1]);

						// exchange for correct format (increase)
						if (value[0] > value[1]) {
							temp = value[0];
							value[0] = value[1];
							value[1] = temp;
						}

						while (value[0] <= value[1]) {
							list.push(value[0]++);
						}
					}
					// case: one in => same a number
					else if (value[0]) {
						list.push(parseInt(value[0]));
					}
					else if (value[1]) {
						list.push(parseInt(value[1]));
					}
				}
			});

			return $.unique(list).sort(function (a, b) { return a - b });
		}

	// / Parse floor

	// View

		var 
			$viewPart = $('#view_part'),
			$blockList = $('#block_list'),
			selectedBlockId,
			$selectedBlockItem,
			$realEstateList = $('#real_estate_list'),
			realEstateFind,
			realEstateList = $viewPart.find('#real_estate_list');

		initCreateBlock();
		initBlock($blockList.find('.item'));

		// Project

		// / Project

		// Block

			// Create block

				function initCreateBlock() {
					$viewPart.find('[aria-click="create_block"]').on('click', function () {
						toggleLoadStatus(true);
						$.ajax({
							url: '/blocks/_create/' + project_id,
							dataType: 'JSON'
						}).always(function () {
							toggleLoadStatus(false);
						}).done(function (data) {
							if (data.status == 0) {
								startBlockCreateForm($(data.result), function (result) {
									result = $(result);
									initBlock(result);
									$blockList.append(result);
									result.find('[aria-click="select_block"]').click();
								});
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
						})
					});
				}

			// / Create block

			// Init block

				function initBlock($items) {

					// Edit block

						$items.find('[aria-click="edit_block"]').on('click', function () {
							var $item = $(this).closest('.item');

							toggleLoadStatus(true);
							$.ajax({
								url: '/blocks/_create/' + project_id + '/' + $item.data('value'),
								dataType: 'JSON'
							}).always(function () {
								toggleLoadStatus(false);
							}).done(function (data) {
								if (data.status == 0) {
									startBlockCreateForm($(data.result), function (result) {
										result = $(result);
										initBlock(result);
										$item.replaceWith(result);

										result.find('[aria-click="select_block"]').click();
									});
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
							})
						});

					// / Edit block

					// Delete

						$items.find('[aria-click="delete_block"]').on('click', function () {
							var $item = $(this).closest('.item');

							toggleLoadStatus(true);
							$.ajax({
								url: '/blocks/delete',
								method: 'POST',
								data: { id: $item.data('value') },
								dataType: 'JSON'
							}).always(function () {
								toggleLoadStatus(false);
							}).done(function (data) {
								if (data.status == 0) {
									$item.remove();

									if ($item.data('value') == selectedBlockId) {
										$viewPart.find('.real-estate-container').hide();
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
							})
						});

					// / Delete

					// Select

						$items.find('[aria-click="select_block"]').on('click', function () {
							var $item = $(this).closest('.item');

							if ($item.hasClass('active')) {
								return;
							}

							// Change status

								$item.siblings('.active').removeClass('active');
								$item.addClass('active');

								$selectedBlockItem = $item;
								selectedBlockId = $item.data('value');

								$viewPart.find('.real-estate-container').show();

								$viewPart.find('#selected_block_name').text($item.find('[aria-object="name"]').text());

							// Change status

							// Get real-estates

								realEstateFind();

							// / Get real-estates
						});

					// / Select

				}

			// / Init block

			// Block create form

				function startBlockCreateForm($form, done) {
					var $popup = popupFull({
						html: $form,
						width: 'maximum',
						esc: false
					});

					var $tabContainers = $form.find('.tab-container');

					// Floor validation

						var firstChecking = false;
						$form.find('[aria-object="floors"]').attr('data-recreate', '').data('recreate', function (params) {
							var $input = $(params.element);
							$input.data('validate', function () {
								if (!$input.val()) {
									return;
								}
								var isFirstCheck;
								firstChecking = isFirstCheck = !firstChecking;

								currentFloors = parseFloors($input.val());

								// Error if exists
								badFloors = [];

								// Get other floors && check if exist any bad floor
								$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').each(function () {
									// If this floor have value
									if (this.value) {
										// Get floors of this
										thisFloors = parseFloors(this.value);

										// Check floors if exists => error
										length = currentFloors.length;
										for (i = 0; i < length; i++) {
											if (thisFloors.indexOf(currentFloors[i]) != -1) {
												badFloors.push(currentFloors[i]);
											}
										}
									}
								});
								if (badFloors.length > 0) {
									if (isFirstCheck) {
										$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').change();
										firstChecking = false;
									}
									return {
										status: false,
										params: {
											inputs: $input,
											constraint: 'bad_floor',
											error_message: 'Tầng <b>' + badFloors.join(', ') + '</b> đã tồn tại',
											replace_invalid: true
										}
									}
								}

								if (isFirstCheck) {
									$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').change();
									firstChecking = false;
								}
								return {
									status: true,
									params: {
										inputs: $input
									}
								};
							});
						}).each(function () {
							$(this).data('recreate')({
								element: $(this)
							});
						});		
					
					// / Floor validation
					
					initForm($form, {
						submit: function () {
							toggleLoadStatus(true);
							$.ajax({
								url: '/blocks/create',
								method: 'POST',
								data: $form.serialize(),
								dataType: 'JSON'
							}).always(function () {
								$popup.off();
								toggleLoadStatus(false);
							}).done(function (data) {
								if (data.status == 0) {
									done(data.result);
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
				}

			// / Block create form

		// / Block

		// Real-estate

			initCreateRealEstate();
			initRealEstateList();
			$viewPart.find('.real-estate-container').hide();

			// Create

				function initCreateRealEstate() {
					$viewPart.find('[aria-click="create_real_estate"]').on('click', function () {

						$html = $(
							'<article class="box box-primary">' +
								'<section class="box-header">' +
									'<h2 class="box-title small">' +
										'Bạn thêm loại thuộc nhóm ...' +
									'</h2>' +
								'<section>' +
								'<section class="box-body text-center">' +
									'<article class="flex flex-column flex-inline group-list">' +
									'</article>' +
								'</section>' +
							'</article>'
						);

						var $popup = popupFull({
							html: $html
						});

						$groupList = $html.find('.group-list');
						$($selectedBlockItem.data('groups')).each(function () {
							$button = $('<button data-value="' + this.id + '" class="btn btn-block btn-default">' + this.name + '</button>');
							$button.on('click', function () {
								getRealEstateCreateForm($(this).data('value'));
							});
							$groupList.append($button);
						});

					});

					function getRealEstateCreateForm(group_id) {
						toggleLoadStatus(true);
						$.ajax({
							url: '/real_estates/_block_create/' + selectedBlockId + '/' + group_id,
							dataType: 'JSON'
						}).always(function () {
							toggleLoadStatus(false);
						}).done(function (data) {
							if (data.status == 0) {
								startRealEstateCreateForm($(data.result), function (result) {
									result = $(result);
									initRealEstateItem(result);
									$realEstateList.find('.tab-content[aria-name="group_' + group_id + '"]').append(result);
								});
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
						})
					}
				}

			// / Create

			// Init real-estate list

				function initRealEstateList() {
					realEstateFind = function () {
						$.ajax({
							url: '/real_estates/_block_item_list/' + selectedBlockId,
							dataType: 'JSON'
						}).done(function (data) {
							if (data.status == 0) {
								$realEstateList.html(data.result);

								_initTabContainer($realEstateList.find('.free-style-tab-container'));
								initRealEstateItem($realEstateList);
							}
							else {
								errorPopup();
							}
						}).fail(function () {
							errorPopup();
						})
					}
				}

				function initRealEstateItem($container) {
					// Delete

						$container.find('[aria-click="delete"]').on('click', function () {
							$item = $(this).closest('.item');

							toggleLoadStatus(true);
							$.ajax({
								url: '/real_estates/delete/' + $item.data('value'),
								method: 'POST',
								dataType: 'JSON'
							}).always(function () {
								toggleLoadStatus(false);
							}).done(function (data) {
								if (data.status == 0) {
									$item.parent().remove();
								}
								else {
									errorPopup();
								}
							}).fail(function () {
								errorPopup();
							})
						});

					// Delete

					// Edit

						$container.find('[aria-click="edit"]').on('click', function () {
							$item = $(this).closest('.item');

							toggleLoadStatus(true);
							$.ajax({
								url: '/real_estates/_block_edit/' + $item.data('value'),
								dataType: 'JSON'
							}).always(function () {
								toggleLoadStatus(false);
							}).done(function (data) {
								if (data.status == 0) {
									startRealEstateCreateForm($(data.result), function (result) {
										result = $(result);
										initRealEstateItem(result);
										$item.parent().replaceWith(result);
									});
								}
								else {
									errorPopup();
								}
							}).fail(function () {
								errorPopup();
							})
						});

					// / Edit
				}

			// / Init real-estate list

			// Real-estate create form

				function startRealEstateCreateForm($form, done) {
					var $popup = popupFull({
						html: $form,
						width: 'maximum',
						esc: false
					});

					// Price

						$form.find('[aria-click="price_preview"]').on('click', function () {
							$button = $(this);
							$row = $button.closest('.row');
							$container = $row.closest('.tab-content');

							// Get infos

								price = $row.find('[aria-object="price"]').val();
								if (!price) {
									popupPrompt({
										type: 'warning',
										content: 'Vui lòng nhập giá'
									});
									return;
								}
								price = intFormat(price);
								coefficient = $row.find('[aria-object="coefficient"]').val();
								if (!coefficient) {
									popupPrompt({
										type: 'warning',
										content: 'Vui lòng nhập hệ số'
									});
									return;
								}
								floors = $container.find('[aria-object="floors"]').val();
								if (!floors) {
									popupPrompt({
										type: 'warning',
										content: 'Vui lòng nhập vị trí/tầng'
									});
									return;
								}
								floors = parseFloors(floors);
								label = $form.find('[aria-object="label"]').val();
								if (!label) {
									popupPrompt({
										type: 'warning',
										content: 'Vui lòng nhập mã'
									});
									return;
								}


							// / Get infos

							// Replace operator

								// x => *
								coefficient = coefficient.replace(/x(?!(^{)*})/gi, '*');
								// : => /
								coefficient = coefficient.replace(/:(?!(^{)*})/g, '/');
								// \D & operator => ''
								coefficient = coefficient.replace(/[^\d\+\-\*\/\(\)\{\}](?!(^{)*})/g, '');
								// ++ => +
								coefficient = coefficient.replace(/\+[\+\-\*\/](?!(^{)*})/g, '+');
								coefficient = coefficient.replace(/\-[\+\-\*\/](?!(^{)*})/g, '-');
								coefficient = coefficient.replace(/\*[\+\-\*\/](?!(^{)*})/g, '*');
								coefficient = coefficient.replace(/\/[\+\-\*\/](?!(^{)*})/g, '/');

							// / Replace operator

							// Popup

								$html = $(
									'<article class="box box-primary">' +
										'<section class="box-header">' +
											'<h2 class="box-title">' +
												'Bảng giá' +
											'</h2>' +
										'</section>' +
										'<section class="box-body text-center no-padding">' +
											'<table class="table table-striped width-auto inline-block">' +
												'<thead>' +
													'<tr>' +
														'<th>' +
															'Mã' +
														'</th>' +
														'<th>' +
															'Giá <small class="font-normal">' + coefficient + '</small>' +
														'</th>' +
													'</tr>' +
												'</thead>' +
												'<tbody>' +
												'</tbody>' +
											'</table>' +
										'</section>' +
									'</article>'
								);

								$tbody = $html.find('tbody');
								$(floors).each(function () {
									$tbody.append(
										'<tr>' +
											'<td>' +
												label.replace('{f}', this) +
											'</td>' +
											'<td>' +
												moneyFormat(eval(coefficient.replace(/\{f\}/g, this).replace(/\{p\}/g, price)), ',') +
											'</td>' +
										'</tr>'
									)
								});

								popupFull({
									html: $html,
									id: 'price_preview_popup'
								});

							// / Popup
						});

					// / Price

					// Label
					
						$form.find('#label').data('validate', function ($input) {
							if ($input.val() && $input.val() != $input.data('old_value')) {
								$form.data('add_checking_list')({
									key: 'check_label',
									message: 'Đang kiểm tra mã'
								});
								$.ajax({
									url: '/real_estates/check_unique_label/' + $form.find('[name="real_estate[id]"]').val(),
									data: {
										project_id: project_id,
										label: $input.val()
									},
									dataType: 'JSON'
								}).done(function (data) {
									if (data.status == 0) {
										if (data.result) {
											$form.toggleValidInput({
												input: $input,
												is_valid: true
											});
										}
										else {
											$form.toggleValidInput({
												input: $input,
												is_valid: false,
												constraint: 'unique',
												error_message: 'Đã được sử dụng'
											});
										}
									}
									else {
										errorPopup();
									}
								}).fail(function () {
									errorPopup();
								}).always(function () {
									$form.data('remove_checking_list')('check_label');
								});
							}
						});
					
					// / Label

					// Floor validation

						$('#block_floor').on('change', function () {
							$form.find('[aria-object="floors"]').change();
						});

						var firstChecking = false;
						$form.find('[aria-object="floors"]').attr('data-recreate', '').data('recreate', function (params) {
							var $input = $(params.element);
							$input.data('validate', function () {
								if (!$input.val()) {
									return;
								}
								
								var isFirstCheck;
								firstChecking = isFirstCheck = !firstChecking;

								// Error if exists
								badFloors = [];

								// Get available floors
								availableFloors = parseFloors($('#block_floor :selected').data('value'));

								// Get this floors
								currentFloors = parseFloors($input.val());

								// Check if exist any bad floor
								length = currentFloors.length;
								for (i = 0; i < length; i++) {
									if (availableFloors.indexOf(currentFloors[i]) == -1) {
										badFloors.push(currentFloors[i]);
									}
								}
								if (badFloors.length > 0) {
									if (isFirstCheck) {
										$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').change();
										firstChecking = false;
									}
									return {
										status: false,
										params: {
											inputs: $input,
											constraint: 'bad_floor',
											error_message: 'Tầng <b>' + badFloors.join(', ') + '</b> không phù hợp',
											replace_invalid: true
										}
									}
								}

								// Get other floors && check if exist any bad floor
								$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').each(function () {
									// If this floor have value
									if (this.value) {
										// Get floors of this
										thisFloors = parseFloors(this.value);

										// Check floors if exists => error
										length = currentFloors.length;
										for (i = 0; i < length; i++) {
											if (thisFloors.indexOf(currentFloors[i]) != -1) {
												badFloors.push(currentFloors[i]);
											}
										}
									}
								});
								if (badFloors.length > 0) {
									if (isFirstCheck) {
										$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').change();
										firstChecking = false;
									}
									return {
										status: false,
										params: {
											inputs: $input,
											constraint: 'bad_floor',
											error_message: 'Tầng <b>' + badFloors.join(', ') + '</b> đã tồn tại',
											replace_invalid: true
										}
									}
								}

								if (isFirstCheck) {
									$form.find('[aria-object="floors"]:not([name="' + $input.attr('name') + '"])').change();
									firstChecking = false;
								}
								return {
									status: true,
									params: {
										inputs: $input
									}
								};
							});
						}).each(function () {
							$(this).data('recreate')({
								element: $(this)
							});
						});		
					
					// / Floor validation

					initForm($form, {
						submit: function () {
							// Check all floor number corresponding with block floor

								// Get all floors
								$floors = $form.find('[aria-object="floors"]');
								allFloors = [];
								$floors.each(function () {
									allFloors = allFloors.concat(parseFloors(this.value));
								});

								// Get available floors
								availableFloors = parseFloors($('#block_floor :selected').data('value'));

								// Check if not correspoding
								badFloors = [];
								length = availableFloors.length;
								for (i = 0; i < length; i++) {
									if (allFloors.indexOf(availableFloors[i]) == -1) {
										badFloors.push(availableFloors[i]);
									}
								}
								if (badFloors.length > 0) {
									$form.toggleValidInput({
										inputs: $floors,
										is_valid: false,
										constraint: 'bad_floor',
										error_message: 'Thiếu thông tin tầng ' + badFloors.join(', ')
									});
									return false;
								}

							// / Check all floor number corresponding with block floor


							toggleLoadStatus(true);
							$.ajax({
								url: '/real_estates/block_create',
								method: 'POST',
								data: $form.serialize(),
								dataType: 'JSON'
							}).always(function () {
								$popup.off();
								toggleLoadStatus(false);
							}).done(function (data) {
								if (data.status == 0) {
									done(data.result);
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
				}

			// / Real-estate create form

		// / Real-estate

	// / View

})