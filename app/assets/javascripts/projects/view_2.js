var projectId, mainColor;

$(function () {
	$window.on('unload', function () {
		$window.scrollTop(0);
	});

	_initTabContainer($('.free-style-tab-container'));
	$('.utilities .manual-horizontal-list').each(function (index) {
		_initManualHorizontalList($(this), {
			col_full_width: true,
			auto_next: 5000,
			auto_next_delay: index * 2000
		});
	});

	// Main color
		
		(function () {
			var 
				brighten80 = tinycolor(mainColor).brighten(80).toString(),
				desaturate20 = tinycolor(mainColor).desaturate(20).darken(5).toString(),
				desaturate40 = tinycolor(mainColor).desaturate(40).darken(5).toString(),
				desaturate60 = tinycolor(mainColor).desaturate(60).darken(5).toString();

			$('header').append(
				'<style>' +
					'.side-bar .navigator li:hover:after {' +
						'background-color: ' + desaturate40 + ';' +
					'}' +
					'.content-panel .box .box-title {' +
						'background-color: ' + desaturate60 + ';' +
						'border-left-color: ' + desaturate40 + ';' +
						'border-right-color: ' + desaturate40 + ';' +
					'}' +
					'.content-panel .address .name {' +
						'background-color: ' + desaturate40 + ';' +
					'}' +
					'.content-panel .address .value {' +
						'background-color: ' + desaturate60 + ';' +
					'}' +
					'.content-panel .interact-image .navigator li.active > a {' +
						'border-bottom-color: ' + desaturate60 + ';' +
					'}' +
					'.content-panel .interact-image .info-panel .heading {' +
						'background-color: ' + desaturate40 + ';' +
						'border-bottom-color: ' + desaturate20 + ';' +
					'}' +
					'.interact-image .info-panel a {' +
						'background-color: ' + brighten80 + ';' +
					'}' +
					'.interact-image .images-list span {' +
						'background-color: ' + desaturate40 + ';' +
						'border-color: ' + desaturate60 + ';' +
					'}' +
					'.product-description .arrow {' +
						'border-bottom-color: ' + desaturate20 + ';' +
					'}' +
					'.product-description {' +
						'border-top-color: ' + desaturate20 + ';' +
					'}' +
					'.content-panel .free-style-tab-container .tab-list li.active a {' +
						'border-bottom-color: ' + desaturate60 + ';' +
					'}' +
					'.content-panel .btn {' +
						'background-color: ' + desaturate40 + ';' +
					'}' +
					'.content-panel .btn:hover, .content-panel .btn:focus {' +
						'background-color: ' + desaturate60 + ';' +
					'}' +
					'.content-panel .btn:active {' +
						'background-color: ' + desaturate20 + ';' +
					'}' +
					'.form-control:focus,' +
					'.has-success .form-control:focus,' +
					'.has-error .form-control:focus {' +
						'border-bottom-color: ' + desaturate60 + ';' +
					'}' +
				'</style>'
			);
		})();
	
	// / Main color

	// Cover page
		
		(function () {
			$('#side_bar').css({
				left: '-50px',
				opacity: '0'
			});

			$('#cover_content').css({
				bottom: '-100px',
				opacity: '0'
			});

			setTimeout(function () {
				$('#cover_image').css({
					filter: 'brightness(.5)',
					'-webkit-filter': 'brightness(.5)'
				});	

				setTimeout(function () {

					$('#cover_content').css({
						bottom: '0',
						opacity: '1'
					});

					setTimeout(function () {
						$('#side_bar').css({
							left: '0',
							opacity: '1'
						});
					}, 500);

				}, 500);

			}, 2000);
		})();
	
	// / Cover page

	// Side bar
	
		(function () {
			var 
				lastScrollTop = $window.scrollTop(),
				// Flag for dont check while scrolling
				isScrolling = false,
				$sideBar = $('#side_bar'),
				$contentPanel = $('#content_panel'),
				$focusingBox = [];

			// Scroll

				var 
					// 1: above, 2: middle, 3: below
					flag = -1;

				function fixedSideBar() {
					var scrollTop = $window.scrollTop();

					// Above content
					if (scrollTop < $contentPanel.offset().top) {
						// Scroll down => bottom
						if (scrollTop > lastScrollTop) {
							if (flag == 2) {
								return;
							}
							flag = 2;

							$sideBar.addClass('bottom').removeClass('top');
							$sideBar.css({
								position: 'fixed',
								top: '0'
							});

							_scrollTo($window.height(), {
								complete: function () {
									lastScrollTop = $window.height();
								}
							});
						}
						else {
							if (flag == 1) {
								return;
							}
							flag = 1;

							$sideBar.addClass('top').removeClass('bottom');
							$sideBar.css({
								position: 'fixed',
								top: '100px'
							});

							_scrollTo(0, {
								complete: function () {
									lastScrollTop = 0;
								}
							});
						}
					}
					// Content
					else if (scrollTop <= $contentPanel.offset().top + $contentPanel.height() - $sideBar.height()) {
						if (flag == 2) {
							return;
						}
						flag = 2;

						$sideBar.addClass('bottom').removeClass('top');
						$sideBar.css({
							position: 'fixed',
							top: '0'
						});
					}
					// Below content
					else {
						if (flag == 3) {
							return;
						}
						flag = 3;

						$sideBar.addClass('bottom').removeClass('top');
						$sideBar.css({
							position: 'absolute',
							top: ($contentPanel.offset().top + $contentPanel.height() - $sideBar.height()) + 'px'
						});
					}
				}

				$window.on('scroll', function () {
					if (_isSystemScroll) {
						return;
					}

					fixedSideBar();
				});


				fixedSideBar();

			// / Scroll

			// Active content
				
				$sideBar.find('.navigator [aria-name]').on('click', function () {
					$item = $(this);

					$item.parent().addClass('active').siblings('.active').removeClass('active');

					$focusingBox = $contentPanel.find('.box[aria-name="' + $item.attr('aria-name') + '"]');

					var
						offsetTop = $focusingBox.offset().top,
						maxScroll = $contentPanel.offset().top + $contentPanel.height() - $window.height();

					if (offsetTop > maxScroll) {
						offsetTop = maxScroll;
					}

					_scrollTo(offsetTop, {
						complete: function () {
							fixedSideBar();
						}
					});
				});

				$window.on('scroll', function () {
					if (!_isSystemScroll) {
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
							// Check if current is last or first => check if can't see => unactive
							if ($checkBox.length == 0) {
								if (!canSee($focusingBox)) {
									$sideBar.find('.navigator .active').removeClass('active');
									$focusingBox = $();
								}
							}
							else if (canSee($checkBox)) {
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
		_initMap('map', {
			markers: [
				{
					latLng: {
						lat: $map.data('lat'),
						lng: $map.data('long')
					}
				}
			]
		});

	// / Map

	// Utilities

		$('.utilities').each(function () {
			$container = $(this);

			var 
				$listPanel = $container.find('.list-panel'),
				$list = $container.find('.list'),
				$imageList = $container.find('.image-list');
				$img = $container.find('.image-panel img')
				$description = $container.find('.image-panel .description');

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

					// Update description

						if ($item.find('.description').text()) {
							$description.show().text($item.find('.description').text());
						}
						else {
							$description.hide();
						}
					
					// / Update description

					// Update color
					
						$listPanel.css('border-right-color', $item.data('color'));
						$description.css('background-color', $item.data('color'));
					
					// / Update color
					
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

		function initInteractImage($container, mainParams) {

			if (typeof mainParams == 'undefined') {
				mainParams = {};
			}

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
									data: data.result,
									text: params['text'] || ''
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
								viewByName = history[history.length - 1].text || '';
							}
							// => if view by floor & view floor => view by floor (change floor)
							if (type == 'blocks/floor' && (!viewByType || viewByType == 'floor')) {
								viewByType = 'floor';
								viewById = id;
								viewByName = history[history.length - 1].text || '';
							}
						}

					// / Set view by

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

						// Register
						
							{
								var
									$button = $infoPanel.find('[aria-click="register"]'),
									requestInfo = $button.data('request_info'),
									contactInfo = $button.data('contact_info');

								$button.on('click', function () {

									var $html = $(_popupContent['project_register']);

									var $popup = popupFull({
										html: $html,
										width: 'medium'
									});

									var $form = $html.find('form:eq(0)');

									_initContactForm($form, {
										requestInfo: requestInfo,
										contactInfo: contactInfo,
										done: function (data) {
											requestInfo = data.requestInfo;
											contactInfo = data.contactInfo;

											$button.text('Đã đăng ký sản phẩm');
											delete interactData[requestInfo['object_type'] + '/' + requestInfo['object_id']];

											$popup.off();
											popupPrompt({
												title: 'Đăng ký thành công',
												content: 'Bạn đã đăng ký sản phẩm thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
											});
										}
									});

									$form.find(':input:visible:eq(0)').focus();
								});
							}
						
						// / Register

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

						// Some case display floor, position
							
							if (data.navigator.display_floor == false) {
								$floor.hide();
							}
							else {
								$floor.show();
							}
							
							if (data.navigator.display_position == false) {
								$position.hide();
							}
							else {
								$position.show();
							}
						
						// / Some case display floor, position
					
						// Project
						
							if (type == 'project') {
								$navigatorPanel.find('[aria-name="project"]').addClass('active');

								if ('onSelectProject' in mainParams) {
									mainParams['onSelectProject']();
								}
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

									if ('onSelectBlock' in mainParams) {
										mainParams['onSelectBlock']();
									}
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
										switch (viewByType) {
											case 'floor':
												$floor.after($group);
												break;
											case 'group':
												$group.after($floor);
												break;
										}
									}
									else {
										$floor.after($group);
									}
								
								// / Set position group & floor
							}
							else {
								$block.find('> a').text('Hãy chọn block').data('value', '');
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

									if ('onSelectGroup' in mainParams) {
										mainParams['onSelectGroup']();
									}
								}
							}
							else {
								$group.find('> a').text('Hãy chọn nhóm sản phẩm').data('value', '');
							}
						
							// Floor
							if (data.navigator.floor) {
								$floor.find('> a').text(data.navigator.floor.name).data('value', data.navigator.floor.id);

								if (type == 'blocks/floor') {
									$floor.addClass('active');

									if ('onSelectFloor' in mainParams) {
										mainParams['onSelectFloor']();
									}
								}
							}
							else {
								$floor.find('> a').text('Hãy chọn nhóm tầng').data('value', '');
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

									if ('onSelectRealEstate' in mainParams) {
										mainParams['onSelectRealEstate']();
									}
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
								$re.find('> a').text('Hãy chọn sản phẩm').data('value', '');
								$position.addClass('unactive');
							}
						
						// / Real estate

						// Position
						
							if (data.navigator.position) {
								$position.find('> a').text(data.navigator.position.name).data('value', data.navigator.position.id);

								if (type == 'real_estates/floor') {
									$position.addClass('active');

									if ('onSelectPosition' in mainParams) {
										mainParams['onSelectPosition']();
									}
								}
							}
							else {
								$position.find('> a').text('Hãy chọn tầng').data('value', '');
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
						var 
							descriptionData = this,
							$polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

						$g.append($polyline);

						$polyline.attr({
							'aria-object': 'description',
							points: descriptionData.points
						}).css({
							fill: 'url(#' + $pattern.attr('id') + ')',
							transition: '.3s',
							'transform-origin': '50% 50%',
							cursor: 'pointer'
						});

						if (descriptionData.status == 'highlight') {
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
									switch (descriptionData.description.type) {
										case 'block':
										case 'real_estate':
											startInteractImage(descriptionData.description.type, descriptionData.description.id);
											break;
										case 'block_floor':
											startInteractImage('blocks/floor', descriptionData.description.id);
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
						$g.find('[aria-object="edit_point"]').attr('r', 5 / scale);
					}

				// / Move, zoom

			// / Tools

			// Buttons

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
						}, 200)
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
								}, 200)
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

		initInteractImage($('#ground_interact'))('project', projectId);

	// / Ground

	// Product

		var 
			$productInteract = $('#product_interact'),
			$arrow = $productInteract.find('.arrow:eq(0)');

		$productInteract.after('<hidden></hidden><hidden></hidden>');

		var startProductInteract = initInteractImage($productInteract);

		$('#products_container').find('.item-container').on('click', function () {

			var $item = $(this);

			// Call product interact
			
			// Find position

				// Find while catch element in other line => before of that
				// or last child => that
				$positionBefore = (function findPosition($checkedItem) {
					if ($checkedItem.is(':last-child')) {
						return $checkedItem;
					}

					if ($checkedItem.offset().top != $item.offset().top) {
						return $checkedItem.prev();
					}

					return findPosition($checkedItem.next());
				})($item);

			// / Find position
			
			// Append product

				startProductInteract('real_estates/group', $item.data('value'), {
					reset: true,
					text: $item.find('.title').text()
				});
				$positionBefore.after($productInteract.show().add($productInteract.nextAll(':lt(2)')));
				// Calc arrow position
				$arrow.css('left', $item.offset().left + ($item.width() / 2) - $arrow.width() / 2 - $productInteract.offset().left);
				// Scroll to panel
				$('html,body').animate({
					scrollTop: $productInteract.offset().top - $window.height() * 0.1
				}, 100);
				
			// / Append product

		});

	// Product

	// Register

		{
			var $searchForm = $('#project_search_form');

			var searchInteract = initInteractImage($('#register_interact'), {
				onSelectProject: function () {
					$('#register_interact .image-panel').addClass('hidden');
				},
				onSelectBlock: function () {
					$('#register_interact .image-panel').addClass('hidden');
				},
				onSelectFloor: function () {
					$('#register_interact .image-panel').addClass('hidden');
				},
				onSelectGroup: function () {
					$('#register_interact .image-panel').addClass('hidden');
				},
				onSelectRealEstate: function () {
					$('#register_interact .image-panel').removeClass('hidden');
				},
				onSelectPosition: function () {
					$('#register_interact .image-panel').removeClass('hidden');
				}
			});

			searchInteract('project', projectId);

			initForm($searchForm, {
				submit: function () {
					$.ajax({
						url: '/real_estates/get_value_project_search',
						data: {
							project_id: projectId,
							keyword: $searchForm.find('[name="keyword"]').val()
						},
						dataType: 'JSON'
					}).done(function (data) {
						if (data.status == 0) {
							searchInteract(data.result.type, data.result.id);
						}
						else if (data.status == 1) {
							popupPrompt({
								title: 'Không tìm thấy kết quả',
								content: 'Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp. Bạn vui lòng thử lại với mã khác.'
							});
						}
						else {
							errorPopup();
						}
					}).fail(function () {
						errorPopup();
					})
				}
			});
		}

	// / Register

	// Contact
	
		{
			var 
				$contactForm = $('#contact_form'),
				requestInfo = $contactForm.data('request_info'),
				contactInfo = $contactForm.data('contact_info');;

			_initContactForm($contactForm, {
				requestInfo: requestInfo,
				contactInfo: contactInfo,
				done: function (data) {
					popupPrompt({
						title: 'Đăng ký thành công',
						content: 'Bạn đã đăng ký dự án thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
					});
				}
			});
		}
	
	// / Contact
})