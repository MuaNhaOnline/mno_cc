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

			$viewPart.find('[aria-click="project_image_interact"]').on('click', function () {
				startDesign('project', project_id);
			});

			$viewPart.find('[aria-click="build_finish"]').on('click', function () {
				window.location = '/projects/set_finished_status/' + project_id;
			});

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

					/*
						Edit block
					*/

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

					/*
						/ Edit block
					*/

					/*
						Delete
					*/

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

					/*
						/ Delete
					*/

					/*
						Select
					*/

						$items.find('[aria-click="select_block"]').on('click', function () {
							var $item = $(this).closest('.item');

							if ($item.hasClass('active')) {
								return;
							}

							/*
								Change status
							*/

								$item.siblings('.active').removeClass('active');
								$item.addClass('active');

								$selectedBlockItem = $item;
								selectedBlockId = $item.data('value');

								$viewPart.find('.real-estate-container').show();

								$viewPart.find('#selected_block_name').text($item.find('[aria-object="name"]').text());

							/*
								Change status
							*/

							/*
								Get real-estates
							*/

								realEstateFind();

							/*
								/ Get real-estates
							*/
						});

					/*
						/ Select
					*/

					/*
						Interact image
					*/

						$items.find('[aria-click="image_interact"]').on('click', function () {
							startDesign('block', $(this).closest('.item').data('value'));
						});

					/*
						/ Interact image
					*/

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
										'Thêm bất động sản thuộc loại nào?' +
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

								// Image interact

									$realEstateList.find('[aria-click="image_interact"]').on('click', function () {
										startDesign('real_estate', $(this).closest('.tab-content').data('value'));
									});

								// / Image interact

								/*
									Delete
								*/

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

								/*
									Delete
								*/

								/*
									Edit
								*/

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

								/*
									/ Edit
								*/
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

		// / Real-estate

	// / View

	// Design

		var 
			$designPart = $('.create-details-container'),
			$selectDescriptionPart = $designPart.find('.select-description-container');
			loadImage = new Image(),
			$selectedItem = null,
			$svg = $designPart.find('#svg'),
			$g = $svg.find('#g'),
			tranX = 0,
			tranY = 0,
			scale = 1,
			isSelected = false, 
			isViewMoving = false,
			isMoveEditPoint = false;

		// Start

			function startDesign(type, id) {
				toggleLoadStatus(true);
				// Get images
				$.ajax({
					url: '/' + type + 's/get_image_for_interact_build/' + id,
					dataType: 'JSON'
				}).always(function () {
					toggleLoadStatus(false);
				}).done(function (data) {
					if (data.status == 0) {
						// Open
						$designPart.addClass('open').data({
							type: type,
							id: id
						});
						$body.addClass('no-scroll');
						$g.html('');

						var $imageList = $designPart.find('.image-list');

						// Create image list

							$imageList.html('');

							$(data.result).each(function () {
								var imageData = this;

								$item = $('<a class="item horizontal-item" data-id="' + imageData.id + '" data-url="' + imageData.url + '"></a>');
								$item.html('<img src="' + imageData.thumb_url + '" />');

								$item.data('descriptions', imageData.descriptions)

								$imageList.append($item);
							});

						// / Create image list

						// Item click event

							$imageList.children().on('click', function () {
								$item = $(this);

								if ($item.is('.active')) {
									return;
								}

								if ($selectedItem != null) {
									$selectedItem.removeClass('active');
									saveItem();
								}

								$item.addClass('active');
								loadItem($item);

								$selectedItem = $item;
							});

						// / Item click event

						initSelectDescription(type, id);
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			}

		// / Start

		// Save

			function saveItem() {
				descriptions = [];

				$g.find('[aria-object="object"]').each(function () {

					description = { 
						tag_name: this.tagName,
						description: $(this).data('description') || []
					}

					switch(this.tagName) {
						case 'polyline':
							description.points = this.getAttribute('points');
							break;
					}

					descriptions.push(description);
				});

				$selectedItem.data('descriptions', descriptions);
			}

			function saveAll() {
				// Get all data
				data = []
				$designPart.find('.image-list > a').each(function () {
					data.push({
						id: $(this).data('id'),
						descriptions: $(this).data('descriptions') || []
					});
				});

				// Post
				toggleLoadStatus(true);
				$.ajax({
					url: '/' + $designPart.data('type') + 's/save_interact_images',
					method: 'POST',
					data: { data: JSON.stringify(data) },
					dataType: 'JSON'
				}).always(function () {
					toggleLoadStatus(false);
				}).done(function (data) {
					if (data.status == 0) {
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			}

			// Save & exit button

				$designPart.find('[aria-click="save"]').on('click', function () {
					$designPart.removeClass('open');
					$body.removeClass('no-scroll');

					if ($selectedItem) {
						saveItem();
					}

					saveAll();
				});

			// / Save & exit button

		// / Save

		// Exit

			// Close button

				$designPart.find('[aria-click="exit"]').on('click', function () {
					$designPart.removeClass('open');
					$body.removeClass('no-scroll');
				});

			// / Close button

		// / Exit

		// Load

			function loadItem($item) {
				$g.html('').hide();
				loadImage.src = $item.data('url');

				descriptions = $item.data('descriptions') || [];

				$(descriptions).each(function () {
					switch(this.tag_name) {
						case 'polyline':
							addPolyline({
								points: this.points,
								description: this.description
							});
							break;
					}
				});
			}

		// / Load

		// Add object

			// params: points(*), description
			function addPolyline(params) {
				var $polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

				// Create polyline

					$g.append($polyline);

					$polyline.attr({
						'aria-object': 'object',
						points: params.points,
						tabindex: 0
					});

					$polyline.css({
						stroke: '#000',
						outline: 'none'
					});

					$polyline.data('description', params.description || {})
					
					if ($polyline.data('description').type) {
						$polyline.css('fill', 'rgba(0, 166, 91, .3)');
					}
					else {
						$polyline.css('fill', 'rgba(255, 255, 255, .3)');
					}

				// / Create polyline

				// Methods

					$polyline.data('remove_method', function () {
						removeEditPoints();
						$polyline.remove();
					});

					$polyline.data('start_edit_method', function () {
						// Remove current edit points
						removeEditPoints();

						// Edit point
						var points = $polyline.attr('points').split(' ').map(function (value) {
							value = value.split(',');
							return { x: value[0], y: value[1] }
						});
						
						// Create edit point events
						$(points).each(function (index) {
							// Skip last
							if (index == points.length - 1) {
								return;
							}

							// Add points
							var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
							circle.setAttribute('cx', this.x);
							circle.setAttribute('cy', this.y);
							circle.setAttribute('r', 5 / scale);
							circle.setAttribute('aria-object', 'edit_point');
							circle.style.stroke = '#000';
							circle.style.fill = '#fff';
							circle.style.cursor = 'pointer';
							$(circle).data('index', index).on({
								mousedown: function (e) {
									isMoveEditPoint = true;

									init = { x: parseInt(circle.getAttribute('cx')), y: parseInt(circle.getAttribute('cy')) };
									start = getPosition(e);
									pointIndex = $(this).data('index');

									$svg.on({
										'mousemove.move_point': function (e) {
											if (isViewMoving) {
												return;
											}

											current = getPosition(e);

											points[pointIndex].x = init.x + current.x - start.x;
											points[pointIndex].y = init.y + current.y - start.y;

											if (pointIndex == 0) {
												points[points.length - 1] = points[pointIndex];
											}

											circle.setAttribute('cx', points[pointIndex].x);
											circle.setAttribute('cy', points[pointIndex].y);

											$polyline.attr('points', points.map(function (value) {
												return value.x + ',' + value.y;
											}).join(' '))
										},
										'mouseup.move_point': function (e) {
											isMoveEditPoint = false;
											$svg.off('.move_point');
										}
									})
								}
							});

							$g.append(circle);
						});
					})

				// Methods

				// Events

					$polyline.on({
						mousedown: function(e) {
							if (e.button != 0) {
								return;
							}

							// Edit points
							first = true;
							moved = { x: 0, y: 0 };
							start = getPosition(e);

							$svg.on({

								// Move

									'mousemove.move_polyline': function (e) {
										if (isViewMoving) {
											return;
										}
										if (isSelected) {
											removeEditPoints();
											isSelected = false;
										}

										current = getPosition(e);
										$polyline.css('transform', 'translate(' + (moved.x = current.x - start.x) + 'px, ' + (moved.y = current.y - start.y) + 'px)');
									},
									'mouseup.move_polyline': function(e) {
										// Change all points
										$polyline.attr('points', $polyline.attr('points').split(' ').map(function (value) {
											value = value.split(',');
											return (parseInt(value[0]) + moved.x) + ',' + (parseInt(value[1]) + moved.y);
										}).join(' '));

										$polyline.css('transform', 'translate(0px, 0px)');
										$svg.off('.move_polyline');
										if ($(e.target).is($polyline) || $(e.target).is('[aria-object="edit_point"]')) {
											isSelected = true;
											$polyline.data('start_edit_method')();
										}
									}

								// / Move

							}).off('mouseup.end_edit_polyline').on({

								// Edit

								'mouseup.end_edit_polyline': function (e) {
									// if click outside of this polyline and end point
									if (!($(e.target).is($polyline) || $(e.target).is('[aria-object="edit_point"]'))) {
										isSelected = false;
										removeEditPoints();
										$svg.off('mouseup.end_edit_polyline .move_polyline');
										$document.off('.key_polyline');
									}
								}
							});
						},
						keydown: function (e) {
							// Delete
							if (e.keyCode == 46) {
								$polyline.data('remove_method')();
							}
						},
						focus: function () {
							isSelected = true;
							$polyline.data('start_edit_method')();
						},
						focusout: function () {
							if (isMoveEditPoint) {
								return;
							}
							isSelected = false;
							removeEditPoints();
						}
					});

					setContextMenuObject($polyline);

				// Events
			}

		// / Add object

		// General methods

			function removeEditPoints() {
				$g.find('[aria-object="edit_point"]').remove();
			}

			function getPosition(e) {
				return {
					x: (e.clientX - tranX) / scale,
					y: (e.clientY - tranY) / scale
				}
			}

		// / General methods

		// Paint

			// View, tool

				/*
					General
				*/

					// Polyline
					var
						polyline = null,
						points = '',
						circle;

				/*
					/ General
				*/

				/*
					Move, zoom
				*/

					// Mouse wheel always zoom
					$svg.on({
						mousewheel: function (e) {
							isUp = e.originalEvent.wheelDelta < 0;

							if (isUp) {
								if (scale < 0.5) {
									return;
								}
								scale -= 0.1;
							}
							else {
								if (scale > 2) {
									return;
								}
								scale += 0.1;
							}

							tranX = -(e.clientX - $svg.offset().left) * (scale - 1);
							tranY = -(e.clientY - $svg.offset().top) * (scale - 1);

							updateViewBox();
						},
						focus: function() {
							// Hold spacebar to move
							$document.on('keydown.move_view', function (e) {
								if (!isViewMoving && e.keyCode == 32) {
									isViewMoving = true;

									var
										start = null,
										moved = { x: 0, y: 0 };

									$svg.on({
										'mousemove.move_view': function (e) {
											if (start == null) {
												start = { 
													x: e.offsetX, 
													y: e.offsetY 
												};
											}

											moved.x = e.offsetX - start.x; 
											moved.y = e.offsetY - start.y;

											updateViewBoxWithValue(
												tranX + moved.x, 
												tranY + moved.y, 
												scale
											);
										}
									}).css('cursor', 'move');

									$document.on('keyup.move_view', function () {
										isViewMoving = false;

										tranX += moved.x;
										tranY += moved.y;

										updateViewBox();

										$svg.off('.move_view').css('cursor', 'default');
										$document.off('keyup.move_view');
									});
								}
							});
						},
						focusout: function () {
							$document.off('move_view');
						}
					}).attr('tabindex', '0').css('outline', '0');

					function updateViewBox() {
						$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
						$g.find('[aria-object="edit_point"]').attr('r', 5 / scale); }

					function updateViewBoxWithValue(tranX, tranY, scale) {
						$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
					}

				/*
					/ Move, zoom
				*/

				/*
					Paint
				*/

					$('.toolbox-container').find('[aria-type="tool"]').on('click', function () {
						if ($(this).hasClass('active')) {
							return;
						}
						$(this).addClass('active').siblings('[aria-type="tool"].active').removeClass('active').trigger('end');
					});

					// Polyline

						function startPolyline() {
							polyline = null;
							points = '';

							$g.on({
								'click.polyline': function (e) {
									if (isSelected) {
										return;
									}
									pos = getPosition(e);

									if (polyline == null) {
										// Begin
										points = pos.x + ',' + pos.y;

										// Start point
										polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
										polyline.setAttribute('points', points);
										polyline.style.stroke = '#000';
										polyline.style.fill = 'rgba(255, 255, 255, .5)';
										$g.append(polyline);

										// End point
										circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
										circle.setAttribute('cx', pos.x);
										circle.setAttribute('cy', pos.y);
										circle.setAttribute('r', 10);
										circle.style.stroke = '#000';
										circle.style.fill = '#fff';
										circle.style.cursor = 'pointer';
										$g.append(circle);

										// Display line on move
										$g.on('mousemove.polyline', function (e) {
											if (isViewMoving) {
												return;
											}
											pos = getPosition(e);
											polyline.setAttribute("points", points + ' ' + pos.x + ',' + pos.y);
										});

										// Click to end point => finish
										$(circle).on('click', function (e) {
											// For stop create next point
											e.stopPropagation();

											// Stop envent
											$g.off('mousemove.polyline');

											// Create end point
											points += ' ' + circle.getAttribute('cx') + ',' + circle.getAttribute('cy');
											polyline.setAttribute('points', points);

											addPolyline({
												points: points
											});

											endPolyline();
										});

										// Esc to end
										$document.on('keydown.create_polyline', function (e) {
											if (e.keyCode == 27) {
												$g.off('mousemove.polyline');
												endPolyline();
											}
										})
									}
									else {
										// New point
										points += ' ' + pos.x + ',' + pos.y;
										polyline.setAttribute("points", points);
									}
								}
							});
						}

						function endPolyline(isTerminate) {
							if (polyline != null) {
								points = '';
								polyline.remove();
								circle.remove();
								polyline = null;
								circle = null;
							}

							if (isTerminate) {
								$g.off('.polyline');
							}
						}

						$('[aria-click="polyline"]').on({
							click: function () {
								startPolyline();
							},
							end: function () {
								endPolyline(true);
							}
						});

					// / Polyline

				/*
					/ Paint
				*/

				loadImage.onload = function() {
					image = document.createElementNS("http://www.w3.org/2000/svg", "image");
					image.setAttribute('width', this.width);
					image.setAttribute('height', this.height);
					image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);
					$g.prepend(image);
					tranX = $svg.width() / 2 - this.width / 2;
					tranY = $svg.height() / 2 - this.height / 2;
					scale = 1;
					updateViewBox();
					$g.show();
				}

			// / View, tool

			// Item

				$('.items-container .item-container').each(function () {
					var 
						$itemListPanel = $(this),
						$itemList = $itemListPanel.children();

					$itemListPanel.on({
						mouseenter: function () {
							$(this).addClass('show').siblings('.show').removeClass('show').scrollLeft(0);
						},
						mouseover: function (e) {
							var 
								scrollableWidth = $itemList[0].getBoundingClientRect().width - $itemListPanel[0].getBoundingClientRect().width,
								offsetLeft = $itemListPanel.offset().left
								panelWidth = $itemListPanel.width() - 100;

							if (scrollableWidth > 0) {
								$itemListPanel.on({
									mousemove: function (e) {
										var position = e.clientX - offsetLeft - 50;
										$itemListPanel.scrollLeft(scrollableWidth * (position / panelWidth));
									}
								})
							}
						},
						mouseout: function () {
							$itemListPanel.off('mousemove');
						}
					});
				});

			// / Item

		// / Paint

		// Description

			$selectDescriptionPart.find('.close-popup').on('click', function () {
				closeSelectDescription();
			});

			_initTabContainer($selectDescriptionPart.find('.free-style-tab-container'));

			function initSelectDescription(type, id) {

				// Get description objects

					// Blocks
					if (type == 'project' || type == 'block') {
						$.ajax({
							url: '/blocks/_description_item_list/' + project_id,
							dataType: 'JSON'
						}).done(function (data) {
							if (data.status == 0) {
								var $list = $('#block_description_list');
								$list.html(data.result).find('.item').on('click', function () {
									$item = $(this);

									$list.find('.active').removeClass('active');
									$item.addClass('active');
								});
								$('#group_description_list').find('[aria-name="block"]').show();
							}
						}).fail(function () {
							errorPopup();
						});
					}
					else {
						$('#group_description_list').find('[aria-name="block"]').hide();
					}

					// Real-estates
					if (type == 'block') {
						$.ajax({
							url: '/real_estates/_block_description_item_list/' + id,
							dataType: 'JSON'
						}).done(function (data) {
							if (data.status == 0) {
								var $list = $selectDescriptionPart.find('#real_estate_description_list');
								$list.html(data.result).find('.item').on('click', function () {
									$item = $(this);

									$list.find('.tab-content .active').removeClass('active');
									$item.addClass('active').closest('.tab-content').addClass('active');
								});
								_initTabContainer($list.find('.free-style-tab-container'));

								$('#group_description_list').find('[aria-name="real_estate"]').show();
							}
						}).fail(function () {
							errorPopup();
						});
					}
					else {
						$('#group_description_list').find('[aria-name="real_estate"]').hide();
					}

				// / Get description objects

				// Events

					$selectDescriptionPart.find('[aria-click="close"]').on('click', function () {
						closeSelectDescription();
					});

				// / Events

			}

			function openSelectDescription(params) {
				$selectDescriptionPart.addClass('open');

				// Close event

					$document.on('keydown.close_select_description', function (e) {
						if (e.keyCode == 27) {
							e.preventDefault();
							closeSelectDescription();
						}
					})

				// / Close event

				// Save

					$selectDescriptionPart.find('[aria-click="save"]').off('click').on('click', function () {
						// Get description
						description = {};
						switch ($('#group_description_list [aria-name].active').attr('aria-name')) {
							case 'block':
								$selected = $('#block_description_list').find('.item.active');
								if ($selected.length != 0) {
									description.type = 'block';
									description.id = $selected.data('value');
									returnResult();
								}
								else {
						      popupPrompt({
						        title: 'Xác nhận',
						        content: 'Chưa có block được chọn. Sẽ không có đối tượng được mô tả. Bạn vẫn muốn tiếp tục?',
						        type: 'warning',
						        buttons: [
						          {
						            text: 'Tiếp tục',
						            type: 'primary',
						            primaryButton: true,
						            handle: function () {
													returnResult();
						            }
						          },
						          {
						            text: 'Quay lại'
						          }
						        ]
						      })
								}
								break;
							case 'real_estate':
								$selected = $('#real_estate_description_list').find('.item.active:visible');
								if ($selected.length != 0) {
									description.type = 'real_estate';
									description.id = $selected.data('value');
									returnResult();
								}
								else {
						      popupPrompt({
						        title: 'Xác nhận',
						        content: 'Chưa có bất động sản được chọn. Sẽ không có đối tượng được mô tả. Bạn vẫn muốn tiếp tục?',
						        type: 'warning',
						        buttons: [
						          {
						            text: 'Tiếp tục',
						            type: 'primary',
						            primaryButton: true,
						            handle: function () {
													returnResult();
						            }
						          },
						          {
						            text: 'Quay lại'
						          }
						        ]
						      })
								}
								break;
							case 'text_image':
								var $form = $('#text_image_description_form');
								description.type = 'text_image';
								description.data = $form.serialize();
								description.preview_list = $form.find('.preview-list');
								description.description = $form.find('[name="description"]').val();
								returnResult();
								break;
							default:
								returnResult();
								break;
						}

						function returnResult() {
							if (typeof params['save'] == 'function') {
								params['save'](description);
							}
							closeSelectDescription();
						}
					});

				// / Save

				// Set value

					$form = $('<form class="form" id="text_image_description_form">' +
	    			'<article class="form-group">' +
	    				'<label class="control-label">' +
	    					'Mô tả' +
	    				'</label>' +
	    				'<textarea class="form-control" name="description"></textarea>' +
	    			'</article>' +
	    			'<article class="form-group">' +
	    				'<label class="control-label">' +
	    					'Hình ảnh' +
	    				'</label>' +
	    				'<input class="file-upload" type="file" multiple name="images[]" data-amount="5" data-has_description data-has_avatar data-has_order />' +
	    			'</article>' +
	    		'</form>')
					$('#text_image_description_form_container').html($form);	
					initForm($form);

					description = params['description'] || {};
					$selectDescriptionPart.data('description', description).find('.active').removeClass('active');

					switch (description['type']) {
						case 'block':
							$('#group_description_list').find('[aria-name="block"] [aria-click="change_tab"]').click();
							$('#block_description_list').find('[data-value="' + description['id'] + '"]').addClass('active').closest('.box').addClass('active');
							break;
						case 'real_estate':
							$('#group_description_list').find('[aria-name="real_estate"] [aria-click="change_tab"]').click();
							tabContentName = $('#real_estate_description_list').find('[data-value="' + description['id'] + '"]').addClass('active').closest('.tab-content').attr('aria-name');
							$('#real_estate_description_list').find('.tab-list [aria-name="' + tabContentName + '"] [aria-click="change_tab"]').click();
							break;
						case 'text_image':
							if (typeof description['preview_list'] == 'undefined') {
								$form.find('.file-upload').attr('data-init-value', description['data']['images']).trigger('initValue');
								$form.find('[name="description"]').val(description['data']['description']);
							}
							else {
								$form.find('.preview-list').html(description['preview_list'].html());
								$form.find('.file-upload').trigger('initItem');
								$form.find('[name="description"]').val(description['description']);
							}
							$('#group_description_list').find('[aria-name="text_image"] [aria-click="change_tab"]').click();
							break;
						default:
							$('#group_description_list').find('[aria-name="text_image"] [aria-click="change_tab"]').click();
							break;
					}

				// / Set value

			}

			function closeSelectDescription() {
				$selectDescriptionPart.removeClass('open');
			}

		// / Description

		// Context menu

			function setContextMenuObject($object) {
				$object.on('contextmenu', function (e) {
					e.preventDefault();

					var $contextMenu = $('<article class="context-menu-container" style="top: ' + e.pageY + 'px; left: ' + e.pageX + 'px"></article>');
					$contextMenu.html(
						'<ul>' +
							'<li>' +
								'<a aria-click="description">' +
									'Mô tả' +
								'</a>' +
							'</li>' +
							'<li>' +
								'<a aria-click="delete">' +
									'Xóa' +
								'</a>' +
							'</li>' +
						'</ul>'
					);

					// Description

						$contextMenu.find('[aria-click="description"]').on('click', function () {
							openSelectDescription({
								save: function (data) {
									$object.data('description', data);
									if ($.isEmptyObject(data)) {
										$object.css('fill', 'rgba(255, 255, 255, .3)');
									}
									else {
										$object.css('fill', 'rgba(0, 166, 91, .3)');
									}
								},
								description: $object.data('description')
							});
						});

					// / Description

					// Delete

						$contextMenu.find('[aria-click="delete"]').on('click', function () {
							$object.data('remove_method')();
						});

					// / Delete

					$body.append($contextMenu);

					$document.click().on({
						'click.context-menu': function () {
							$contextMenu.remove();
							$document.off('.context-menu');
						},
						'keydown.context-menu': function (e) {
							if (e.keyCode == 27) {
								$contextMenu.remove();
								$document.off('.context-menu');	
							}
						}
					});
				})
			}

		// / Context menu

	// / Design

})