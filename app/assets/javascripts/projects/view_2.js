var projectId;

$(function () {

	_initTabContainer($('.free-style-tab-container'));
	$('.utilities .manual-horizontal-list').each(function (index) {
		_initManualHorizontalList($(this), {
			col_full_width: true,
			auto_next: 5000,
			auto_next_delay: index * 2000
		});
	});

	// Side bar
	
		(function () {
			var 
				lastScrollTop = $window.scrollTop(),
				isScrolling = false,
				$sideBar = $('#side_bar'),
				$contentPanel = $('#content_panel'),
				$focusingBox = [];

			// Scroll
			
				$window.on('scroll', function () {
					if (!isScrolling) {
						scrollTop = $window.scrollTop();
						// If (scroll down)
						if (scrollTop > lastScrollTop) {
							// If scroll down from cover
							if (lastScrollTop < $window.height()) {
								isScrolling = true;
								$sideBar.addClass('bottom').removeClass('top');
								$('html,body').animate({
									scrollTop: $window.height()
								}, 200, function () {
									isScrolling = false;
									lastScrollTop = $window.height();
								});
							}
						}
						// Else (scroll up)
						else {
							// If scroll up from content to cover
							if (scrollTop < $window.height()) {
								isScrolling = true;
								$sideBar.addClass('top').removeClass('bottom');
								$('html,body').animate({
									scrollTop: 0
								}, 200, function () {
									isScrolling = false;
									lastScrollTop = 0;
									$focusingBox = [];
									$sideBar.find('.navigator .active').removeClass('active');
								});
							}	
						}
					}
				});

				if ($window.scrollTop() < $window.height()) {
					$sideBar.addClass('top').removeClass('bottom');
				}
				else {
					$sideBar.addClass('bottom').removeClass('top');
				}

			// / Scroll

			// Active content
				
				$sideBar.find('.navigator [aria-name]').on('click', function () {
					$item = $(this);

					$item.parent().addClass('active').siblings('.active').removeClass('active');

					$focusingBox = $contentPanel.find('.box[aria-name="' + $item.attr('aria-name') + '"]');

					isScrolling = true;
					$sideBar.addClass('bottom').removeClass('top');
					$('html,body').animate({
						scrollTop: $focusingBox.offset().top
					}, 200, function () {
						isScrolling = false;
					});
				});

				$window.on('scroll', function () {
					if (!isScrolling) {
						// If focus nothing => read all
						if ($focusingBox.length == 0) {
							$contentPanel.find('.box[aria-name]').each(function () {
								$box = $(this);
								if (canSee($box)) {
									$sideBar.find('.navigator [aria-name="' + $box.attr('aria-name') + '"]').parent().addClass('active');
									$focusingBox = $box;
									return false;
								}
							});
						}
						else {
							scrollTop = $window.scrollTop();

							$checkBox = scrollTop > lastScrollTop ? $focusingBox.next() : $focusingBox.prev();
							if (canSee($checkBox)) {
								$sideBar.find('.navigator .active').removeClass('active');
								$sideBar.find('.navigator [aria-name="' + $checkBox.attr('aria-name') + '"]').parent().addClass('active');
								$focusingBox = $checkBox;
							}
						}
					}
				});
			
			// / Active content

			$window.on('scroll', function () {
				lastScrollTop = $window.scrollTop();
			});
		})()
	
	// / Side bar

	// Map

		$map = $('#map');
		initMap($map[0], {
			markers: [
				{
					latLng: {
						lat: $map.data('lat'),
						lng: $map.data('long')
					}
				}
			]
		});

		/*
			params:
				id(*)
				params:
					zoom: 17
					center: {}
						lat: first_market || 10.771528380460218
						lng: first_market || 106.69838659487618
					markers: [{
						latLng: {
							lat: ...
							lng: ...
						}
					}]
		*/
		function initMap(element, params) {
			if (typeof params === 'undefined') {
				params = {}
			}

			var options = {
				scrollwheel: false
			};

			options.zoom = params.zoom || 14;

			if ('center' in params ) {
				options.center = params.center
			}
			else if ('markers' in params && params.markers.length > 0) {
				options.center = { lat: params.markers[0].latLng.lat, lng: params.markers[0].latLng.lng };
			}
			else {
				options.center = { lat: 10.771528380460218, lng: 106.69838659487618 }; 
			}

			var map = new google.maps.Map(element, options);

			$(params.markers).each(function () {
				new google.maps.Marker({
					position: this.latLng,
					map: map,
					title: this.title || '...'
				});
			})

			$(element).on({
				'focus, click': function () {
					map.setOptions({'scrollwheel': true});
				},
				focusout: function () {
					map.setOptions({'scrollwheel': false});
				}
			}).attr('tabindex', '0').css('outline', '0');

			return map;
		}

	// / Map

	// Utilities

		$('.utilities').each(function () {
			$container = $(this);

			var 
				$listPanel = $container.find('.list-panel'),
				$list = $container.find('.list'),
				$imageList = $container.find('.image-list');
				$img = $container.find('.image-panel img');

			// Click event
			
				$list.find('.item').on('click', function () {
					$item = $(this);

					if ($item.hasClass('active')) {
						return;
					}

					$item.siblings('.active').removeClass('active');
					$item.addClass('active');

					// Create images list
					
						$imageList.html('');
						$($item.data('images')).each(function () {
							$itemList = $('<li><a><span></span></a></li>');
							$itemList.data('value', this);
							$imageList.append($itemList);
						});

						if ($imageList.children().length == 1) {
							$imageList.hide();
						}
						else {
							$imageList.show();
						}

						$imageList.children().on('click', function () {
							$itemList = $(this);
							if ($itemList.hasClass('active')) {
								return;
							}
							$itemList.siblings('.active').removeClass('active');
							$itemList.addClass('active');
							$img.attr('src', $itemList.data('value').url);
						}).first().click();
					
					// / Create images list
					
				}).first().click();
			
			// / Click event

			// Scroll event
			
				$listPanel.on('mousewheel', function (e) {
					lastScrollTop = $listPanel.scrollTop();

					$listPanel.scrollTop($listPanel.scrollTop() - e.originalEvent.wheelDeltaY);

					if ($listPanel.scrollTop() != lastScrollTop) {
						e.preventDefault();
					}
				});
			
			// / Scroll event
		});

	// / Utilities

	// Interact image
		
		var 
			interactImageCount = 0,
			interactData = {},
			navigatorData = {};

		function initInteractImage($container) {

			// General

				var 
					$g = $container.find('[aria-object="g"]'),
					$svg = $g.closest('svg'),
					$imageList = $container.find('[aria-object="image-list"]'),
					loadImage = new Image(),
					tranX = 0,
					tranY = 0,
					scale = 1,

					$pattern = $container.find('[aria-object="pattern-image"]'),
					patternImage = $pattern.find('image')[0],

					history = [],
					$imagePanel = $container.find('.image-panel'),
					$backButton = $container.find('[aria-click="back_to_prev"]'),
					$infoPanel = $container.find('[aria-object="info-panel-interact"]'),
					$infoPanelContent = $infoPanel.find('.content'),
					$navigatorPanel = $container.find('.navigator'),

					viewByType = '',
					viewById,
					viewByName;

				$pattern.attr('id', 'pattern' + (++interactImageCount));

				$backButton.hide();

				function setInteractEvent($container) {
					$container.find('[aria-click="interact"]').on('click', function () {						
						$button = $(this);

						if (!$button.data('value')) {
							return;
						}

						type = $button.data('type');
						id = $button.data('value');

						params = {}
						if ($button.data('data')) {
							params['data'] = $button.data('data');
						}

						params['text'] = $button.text();

						startInteractImage(type, id, params);
					});
				}

				setInteractEvent($navigatorPanel);

			// / General

			// Start new

				var startInteractImage = function(type, id, params) {
					if (typeof params == 'undefined') {
						params = {}
					}
					if (params['reset']) {
						history = [];
						delete params['reset'];
					}

					// Set view by
						
						// View was set view by
						// => if view project/block => unset view by
						if (viewByType && (type == 'project' || type == 'block')) {
							viewByType = '';
						}
						else {
							// => if view by group && view group => view by group (change group)
							if (type == 'real_estates/group' && (!viewByType || viewByType == 'group')) {
								viewByType = 'group';
								viewById = id;
								viewByName = params['text'] || '';
							}
							// => if view by floor & view floor => view by floor (change floor)
							if (type == 'blocks/floor' && (!viewByType || viewByType == 'floor')) {
								viewByType = 'floor';
								viewById = id;
								viewByName = params['text'] || '';
							}
						}

					// / Set view by

					// Get data
					if ((type + '/' + id) in interactData) {
						history.push(interactData[type + '/' + id]);
						createInteractImage();
					}
					else {
						$.ajax({
							url: '/' + type + 's/get_data_for_interact_view/' + id,
							data: params['data'] || {},
							dataType: 'JSON'
						}).done(function (data) {
							if (data.status == 0) {
								interactData[type + '/' + id] = {
									type: type,
									id: id,
									data: data.result
								};

								history.push(interactData[type + '/' + id]);
								createInteractImage();
							}
							else {
								errorPopup();
							}
						}).fail(function () {
							errorPopup();
						});
					}
				}

				function getNavigatorData(type, id, done, params) {
					if (typeof params == 'undefined') {
						params = {}
					}

					// Get data
					if ((type + '/' + id) in navigatorData) {
						done(navigatorData[type + '/' + id]);
					}
					else {
						$.ajax({
							url: '/' + type + 's/get_options_for_interact_view/' + id,
							data: params['data'] || {},
							dataType: 'JSON'
						}).done(function (data) {
							if (data.status == 0) {
								navigatorData[type + '/' + id] = data.result;
								done(navigatorData[type + '/' + id]);
							}
							else {
								errorPopup();
								done([]);
							}
						}).fail(function () {
							errorPopup
							done([]);
						});
					}
				}

				function createInteractImage() {
					id = history[history.length - 1].id;
					type = history[history.length - 1].type;
					data = history[history.length - 1].data;
					if (history.length > 1) {
						$backButton.show();
					}
					else {
						$backButton.hide();
					}

					// Create image list

						$imageList.html('');

						$(data.images).each(function () {
							var $item = $('<li><a><span></span></a></li>');

							$item.data('value', this);

							$imageList.append($item);
						});

						if (data.images.length >= 2) {
							$imageList.show();
						}
						else {
							$imageList.hide();
						}

						$firstItem = $imageList.find('li').on('click', function () {
							$item = $(this);

							if ($item.hasClass('active')) {
								return;
							}

							$item.siblings('.active').removeClass('active');
							$item.addClass('active');

							showImage($item.data('value'));
						}).first();

						$firstItem.addClass('active');
						showImage($firstItem.data('value'));

					// / Create image list

					// Create info

						$infoPanelContent.html(data.info);
						setInteractEvent($infoPanel);
						if (!$infoPanel.hasClass('active')) {
							$infoPanel.click();
						}

					// / Create info

					// Create navigator

						if (viewByType == 'group') {
							data.navigator.group = {
								id: viewById,
								name: viewByName
							}
						}
						else if (viewByType == 'floor') {
							data.navigator.floor = {
								id: viewById,
								name: viewByName
							}
						}

						$navigatorPanel.find('[aria-name].active').removeClass('active');

						$block = $navigatorPanel.find('[aria-name="block"]');
						$group = $navigatorPanel.find('[aria-name="group"]');
						$floor = $navigatorPanel.find('[aria-name="floor"]');
						$re = $navigatorPanel.find('[aria-name="real_estate"]');
						$position = $navigatorPanel.find('[aria-name="position"]');
					
						// Project
						
							if (type == 'project') {
								$navigatorPanel.find('[aria-name="project"]').addClass('active');
							}
							getNavigatorData('block', projectId, function (navData) {
								$html = $(
									'<section class="options-container">' + 
										'<article class="options">' + 
											'<article class="col">' +
												navData.map(function (value) {
													return (
														'<a class="' + (data.navigator.block && data.navigator.block.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="block" data-value="' + value.id + '">' +
															value.name +
														'</a>'
													);
												}).join('') +
											'</article>' +
										'</article>' +
									'</section>'
								);
								setInteractEvent($html);
								$block.removeClass('unactive');
								$block.find('.options-container').remove();
								$block.append($html);
							});
						
						// / Project
					
						// Block

							if (data.navigator.block) {
								$block.find('> a').text(data.navigator.block.name).data('value', data.navigator.block.id);

								if (type == 'block') {
									$block.addClass('active');
								}

								// Group
								
									createGroupHtmlMethod = null;

									// If view by floor => check if group have in floor
									if (viewByType == 'floor') {
										createGroupHtmlMethod = function (value) {
											if (value.floor_ids.indexOf('|' + viewById + '|') != -1) {
												return (
													'<a class="' + (data.navigator.group && data.navigator.group.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="real_estates/group" data-value="' + value.id + '">' +
														value.name +
													'</a>'
												);
											}
											else {
												return '';
											}
										}
									}
									else {
										createGroupHtmlMethod = function (value) {
											return (
												'<a class="' + (data.navigator.group && data.navigator.group.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="real_estates/group" data-value="' + value.id + '">' +
													value.name +
												'</a>'
											);
										}
									}
									getNavigatorData('real_estates/group', data.navigator.block.id, function (navData) {
										$html = $(
											'<section class="options-container">' + 
												'<article class="options">' + 
													'<article class="col">' +
														navData.map(function (value) {
															return createGroupHtmlMethod(value);
														}).join('') +
													'</article>' +
												'</article>' +
											'</section>'
										);
										$group.removeClass('unactive');
										$group.find('.options-container').remove();
										$group.append($html);
										setInteractEvent($html);
									});
								
								// / Group

								// Floor
									
									createFloorHtmlMethod = null;

									// If view by group => check if floor have group
									if (viewByType == 'group') {
										createFloorHtmlMethod = function (value) {
											if (value.group_ids.indexOf('|' + viewById + '|') != -1) {
												return (
														'<a class="' + (data.navigator.floor && data.navigator.floor.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="blocks/floor" data-value="' + value.id + '">' +
															value.name +
														'</a>'
												);
											}
											else {
												return '';
											}
										}
									}
									else {
										createFloorHtmlMethod = function (value) {
											return (
													'<a class="' + (data.navigator.floor && data.navigator.floor.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="blocks/floor" data-value="' + value.id + '">' +
														value.name +
													'</a>'
											);
										}
									}
									getNavigatorData('blocks/floor', data.navigator.block.id, function (navData) {
										$html = $(
											'<section class="options-container">' + 
												'<article class="options">' + 
													'<article class="col">' +
														navData.map(function (value) {
															return createFloorHtmlMethod(value);
														}).join('') +
													'</article>' +
												'</article>' +
											'</section>'
										);
										$floor.removeClass('unactive');
										$floor.find('.options-container').remove();
										$floor.append($html);
										setInteractEvent($html);
									});
								
								// / Floor

								// Set position group & floor
								
									// If have floor but haven't group => push floor before group
									if (viewByType) {
										if (viewByType == 'floor') {
											$navigatorPanel.find('[aria-name="floor"]').after($navigatorPanel.find('[aria-name="group"]'));
										}
										else {
											$navigatorPanel.find('[aria-name="group"]').after($navigatorPanel.find('[aria-name="floor"]'));
										}
									}
								
								// / Set position group & floor
							}
							else {
								$block.find('> a').text('Chọn block').data('value', '');
								$group.addClass('unactive');
								$floor.addClass('unactive');
							}

						// / Block

						// Group, floor

							// Group
							if (data.navigator.group) {
								$group.find('> a').text(data.navigator.group.name).data('value', data.navigator.group.id);

								if (type == 'real_estates/group') {
									$group.addClass('active');
								}
							}
							else {
								$group.find('> a').text('Chọn nhóm').data('value', '');
							}
						
							// Floor
							if (data.navigator.floor) {
								$floor.find('> a').text(data.navigator.floor.name).data('value', data.navigator.floor.id);

								if (type == 'blocks/floor') {
									$floor.addClass('active');
								}
							}
							else {
								$floor.find('> a').text('Chọn tầng').data('value', '');
							}

							// Real estate
							if (data.navigator.group || data.navigator.floor) {
								checkReFunc = null;
								if (!data.navigator.group) {
									// By floor
									checkReFunc = function (re) {
										return re.floor_id == data.navigator.floor.id
									}
								}
								else if (!data.navigator.floor) {
									// By group
									checkReFunc = function (re) {
										return re.group_id == data.navigator.group.id
									}
								}
								else {
									// By both
									checkReFunc = function (re) {
										return re.floor_id == data.navigator.floor.id && re.group_id == data.navigator.group.id
									}
								}

								getNavigatorData('real_estate', data.navigator.block.id, function (navData) {
									$html = $(
										'<section class="options-container">' + 
											'<article class="options">' + 
												'<article class="col">' +
													navData.map(function (value) {
														if (checkReFunc(value)) {
															return (
																'<a class="' + (data.navigator.real_estate && data.navigator.real_estate.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="real_estate" data-value="' + value.id + '">' +
																	value.name +
																'</a>'
															);
														}
														else {
															return '';
														}
													}).join('') +
												'</article>' +
											'</article>' +
										'</section>'
									);
									setInteractEvent($html);
									$re.removeClass('unactive');
									$re.find('.options-container').remove();
									$re.append($html);
								});
							}
							else {
								$re.addClass('unactive');
							}

						// / Group, floor

						// Real estate

							if (data.navigator.real_estate) {
								$re.find('> a').text(data.navigator.real_estate.name).data('value', data.navigator.real_estate.id);

								if (type == 'real_estate') {
									$re.addClass('active');
								}

								getNavigatorData('real_estates/floor', data.navigator.real_estate.id, function (navData) {
									$html = $(
										'<section class="options-container">' + 
											'<article class="options">' + 
												'<article class="col">' +
													navData.map(function (value) {
														return (
															'<a class="' + (data.navigator.position && data.navigator.position.id == value.id ? 'active' : '') + '" aria-click="interact" data-type="real_estates/floor" data-value="' + value.id + '">' +
																value.name +
															'</a>'
														);
													}).join('') +
												'</article>' +
											'</article>' +
										'</section>'
									);
									setInteractEvent($html);
									$position.removeClass('unactive');
									$position.find('.options-container').remove();
									$position.append($html);
								});
							}
							else {
								$re.find('> a').text('Chọn sản phẩm').data('value', '');
								$position.addClass('unactive');
							}
						
						// / Real estate

						// Position
						
							if (data.navigator.position) {
								$position.find('> a').text(data.navigator.position.name).data('value', data.navigator.position.id);

								if (type == 'real_estates/floor') {
									$position.addClass('active');
								}
							}
							else {
								$position.find('> a').text('Chọn vị trí').data('value', '');
							}
						
						// / Position
					
					// / Create navigator

				}

			// / Start new

			// Show

				function showImage(value) {
					$g.html('').hide();
					loadImage.src = value.url;

					addDescription(value.descriptions);
				}

				(function () {
					loadImage.onload = function() {
						maxWidth = $svg.width();
						maxHeight = $svg.height();

						image = document.createElementNS("http://www.w3.org/2000/svg", "image");
						image.setAttribute('width', this.width);
						image.setAttribute('height', this.height);
						image.style['z-index'] = 2;
						image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);
						$g.prepend(image);

						patternImage.setAttribute('width', this.width);
						patternImage.setAttribute('height', this.height);
						patternImage.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);

						$pattern.attr({
							width: this.width,
							height: this.height
						});

						scale = 1;
						if (this.width > maxWidth) {
							scale = parseFloat(maxWidth) / this.width;
						}
						if (this.height > maxHeight) {
							scaleHeight = parseFloat(maxHeight) / this.height;
							if (scaleHeight < scale) {
								scale = scaleHeight;
							}
						}

						tranX = maxWidth / 2.0 - this.width * scale / 2.0;
						tranY = maxHeight / 2.0 - this.height * scale / 2.0;

						updateViewBox();

						$g.show();
					}
				})();

			// / Show

			// Description

				function addDescription(descriptions) {
					$(descriptions).each(function () {
						description_data = this;

						var $polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

						$g.append($polyline);

						$polyline.attr({
							'aria-object': 'description',
							points: description_data.points
						}).css({
							fill: 'url(#' + $pattern.attr('id') + ')',
							transition: '.3s',
							'transform-origin': '50% 50%',
							cursor: 'pointer'
						});

						if (description_data.status == 'highlight') {
							$polyline.css({
								fill: 'rgba(0, 166, 91, .3)',
								stroke: '#ddd'
							});
						}
						else {
							$polyline.on({
								mouseenter: function () {
									this.parentNode.appendChild(this); 
									setTimeout(function () {
										$polyline.css({
											transform: 'scale(1.05)'
										});
									})
								},
								mouseleave: function () {
									$polyline.css({
										transform: 'none'
									});
								},
								click: function () {
									switch (description_data.description.type) {
										case 'block':
										case 'real_estate':
											startInteractImage(description_data.description.type, description_data.description.id);
											break;
										default:
											break;
									}
								}
							})
						}
					});
				}

			// / Description

			// Tools

				// Move, zoom

					function updateViewBox() {
						$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
						$g.find('[aria-object="edit_point"]').attr('r', 5 / scale); }

					function updateViewBoxWithValue(tranX, tranY, scale) {
						$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
					}

				// / Move, zoom

			// / Tools

			// Buttons

				// $infoButton.on({
				// 	click: function (e) {
				// 		$infoPanel.addClass('active');

				// 		setTimeout(function () {
							$imagePanel.on({
								'click.active_info_panel': function () {
									$infoPanel.removeClass('active');
									$imagePanel.off('.active_info_panel');
								}
							})
				// 		});
				// 	}
				// });

				$infoPanel.on('click', function (e) {
					e.stopPropagation();
					if ($infoPanel.hasClass('active')) {
						return;
					}

					// Add class, animate
					$infoPanel.addClass('active');
					$infoPanel.animate({
						height: '100%'
					}, 200, function () {
						$infoPanel.animate({
							width: '300px'
						}, 100)
					});

					// Off event
					$imagePanel.add($imageList).on({
						'click.active_info_panel': function () {
							$infoPanel.removeClass('active');
							$infoPanel.animate({
								height: $infoPanel.find('.heading').outerHeight() + 'px'
							}, 200, function () {
								$infoPanel.animate({
									// 41: heading padding + 1 (for decimal)
									width: ($infoPanel.find('.title').outerWidth() + 41) + 'px'
								}, 100)
							});
							$imagePanel.add($imageList).off('.active_info_panel');
						}
					});
				});

				$backButton.on('click', function () {
					history.pop();
					createInteractImage();
				});

			// / Buttons

			return startInteractImage;
		};
	
	// / Interact image

	// Ground

		startGroundInteract = initInteractImage($('#ground_interact'));
		startGroundInteract('project', projectId);

	// / Ground

	// Product

		var 
			$productInteract = $('#product_interact'),
			$arrow = $productInteract.find('.arrow:eq(0)');
		startProductInteract = initInteractImage($productInteract);

		$('#products_container').find('.item-container').on('click', function () {

			var $item = $(this);

			// Call product interact
			
			// Find position
				$itemBefore = $item;
				$positionBefore = (findPosition = function ($checkItem) {
					// If this is empty => choose item before
					if ($checkItem.length == 0) {
						return $itemBefore;
					}

					// If this is product interact => next
					if ($checkItem.is('#productInteract')) {
						findPosition($checkItem.next());
					}

					// If this is a last child => choose
					if ($checkItem.is(':last-child')) {
						return $checkItem;
					}

					// If this is a new line => choose before
					if ($item.offset().top != $checkItem.offset().top) {
						return $itemBefore;
					}

					$itemBefore = $checkItem;

					return findPosition($checkItem.next());
				})($item.next());

			// / Find position
			
			// Append product
			
				startProductInteract('real_estates/group', $item.data('value'), {
					reset: true,
					text: $item.find('.title').text()
				});
				$itemBefore.after($productInteract.show());
				// Calc arrow position
				$arrow.css('left', $item.offset().left + ($item.width() / 2) + 2 - $productInteract.offset().left);
				// Scroll to panel
				$body.animate({
					scrollTop: $productInteract.offset().top - $window.height() * 0.1
				}, 100);
				
			// / Append product

		});

	// Product
})