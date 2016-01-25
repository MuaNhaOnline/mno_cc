var project_id;

$(function () {

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
									$blockList.prepend(result);
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
									})
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

		// Real-estate group

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
								startRealEstateCreateForm($(data.result), function () {
									realEstateFind();
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

								// Delete

									$realEstateList.find('[aria-click="delete"]').on('click', function () {
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
												realEstateFind({
													data: 'last_data'
												});
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

									$realEstateList.find('[aria-click="edit"]').on('click', function () {
										$item = $(this).closest('.item');

										toggleLoadStatus(true);
										$.ajax({
											url: '/real_estates/_block_edit/' + $item.data('value'),
											dataType: 'JSON'
										}).always(function () {
											toggleLoadStatus(false);
										}).done(function (data) {
											if (data.status == 0) {
												startRealEstateCreateForm($(data.result), function () {
													realEstateFind();
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
							else {
								errorPopup();
							}
						}).fail(function () {
							errorPopup();
						})
					}
				}

			// / Init real-estate list

			// Real-estate create form

				function startRealEstateCreateForm($form, done) {
					var $popup = popupFull({
						html: $form,
						width: 'maximum',
						esc: false
					});

					// Position

						var 
							loadImage = new Image(),
							$svg = $('#block_floor_surface'),
							selectedBlockFloorValue,
							$surfaceDescription = $('#block_floor_surface_description_id');

						// Values for save selected description each floor
						$surfaceDescription.data('values', {});

						loadImage.onload = function () {
							var image = document.createElementNS("http://www.w3.org/2000/svg", "image");

							image.setAttribute('width', this.width);
							image.setAttribute('height', this.height);
							$svg.attr({
								width: this.width,
								height: this.height
							});
							image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);

							$svg.html(image);

							$(selectedBlockFloorValue.descriptions).each(function () {
								if (this.id == $surfaceDescription.val()) {
									var $polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

									$polyline.attr({
										points: this.points,
										stroke: '#ddd'
									});

									$polyline.css('fill', 'rgba(0, 166, 91, .3)');

									$svg.append($polyline).load();

									// Wait for loaded to get correct with of polyline
									lastWidth = -1;
									lastHeight = -1;
									interval = setInterval(function () {
										rect = $polyline[0].getBoundingClientRect();
										if (rect.width == lastWidth && rect.height == lastHeight) {
											// Loaded
											clearInterval(interval);

											$svgParent = $svg.parent();
											$svgParent.scrollLeft(($polyline.offset().left - $svgParent.offset().left + $svgParent.scrollLeft()) - ($svgParent.width() - rect.width) / 2);
											$svgParent.scrollTop(($polyline.offset().top - $svgParent.offset().top + $svgParent.scrollTop()) - ($svgParent.height() - rect.height) / 2);
										}
										lastWidth = rect.width;
										lastHeight = rect.height;
									}, 250);
								}
							});
						};

						$svg.on('click', function () {
							$html = $('<svg style="height: 90vh; width: 90vw"><g><g id="g"></g></g></svg>');
							$g = $html.find('#g');

							var $popup = popupFull({
								html: $html,
								id: 'select_position_popup',
								'z-index': 32,
								width: 'maximum'
							});

							$popup.find('.popup-content').css('overflow-y', 'hidden');

							var loadImage2 = new Image();
							loadImage2.onload = function () {
								var image = document.createElementNS("http://www.w3.org/2000/svg", "image");

								image.setAttribute('width', this.width);
								image.setAttribute('height', this.height);
								image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);

								$g.css('transform', 'translate(' + ($html.width() / 2 - this.width / 2) + 'px,' + ($html.height() / 2 - this.height / 2) + 'px)');

								$g.html(image);

								// Add description (just polyline because have only polyline)
								$(selectedBlockFloorValue.descriptions).each(function () {

									var $polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

									$g.append($polyline);

									$polyline.attr({
										points: this.points,
										stroke: '#ddd'
									});

									$polyline.data('id', this.id);

									switch (this.status) {
										case 'current':
											// Not change
											if ($surfaceDescription.val() == this.id) {
												$polyline.data('status', 'current').css('fill', 'rgba(0, 166, 91, .3)');
											}
											// Was changed
											else {
												$polyline.attr('data-empty', '').data('status', 'empty').css({
													fill: 'rgba(255, 255, 255, .3)',
													cursor: 'pointer'
												});
											}
											break;
										case 'empty':
											// Was changed
											if ($surfaceDescription.val() == this.id) {

												$polyline.data('status', 'current').css('fill', 'rgba(0, 166, 91, .3)');
											}
											// Not change
											else {
												$polyline.attr('data-empty', '').data('status', 'empty').css({
													'fill': 'rgba(255, 255, 255, .3)',
													'cursor': 'pointer'
												});
											}
											break;
										case 'used':
											$polyline.data('status', 'used').css('fill', 'rgba(255, 153, 0, .3)');
											break;
									}

									$g.append($polyline);

								});

								// / Add descriptions

								// Event

									$g.find('[data-empty]').on('click', function () {
										$p = $(this);
										$surfaceDescription.val($p.data('id')).change();
										$popup.off();

										var $polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

										$polyline.attr({
											points: $p.attr('points'),
											stroke: '#ddd'
										});

										$polyline.css('fill', 'rgba(0, 166, 91, .3)');

										$svg.find('polyline').remove();
										$svg.append($polyline);

										// Wait for loaded to get correct with of polyline
										lastWidth = -1;
										lastHeight = -1;
										interval = setInterval(function () {
											rect = $polyline[0].getBoundingClientRect();
											if (rect.width == lastWidth && rect.height == lastHeight) {
												// Loaded
												clearInterval(interval);

												$svgParent = $svg.parent();
												$svgParent.scrollLeft(($polyline.offset().left - $svgParent.offset().left + $svgParent.scrollLeft()) - ($svgParent.width() - rect.width) / 2);
												$svgParent.scrollTop(($polyline.offset().top - $svgParent.offset().top + $svgParent.scrollTop()) - ($svgParent.height() - rect.height) / 2);
											}
											lastWidth = rect.width;
											lastHeight = rect.height;
										}, 250);
									});

								// / Event
							}
							loadImage2.src = selectedBlockFloorValue.url;
						});

						$('#block_floor').on('change', function () {
							if (this.value) {
								selectedBlockFloorValue = $(this).find(':selected').data('value');
								loadImage.src = selectedBlockFloorValue.url;

								// Reselect description was select
								$surfaceDescription.val($surfaceDescription.data('values')[this.value] || '');
							}
						});

						selectedBlockFloorValue = $('#block_floor :selected').data('value');
						// If selected
						if (selectedBlockFloorValue) {
							loadImage.src = selectedBlockFloorValue.url;

							// Save if this was select description in floor
							$(selectedBlockFloorValue.descriptions).each(function () {
								if (this['status'] == 'current') {
									values = $surfaceDescription.data('values');
									values[$('#block_floor').val()] = this['id'];
									$surfaceDescription.data('values', values);
								}
							});
						}

					// / Position

					// Floor

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

					// / Floor

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

					initForm($form, {
						submit: function () {
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
									done();
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

		// / Real-estate group

	// / View

})