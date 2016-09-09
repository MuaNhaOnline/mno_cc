var $html, $body, $window, $document, _temp = {}, _isSystemScroll = false, _popupContent = {};
var _offsetTop = 0;

$(function () {	
	$('#loading_page').remove();

	$body = $('body');
	$window = $(window);
	$document = $(document);

	_temp['pagination_count'] = 0;
	_startPagination();
	_initSizeProcess();
	initReadTime();
	customJquery();
	customPrototype();

	// setInterval(function () {
	//   $.ajax({
	//     url: '/nothing',
	//     method: 'POST'
	//   });
	// }, 870000);

	// $window.on('unload', function () {
	//   $.ajax({
	//     url: '/end_session',
	//     method: 'POST'
	//   });
	// });

	_initHorizontalListScroll($('.horizontal-list-container'));
	
	_getPopupContent();

	$('a[href="#"]').on('click', function (e) {
		e.preventDefault();
	});

	$('.lazyload').lazyload({
		effect: 'fadeIn',
		appear: function () {
			$(this).removeClass('lazyload');
		}
	});

	$('.processing-function').on('click', function (e) {
		e.preventDefault();
		popupPrompt({
			title: 'Chức năng đang hoàn thiện',
			content: 'Cám ơn bạn đã sử dụng dịch vụ. Chức năng sẽ sớm được đưa vào sử dụng.'
		});
	});

	// Custom jquery

		function customJquery() {
			$.ajaxSetup({
				dataType: 'JSON'
			});

			/*
				params: {}
			*/
			$.fn.isOnScreen = function (params) {
				// Default params
				params = params || {};

				var win = $(window);

				var viewport = {
					top: 	win.scrollTop(),
					// left: 	win.scrollLeft()
				};
				viewport.bottom = 	viewport.top + win.height();
				// viewport.right 	= 	viewport.left + win.width();

				var bounds 		= 	this.offset();
				bounds.bottom 	= 	bounds.top + this.outerHeight();
				// bounds.right 	= 	bounds.left + this.outerWidth();

				return !(viewport.bottom < bounds.top  || viewport.top  > bounds.bottom);
				// viewport.right 	< bounds.left || viewport.left > bounds.right || 
			};

			$.fn.startLoadingStatus = function (action) {
				action = action || 'request';

				if (this.data('loading') == action)  {
					return;
				}

				this.data('loading', action)
					.data('before-change-html', this.html())
					.html('<i class="fa fa-circle-o-notch fa-spin"></i>')
					.addClass('loading-status');

			}

			$.fn.endLoadingStatus = function (action) {
				action = action || 'request';
				
				if (this.data('loading') == (action || 'request')) {
					this.data('loading', '')
						.html(this.data('before-change-html'))
						.removeClass('loading-status');
				}
			}
		}

	// / Custom jquery

	// Custom property

		function customPrototype() {
			String.prototype.format = function(replace) {
				var string = this;
				for (var key in replace) {
					string = string.replace(new RegExp("\\{" + key + "\\}", "g"), replace[key]);
				}
				return string;
			}

			String.prototype.toSentenceCase = function() {
				return this.toLowerCase().replace(/^(.)|\s(.)/g, function(char) { return char.toUpperCase(); });
			}
		}

	// / Custom property
});

// Helper

	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini|Touch/i.test(navigator.userAgent);
	}

	function getUrlInfo(url) {
		var urlInfo = document.createElement('a');
		urlInfo.href = href;
		return urlInfo;
	}

	function isLightColor(str) {
		rgba = getRGBAFromString(str);
		if (rgba[3] && rgba[3] < 0.5) {
			return true;
		}
		else {
			return (
				0.213 * rgba[0] +
				0.715 * rgba[1] +
				0.072 * rgba[2] >
				255 / 2
			);	
		}
	}

	function getRGBAFromString(str) {
		var m;
		// #...
		if (m = str.match(/#([0-9a-fA-F]{3,6})/)) {
			m = m[1];
			if (m.length == 6) {
				return [
					parseInt(m.substr(0,2), 16),
					parseInt(m.substr(2,2), 16),
					parseInt(m.substr(4,2), 16),
					1
				];
			} else {
				return [
					parseInt(m.charAt(0) + m.charAt(0), 16),
					parseInt(m.charAt(1) + m.charAt(1), 16),
					parseInt(m.charAt(2) + m.charAt(2), 16),
					1
				]
			}
		}
		// rgb, rgba (...)
		else if (m = str.match(/rgba?\(([^)]*)\)/i)) {
			m = m[1].split(',');
			return [
				m[0],
				m[1],
				m[2],
				m[3] || 1
			]
		}
		return [
			255,
			255, 
			255,
			1
		];
		// var m;
		// if (m = str.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) {
		// 	if (m[1].length == 6) {
		// 		return [
		// 			parseInt(m[1].substr(0,2),16),
		// 			parseInt(m[1].substr(2,2),16),
		// 			parseInt(m[1].substr(4,2),16)
		// 		];
		// 	} else {
		// 		return [
		// 			parseInt(m[1].charAt(0) + m[1].charAt(0),16),
		// 			parseInt(m[1].charAt(1) + m[1].charAt(1),16),
		// 			parseInt(m[1].charAt(2) + m[1].charAt(2),16)
		// 		]
		// 	}

		// } else if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
		// 	var params = m[1].split(',');
		// 	var re = /^\s*(\d*)(\.\d+)?\s*$/;
		// 	var mR, mG, mB;
		// 	if (
		// 		params.length >= 3 &&
		// 		(mR = params[0].match(re)) &&
		// 		(mG = params[1].match(re)) &&
		// 		(mB = params[2].match(re))
		// 	) {
		// 		return [
		// 			parseFloat((mR[1] || '0') + (mR[2] || '')),
		// 			parseFloat((mG[1] || '0') + (mG[2] || '')),
		// 			parseFloat((mB[1] || '0') + (mB[2] || ''))
		// 		];
		// 	}
		// }
		// return false;
	}

	/*
		params:
			addBottom
			addHeight
			addTop
	*/
	function canSee($item, params) {
		if ($item.length == 0) {
			return false;
		}
		if (typeof params == 'undefined') {
			params = {};
		}

		var win = $(window);

		var viewport = {
				top : win.scrollTop(),
				left : win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var bounds = $item.offset();
		bounds.right = bounds.left + $item.outerWidth();
		bounds.bottom = bounds.top + $item.outerHeight();

		return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
	}

	/*
		params:
			staticTop: boolean
			topHandle
			middleHandle
			bottomHandle
			addMin
			addMax
	*/
	function _initFixedScroll($object, $follow, params) {
		if ($object.length == 0 || $follow.length == 0) {
			return;
		}

		if (typeof params == 'undefined') {
			params = {};
		}
		params.addMin = params.addMin || 0;
		params.addMax = params.addMax || 0;

		var 
			// 1: Top, 2: Middle, 3: Bottom
			flag = -1,
			manager = {},
			lastScroll = document.body.scrollTop;

		manager.isRunning = function () {
			return flag != -1;
		}
		manager.doIt = function () {
			var
				minScroll = -($object.height() - window.innerHeight),
				min = $follow.offset().top + params.addMin,
				max = $follow.offset().top + $follow.outerHeight() - (minScroll < 0 ? window.innerHeight - _offsetTop : $object.outerHeight()) + params.addMax,
				scrollTop = $(window).scrollTop() + _offsetTop;

			if (minScroll > 0) {
				minScroll = 0;
			}

			if (scrollTop < min) {
				if (flag == 1) {
					return;
				}
				flag = 1;
				if (params.topHandle) {
					params.topHandle();
				}
				else {
					// if (params.staticTop) {
						$object.css({
							position: 'static'
						});
					// }
					// else {
					// 	$object.css({
					// 		position: 'absolute',
					// 		top: min + 'px'
					// 	});
					// }
				}
			}
			else if (scrollTop < max) {
				if (flag == 2) {
					if (minScroll < 0) {
						var newTop =
							parseFloat($object.css('top')) -
							(
								document.body.scrollTop > lastScroll ?
									document.body.scrollTop - lastScroll :
									-(lastScroll - document.body.scrollTop)
							);
						if (newTop < minScroll) {
							newTop = minScroll;
						}
						else if (newTop > _offsetTop) {
							newTop = _offsetTop;
						}

						$object.css('top', newTop + 'px');
					}
				}
				else {
					if (params.middleHandle) {
						params.middleHandle();
					}
					else {
						$object.css({
							position: 'fixed'
						});
						if (minScroll < 0) {
							if (flag == 1) {
								$object.css('top', _offsetTop + 'px');
							}
							else {
								$object.css('top', minScroll + 'px');
							}
						}
						else {
							$object.css('top', _offsetTop + 'px');
						}
					}
					flag = 2;
				}
			}
			else {
				if (flag == 3) {
					return;
				}
				flag = 3;
				if (params.bottomHandle) {
					params.bottomHandle();
				}
				else {
					if (minScroll < 0) {
						$object.css({
							position: 'absolute',
							top: max - _offsetTop + minScroll + 'px'
						});
					}
					else {
						$object.css({
							position: 'absolute',
							top: max + 'px'
						});	
					}
				}
			}

			lastScroll = document.body.scrollTop;
		}

		var key = $object.selector.replace(/ /, '_');
		manager.start = function () {
			if (manager.isRunning()) {
				return;
			}

			$(window).on('scroll.' + key, function () {
				manager.doIt();
			}).on('resize.' + key, function () {
				$object.css('width', $object.parent().width());
			});

			$follow.css('min-height', _offsetTop == 0 ? '100vh' : 'calc(100vh - ' + _offsetTop + 'px)');
			$object.css({
				'width':		$object.parent().width(),
				// 'max-height': 	_offsetTop == 0 ? '100vh' : 'calc(100vh - ' + _offsetTop + 'px)',
				// 'overflow':		'hidden'
			});
		}
		manager.end = function () {
			if (!manager.isRunning()) {
				return;
			}

			flag = -1;
			$object.css({
				position: '',
				top: ''
			});
			$follow.css('min-height', '');
			$object.css({
				'width':		'',
				// 'max-height': 	'',
				// 'overflow':		''
			});
			$(window).off('scroll.' + key);
			$(window).off('resize.' + key);
		}

		manager.start();
		manager.doIt();

		return manager;
	}

	/*
		to: integer
		params:
			context: html, body
			complete: func
	*/
	function _scrollTo(to, params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		_isSystemScroll = true;
		(params['context'] ? params['context'] : $('html, body')).animate({
			scrollTop: to
		}, 200, function () {
			if (typeof params.complete == 'function') {
				params.complete();
			}
			setTimeout(function () {
				_isSystemScroll = false;
			}, 200);
		})
	}
	function _scrollLeftTo(to, params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		_isSystemScroll = true;
		(params['context'] ? params['context'] : $('html, body')).animate({
			scrollLeft: to
		}, 200, function () {
			if (typeof params.complete == 'function') {
				params.complete();
			}
			setTimeout(function () {
				_isSystemScroll = false;
			}, 200);
		})
	}

	function _scrollIfCantSee($item, $ctn) {
		var
			scrollTop = $ctn.scrollTop(),
			top = $item.position().top + scrollTop;

		if (top < scrollTop) {
			$ctn.scrollTop(top);
		}
		else if (top + $item.outerHeight() > scrollTop + $ctn.outerHeight()) {
			$ctn.scrollTop(top - $ctn.outerHeight() + $item.outerHeight());
		}
	}

	function _replaceState(url) {
		window.history.replaceState({}, document.title, url.replace(/&?_=[0-9]*/, ''));
	}

// / Helper

// Format

	function moneyFormat(number, separate) {
		if (typeof separate == 'undefined') {
			separate = ',';
		}
		number = number.toString();

		return insertSeparate(number, separate);
	}

	function insertSeparate(number, separate) {
		if (number.length > 3) {
			return insertSeparate(number.slice(0, number.length - 3), separate) + separate + number.slice(number.length - 3);
		}
		return number;
	}

	function intFormat(string) {
		return string.replace(/\D/g, '');
	}

// / Format

// Size
	
	function _initSizeProcess() {
		// Get size
		function _getSize() {
			var width = $(window).width(), widthType, oldWidthType = $body.data('width');

			if (width >= 1200) {
				widthType = 'lg';
			}
			else if (width >= 992) {
				widthType = 'md';
			}
			else if (width >= 768) {
				widthType = 'sm';
			}
			else {
				widthType = 'xs';
			}

			if (widthType == oldWidthType) {
				return;
			}

			$body.data('width', widthType);
		}

		// Size load
		function _sizeLoad() {
			$('.sizeload').each(function () {
				var $object = $(this);
				var url = $object.data('sizeload')[$body.data('width')];
				if ($object.hasClass('lazyload')) {
					$object.attr('data-original', url);
				}
				else {
					$("<img />").on("load", function() {
						if ($object.is('img')) {
							$object.attr('src', url);
						}
						else {
							$object.css('backgroundImage', 'url("' + url + '")');
						}
					}).attr("src", url);
				}
			});
		}
		$window.isWidthType = function (arrayType) {
			return arrayType.indexOf($body.data('width')) != -1;
		}
		_getSize();
		_sizeLoad();
		$window.on('resize', function () {
			_getSize();
			_sizeLoad();
		});
	}

// / Size

// Track session

	function track_session() {
		$.ajax({
			url: '/track_session',
			method: 'POST'
		})
	}

// / Track session

// Pagination

	/*
		url(*)
		data
			data pass to url
			{} or function return {}
		list
			list to display
		pagination
			pagination display
		page(1)
			page display
		done
			handle after load success
			function(content, note)
		fail
			handle after load empty or fail
			function()
		init_list
			function($list)
		replaceState: false
		return find(findParams)
			findParams:
				url
				data
					data pass to find
					'last_data' if want to use last data
				note
	*/
	function _initPagination(params) {
		// Check if have not params or url
		if (typeof params == 'undefined' || 'url' in params) {
			return;
		}

		var 
			no = _temp['pagination_count']++
			keyFind = 'is_finding_' + no,
			replaceState = 'replaceState' in params ? params['replaceState'] : false;

		_temp[keyFind] = false;

		var lastData = { page: params['page'] || 1 };

		// Find function
		var find = function (findParams) {
			if ('pagination' in params) {
				params['pagination'].children().css({
					'opacity': '.5',
					'pointer-events': 'none'
				});
			}

			if (typeof findParams == 'undefined') {
				findParams = {};
			}

			/*
				Get data
			*/

			// data of params
			var data;
			if ('data' in params) {
				if (typeof params.data == 'function') {
					data = params.data();
				}
				else {
					data = params.data;
				}
			}
			if (typeof data != 'object') {
				data = {}
			}
			data['page'] = data['page'] || 1;

			// data of find params
			if (findParams['data'] == 'last_data') {
				findParams['data'] = lastData;
			}

			if ('data' in findParams) {
				$.extend(data, findParams['data']);
			}

			lastData = data;

			/*
				/ Get data
			*/

			if (_temp[keyFind]) {
				_temp[keyFind].abort();
			}

			// Get url
			var url = findParams['url'] || params['url'];

			_temp[keyFind] = $.ajax({
					url: url,
					data: data
			}).always(function () {
				_temp[keyFind] = false;
			}).done(function (data) {
				if (data.status == 0) {
					// callback afterLoad or replace list
					if ('done' in params) {
						params['done'](data.result.list, findParams.note);
					}
					else {
						if ('list' in params) {
							params['list'].html(data.result.list); 

							if ('init_list' in params) {
								params['init_list'](params['list'], findParams.note); 
							}
						}
					}

					// replace pagination
					if ('pagination' in params) {
						params['pagination'].html(data.result.pagination);
						initPagination(); 
					}

					if (replaceState) {
						window.history.replaceState({}, document.title, this.url);
					}
				}
				else if (data.status == 1) {
					if ('list' in params) {
						if (params['list'].closest('table').length == 0) {
							params['list'].html('<article class="callout callout-warning"><h4>Không có kết quả</h4><p>Không tìm thấy kết quả, vui lòng thử lại sau</p></article>');
						}
						else {
							params['list'].html('');
						}
					}
				}
				else {
					if ('fail' in params) {
						params['fail'](findParams.note);
					}
					// empty pagination
					if ('pagination' in params) {
						params['pagination'].empty();
					}
					// empty list
					if ('list' in params) {
						params['list'].html('<div class="alert alert-warning alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4 class="no-margin"><i class="icon fa fa-warning"></i> Không tìm thấy kết quả</h4></div>')
					}
				}
			}).fail(function (xhr, status) {
				if (status != 'abort') {
					if ('fail' in params) {
						params['fail'](findParams.note);
					}
					// empty pagination
					if ('pagination' in params) {
						params['pagination'].empty();
					}
					// empty list
					if ('list' in params) {
						params['list'].html('<div class="alert alert-warning alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4 class="no-margin"><i class="icon fa fa-warning"></i> Không tìm thấy kết quả</h4></div>')
					}
				}
			});
		}

		if ('pagination' in params) {
			function initPagination(page) {
				params['pagination'].find('[aria-click="paging"]').on('click', function () {
					lastData['page'] = $(this).data('page');
					find({ data: lastData });
				});

				params['pagination'].find('[aria-click="prev-page"]').on('click', function () {
					lastData['page'] = lastData['page'] - 1;
					find({ data: lastData });
				});

				params['pagination'].find('[aria-click="next-page"]').on('click', function () {
					lastData['page'] = lastData['page'] + 1;
					find({ data: lastData });
				});
			}
			initPagination(params['page'] || 1);
		}

		return find;
	}

	/*
		params:
			url(*)
			data 			{}
							{} || function
			list 			$()
			paginator 		$()
			alert 			$('<section></section>')
			emptyHtml 		'...'
			replaceState	false
			done 			function
			fail 			function
			empty 			function
			scrollTo 		list
	*/
	function _initPagination2(params) {
		// Check if have not params or url
		if (typeof params == 'undefined' || !('url' in params)) {
			return;
		}

		var 
			xhr		= 	null,
			obj,

		// Create object
		obj = {
			url: 			params.url,
			list: 			params.list || $(),
			paginator:		params.paginator || $(),
			alert: 			params.alert || $('<section></section>'),
			emptyHtml: 		params.alertHtml || '<div class="alert alert-warning alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4 class="no-margin"><i class="icon fa fa-warning"></i> Không có kết quả</h4><p>Không tìm thấy kết quả phù hợp, vui lòng thử lại sau</p></div>',
			lastData: 		{},
			data: 			params.data || {},
			getData: 		function () {
								return typeof obj.data == 'function' ?
									obj.data() :
									obj.data;
							},
			replaceState: 	params.replaceState || false,
			done: 			params.done || function () {},
			fail: 			params.fail || function () {},
			empty: 			params.empty || function () {},
			/*
				findParams
					scrollTo 		true
									Whether scrollTo ...
					data 			nothing
					url 			param url
					startRequest 	function () {}
					endRequest 		function () {}
			*/
			find: 			function (findParams) {
								findParams = findParams || {};

								// Params
								if (typeof findParams.scrollTo == 'undefined') {
									findParams.scrollTo = true;
								}
								findParams.startRequest = 	findParams.startRequest || function () {};
								findParams.endRequest 	= 	findParams.endRequest 	|| function () {};

								// Get data

									// Clone data
									var data = $.extend({}, obj.getData());

									// Use find params if exists
									if ('data' in findParams) {
										$.extend(data, findParams.data);
									}

									// Default value
									data.page = data.page || 1;

									// Save to last data
									obj.lastData = data;

								// / Get data

								// Request
								
									// Get url
									var url = findParams.url || obj.url;

									// Hide alert
									obj.alert.hide();

									// Call request
									findParams.startRequest();
									xhr = $.ajax({
										url: url,
										data: data,
										cache: false
									}).done(function (data) {
										if (data.status == 0) {
											// Replace html
											obj.list.html(data.result.list);
											obj.paginator.html(data.result.paginator);

											// Callback
											obj.done(data.result);
											initPaginator();

											// Scroll to list
											if (findParams.scrollTo) {
												_scrollTo(obj.list.offset().top);
											}

											if (obj.replaceState) {
												// Remove timestamp in url
												window.history.replaceState({}, document.title, this.url.replace(/&?_=[0-9]*/, ''));
											}
										}
										else if (data.status == 1) {
											// Replace html
											obj.list.html('');
											obj.paginator.html('');

											// Callback
											obj.empty();

											// Alert
											obj.alert.show().html(obj.emptyHtml);
										}
										else {
											// Replace html
											obj.list.html('');
											obj.paginator.html('');

											// Callback
											obj.fail();

											// Alert
											_errorPopup();
										}
									}).fail(function (xhr, status) {
										if (status != 'abort') {
											// Replace html
											obj.list.html('');
											obj.paginator.html('');
											obj.list.next()

											// Callback
											obj.fail();

											// Alert
											_errorPopup();
										}
									}).always(function () {
										findParams.endRequest();
									});
								
								// / Request
							}
		};
		obj.scrollTo = params.scrollTo || obj.list;

		// Append alert

			if (!params.alert) {
				// Get table
				var $replaceAfter = obj.list.closest('table');

				// If not in table => Append after list
				if ($replaceAfter.length == 0) {
					$replaceAfter = obj.list;
				}

				// Append
				$replaceAfter.after(obj.alert);
			}

		// / Append alert

		function initPaginator() {
			obj.paginator.find('[aria-click="paging"]').on('click', function () {
				$(this).startLoadingStatus();
				obj.lastData['page'] = $(this).data('page');
				obj.find({ data: obj.lastData });
			});
		}
		initPaginator();

		return obj;
	}

	/*
		params:
			url(*)
			data 			{}
							{} || function
			lastData 		{} || function
			list 			$()
			paginator 		$()
			alert 			$('<section></section>')
			emptyHtml 		'...'
			replaceState	false
			done 			function
			fail 			function
			empty 			function
			scrollTo 		list
	*/
	function _initPagination3(params) {
		// Check if have not params or url
		if (typeof params == 'undefined' || !('url' in params)) {
			return;
		}

		var 
			xhr		= 	null,
			obj,

		// Create object
		obj = {
			url: 			params.url,
			list: 			params.list || $(),
			paginator:		params.paginator || $(),
			alert: 			params.alert || $('<section></section>'),
			emptyHtml: 		params.alertHtml || '<div class="alert alert-warning alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4 class="no-margin"><i class="icon fa fa-warning"></i> Không có kết quả</h4><p>Không tìm thấy kết quả phù hợp, vui lòng thử lại sau</p></div>',
			lastData: 		params.lastData,
			data: 			params.data || {},
			getData: 		function () {
								return typeof obj.data == 'function' ?
									obj.data() :
									obj.data;
							},
			replaceState: 	params.replaceState || false,
			done: 			params.done || function () {},
			fail: 			params.fail || function () {},
			empty: 			params.empty || function () {},
			/*
				findParams
					scrollTo 		true
									Whether scrollTo ...
					data 			nothing
					url 			param url
					startRequest 	function () {}
					endRequest 		function () {}
			*/
			find: 			function (findParams) {
								findParams = findParams || {};

								// Params
								if (typeof findParams.scrollTo == 'undefined') {
									findParams.scrollTo = true;
								}
								findParams.startRequest = 	findParams.startRequest || function () {};
								findParams.endRequest 	= 	findParams.endRequest 	|| function () {};

								// Get data

									// Clone data
									var data = $.extend({}, obj.getData());

									// Use find params if exists
									if ('data' in findParams) {
										$.extend(data, findParams.data);
									}

									// Default value
									data.page = data.page || 1;

									// Save to last data
									obj.lastData = data;

								// / Get data

								// Request
								
									// Get url
									var url = findParams.url || obj.url;

									// Hide alert
									obj.alert.hide();

									console.log(data);
									// Call request
									findParams.startRequest();
									xhr = $.ajax({
										url: url,
										data: data,
										cache: false
									}).done(function (data) {
										if (data.status == 0) {
											// Replace html
											obj.list.html(data.result.list);
											obj.paginator.html(data.result.paginator);

											// Callback
											obj.done(data.result);
											initPaginator();

											// Scroll to list
											if (findParams.scrollTo) {
												_scrollTo(obj.list.offset().top - _offsetTop);
											}

											if (obj.replaceState) {
												// Remove timestamp in url
												window.history.replaceState({}, document.title, this.url.replace(/&?_=[0-9]*/, ''));
											}
										}
										else if (data.status == 1) {
											// Replace html
											obj.list.html('');
											obj.paginator.html('');

											// Callback
											obj.empty();

											// Alert
											obj.alert.show().html(obj.emptyHtml);
										}
										else {
											// Replace html
											obj.list.html('');
											obj.paginator.html('');

											// Callback
											obj.fail();

											// Alert
											_errorPopup();
										}
									}).fail(function (xhr, status) {
										if (status != 'abort') {
											// Replace html
											obj.list.html('');
											obj.paginator.html('');
											obj.list.next()

											// Callback
											obj.fail();

											// Alert
											_errorPopup();
										}
									}).always(function () {
										findParams.endRequest();
									});
								
								// / Request
							}
		};
		obj.scrollTo = params.scrollTo || obj.list;
		if (typeof obj.lastData == 'function') {
			obj.lastData = obj.lastData();
		}
		if (typeof obj.lastData == 'undefined') {
			obj.lastData = obj.paginator.data('search-params');
		}
		if (typeof obj.lastData == 'undefined') {
			obj.lastData = {};
		}

		// Append alert

			if (!params.alert) {
				// Get table
				var $replaceAfter = obj.list.closest('table');

				// If not in table => Append after list
				if ($replaceAfter.length == 0) {
					$replaceAfter = obj.list;
				}

				// Append
				$replaceAfter.after(obj.alert);
			}

		// / Append alert

		function initPaginator() {
			obj.paginator.find('[aria-click="paging"]').on('click', function () {
				$(this).startLoadingStatus();

				obj.lastData['page'] = $(this).data('page');
				obj.find({ data: obj.lastData });
			});
		}
		initPaginator();

		return obj;
	}


	/*
		aria-pagination
		data:
			url
			list
			pagination
			page
			done
			fail
			data
	*/
	function _startPagination($container) {
		(typeof($container) == 'undefined' ? $('[aria-pagination]') : $container.find('[aria-pagination]')).each(function () {
			var 
				$pagination = $(this),
				params = {};

			if ($pagination.data('url')) {
				params['url'] = $pagination.data('url');
			}

			if ($pagination.data('list')) {
				params['list'] = $($pagination.data('list'));
			}

			if ($pagination.data('pagination')) {
				params['pagination'] = $($pagination.data('pagination'));
			}

			if ($pagination.data('page')) {
				params['page'] = $($pagination.data('page'));
			}

			if ($pagination.data('done') && typeof window[$pagination.data('done')] == 'function') {
				params['done'] = window[$pagination.data('done')];
			}

			if ($pagination.data('fail') && typeof window[$pagination.data('fail')] == 'function') {
				params['fail'] = window[$pagination.data('fail')];
			}

			if ($pagination.data('data')) {
				data = $pagination.data('data');

				if (typeof data == 'object') {
					params['data'] = data;
				}
				else if (typeof window[data] == 'function') {
					params['data'] = window[data];
				}
			}

			if ($pagination.data('init_list')) {
				params['init_list'] = new Function('$list', $pagination.data('init_list'));
			}

			_initPagination(params);
		})
	}

// / Pagination

// Read money

	function read_money (number) {
		var is_prev_block_empty = true;
		
		/*
			Read number
		*/

		function read_number(position) {
			var p = position % 3

			if (p == 0 && !is_prev_block_empty && parseInt(number.substring(position + 1, number.length)) == 0) {
				switch (number[position]) {
					case '1':
						return ['mốt '];
						break;
					case '2':
						return ['hai '];
						break;
					case '3':
						return ['ba '];
						break;
					case '4':
						return ['tư '];
						break;
					case '5':
						return ['rưỡi '];
						break;
					case '6':
						return ['sáu '];
						break;
					case '7':
						return ['bảy '];
						break;
					case '8':
						return ['tám '];
						break;
					case '9':
						return ['chín '];
						break;
				}
			}

			switch (number[position]) {
				case '0':
					if (p == 1 && number[position + 1] != '0' && parseInt(number.substring(0, position)) != 0) {
						return 'lẻ ';
					}
					break;
				case '1':
					switch (p) {
						case 0:
							return 'một trăm ';
							break;
						case 1:
							return 'mười ';
							break;
						case 2:
							if (parseInt(number[position - 1]) > 1) {
								return 'mốt '; 
							}
							else {
								return 'một ';
							}
							break;
					}
				case '2':
					switch (p) {
						case 0:
							return 'hai trăm ';
							break;
						case 1:
							return 'hai mươi ';
							break;
						default:
							return 'hai ';
							break;
					}
					break;
				case '3':
					switch (p) {
						case 0:
							return 'ba trăm ';
							break;
						case 1:
							return 'ba mươi ';
							break;
						default:
							return 'ba ';
							break;
					}
					break;
				case '4':
					switch (p) {
						case 0:
							return 'bốn trăm ';
							break;
						case 1:
							return 'bốn mươi ';
							break;
						default:
							return 'bốn ';
							break;
					}
					break;
				case '5':
					switch (p) {
						case 0:
							return 'năm trăm ';
							break;
						case 1:
							return 'năm mươi ';
							break;
						default:
							if (number[position - 1] == 0) {
								return 'năm ';
							}
							else {
								return 'lăm ';
							}
							break;
					}
					break;
				case '6':
					switch (p) {
						case 0:
							return 'sáu trăm ';
							break;
						case 1:
							return 'sáu mươi ';
							break;
						default:
							return 'sáu ';
							break;
					}
					break;
				case '7':
					switch (p) {
						case 0:
							return 'bảy trăm ';
							break;
						case 1:
							return 'bảy mươi ';
							break;
						default:
							return 'bảy ';
							break;
					}
					break;
				case '8':
					switch (p) {
						case 0:
							return 'tám trăm ';
							break;
						case 1:
							return 'tám mươi ';
							break;
						default:
							return 'tám ';
							break;
					}
					break;
				case '9':
					switch (p) {
						case 0:
							return 'chín trăm ';
							break;
						case 1:
							return 'chín mươi ';
							break;
						default:
							return 'chín ';
							break;
					}
					break;
			}

			return '';
		}
		
		/*
			/ Read number
		*/

		/*
			Read block
		*/

		function read_block(block) {
			var text = ''
			var position = block * 3

			var noNumBefore = true;
			for (i = position; i < position + 3; i++) {
				// var t = read_number(i);

				// if (typeof t == 'object') {
				//   return t;
				// }
				// else {
				//   text += t;
				// }
				if (!(number[i] == '0' && noNumBefore)) {
					text += number[i];
					noNumBefore = false;
				}
			}

			if (text != '') {
				text += ' ';
			}
			return text;
		}

		/*
			/ Read block
		*/

		// Get array number (string)
		number = number.toString();
		if (number.length % 3 != 0) {
			var padLeft = new Array(3 - number.length % 3);
			for (var i = padLeft.length - 1; i >= 0; i--) { padLeft[i] = '0'; }

			number = padLeft.join('') + number;
		}

		var read_unit = ['nghìn ', 'triệu ', 'tỷ '];

		var text = '';
		var block_count = number.length / 3;

		for (var block = 0; block < block_count; block++) {
			var reverse_index = block_count - block - 1;

			var t = read_block(block);

			if (typeof t == 'object') {
				text += t[0];

				if (block_count - block > 3) {
					var d = parseInt(reverse_index / 3);
					for (var i = 0; i < d; i++) {
						text += 'tỷ ';
					}
				}
				break;
			}

			if (t != '') {
				is_prev_block_empty = false;

				text += t;
				if (block != block_count - 1) {
					text += read_unit[(reverse_index - 1) % 3];
				}
			}
			else {
				if (reverse_index > 0 && reverse_index % 3 == 0) {
					is_prev_block_empty = false;
					text += 'tỷ ';
				}
				else {
					is_prev_block_empty = true;
				}
			}
		}

		if (text != '') {
			text = text.substring(0, text.length - 1);
			text = text.charAt(0).toUpperCase() + text.substring(1);
		}

		return text;
	}

// / Read money

// Read time

	function initReadTime($container) {
		(typeof($container) == 'undefined' ? $('[aria-time]') : $container.find('[aria-time]')).each(function () {
			setTime($(this));
		});
		(typeof($container) == 'undefined' ? $('[aria-time-range]') : $container.find('[aria-time-range]')).each(function () {
			setTimeRange($(this));
		});
	}

	function setTime($item) {
		var time = readTime($item.attr('aria-time'));
		$item.text(time.short);
		$item.tooltip({ title: time.full });
		if (time.repeat != -1) {
			setTimeout(function () {
				setTime($item);
			}, time.repeat * 1000);
		}
	}

	function setTimeRange($item) {
		var time = readTimeRange($item.attr('aria-time-range').split(';'));
		$item.text(time.short);
		$item.tooltip({ title: time.full });
	}

	function readTime(time) {
		time = new Date(time);
		now = new Date();
		shortText = '';
		fullText = '';
		repeat = -1;

		seconds =   ~~((now - time) / 1000)
		minutes =   ~~(seconds / 60);
		hours =     ~~(minutes / 60);
		days =      ~~(hours / 24);
		years =     ~~(days / 365);
		months =    ~~(days / 30);
		weeks =     ~~(days / 7);

		if (years == 0) {
			if (months == 0) {
				if (weeks == 0) {
					if (days == 0) {
						if (hours == 0) {
							if (minutes == 0) {
								shortText = 'Vừa mới';
							}
							else {
								shortText = minutes + ' phút trước';
							}
							repeat = 60 * (minutes + 1) - seconds;
						}
						else {
							shortText = hours + ' giờ trước';
							repeat = (60 * (hours + 1) - minutes) * 60;
						}
					}
					else {
						shortText = days + ' ngày trước';
						repeat = (24 * (days + 1) - hours) * 3600;
					}
				}
				else {
					shortText = weeks + ' tuần trước';
				}
			}
			else {
				shortText = months + ' tháng trước';
			}
		}
		else {
			shortText = years + ' năm trước';
		}

		fullText = time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear() + ' lúc ' + time.getHours() + ':' + ('0' + time.getMinutes()).slice(-2);

		return { short: shortText, full: fullText, repeat: repeat };
	}

	function readTimeRange(timeRange) {
		timeFrom = new Date(timeRange[0]);
		timeTo = new Date(timeRange[1]);
		shortText = '';
		fullText = '';

		seconds =   ~~((timeTo - timeFrom) / 1000)
		minutes =   ~~(seconds / 60);
		hours =     ~~(minutes / 60);
		days =      ~~(hours / 24);
		years =     ~~(days / 365);
		months =    ~~(days / 30);
		weeks =     ~~(days / 7);

		if (years == 0) {
			if (months == 0) {
				if (weeks == 0) {
					if (days == 0) {
						if (hours == 0) {
							if (minutes == 0) {
								shortText = 'Một lát';
							}
							else {
								shortText = 'Khoảng ' + minutes + ' phút';
							}
						}
						else {
							shortText = 'Khoảng ' + hours + ' tiếng';
						}
					}
					else {
						shortText = 'Khoảng ' + days + ' ngày';
					}
				}
				else {
					shortText = 'Khoảng ' + weeks + ' tuần';
				}
			}
			else {
				shortText = 'Khoảng ' + months + ' tháng';
			}
		}
		else {
			shortText = 'Khoảng ' + years + ' năm';
		}

		fullText = 
			timeFrom.getDate() + '/' + (timeFrom.getMonth() + 1) + '/' + timeFrom.getFullYear() + ' lúc ' + timeFrom.getHours() + ':' + timeFrom.getMinutes() + ' - ' +
			timeTo.getDate() + '/' + (timeTo.getMonth() + 1) + '/' + timeTo.getFullYear() + ' lúc ' + timeTo.getHours() + ':' + timeTo.getMinutes();

		return { short: shortText, full: fullText, repeat: repeat };
	}

	function _subTime(timeTo, timeFrom) {
		result = {};

		result.seconds =   ~~((timeTo - timeFrom) / 1000);
		result.minutes =   ~~(result.seconds / 60);
		result.hours =     ~~(result.minutes / 60);
		result.days =      ~~(result.hours / 24);
		result.years =     ~~(result.days / 365);
		result.months =    ~~(result.days / 30);
		result.weeks =     ~~(result.days / 7);


		return result;
	}

// / Read time

// Horizontal list scroll

	function _initHorizontalListScroll($containers) {
		$containers.each(function () {
			var startTouch, $container = $(this);

			if (isMobile()) {
				$container.on({
					touchstart: function (e) {
						startTouch = e.originalEvent.changedTouches[0].clientX;
						startItemList = $container.scrollLeft();
					},
					touchmove: function (e) {
						e.preventDefault();
						$container.scrollLeft(startItemList + startTouch - e.originalEvent.changedTouches[0].clientX);
					}
				});
			}
			else {
				$container.on({
					mouseenter: function (e) {
						var 
							scrollableWidth = $container.children()[0].getBoundingClientRect().width - $container[0].getBoundingClientRect().width,
							offsetLeft = $container.offset().left,
							panelWidth = $container.width(),
							startX = e.clientX - offsetLeft;

						if (startX < 5) {
							$container.scrollLeft(0);
						}
						else if (startX > panelWidth - 5) {
							$container.scrollLeft(scrollableWidth);
						}

						var
							startScroll = $container.scrollLeft(),
							scrollableLeft = startScroll,
							scrollableRight = scrollableWidth - scrollableLeft,
							panelWidthLeft = startX,
							panelWidthRight = panelWidth - startX;

						if (scrollableWidth > 0) {
							$container.on({
								mousemove: function (e) {
									x = e.clientX - offsetLeft;

									if (x - startX > 0) {
										// Right
										$container.scrollLeft(startScroll + (scrollableRight * (x - startX) / panelWidthRight));
									}
									else {
										// Left
										$container.scrollLeft(scrollableLeft * x / panelWidthLeft);
									}
								}
							})
						}
					},
					mouseleave: function () {
						$container.off('mousemove');
					}
				});
			}
		})
	}
	
// / Horizontal list scroll

// Ajax loadding

	function _getAjaxLoadingFunction($element) {
		if (typeof $element == 'undefined') {
			$element = $body;
		}

		return function () {
			// Create progress bar
			var $progress_bar_container = $(
				'<div style="position: ' + ($element.is($body) ? 'fixed' : 'absolute') + '; z-index: 50;">' +
					'<span style="background-color: #00c0ef; padding: 5px; border-radius: 3px; color: #fff; font-weight: bold; font-size: 11px">' +
						'<span class="percent">0</span>%' +
					'</span>' +
				'</div>'
			);
			if ($element.is('.row')) {
				$progress_bar_container.css({
					top: $element.offset().top,
					left: $element.offset().left + 15
				});  
			}
			else {
				$progress_bar_container.css({
					top: $element.offset().top,
					left: $element.offset().left
				}); 
			}

			var $percent = $progress_bar_container.find('.percent');

			$body.append($progress_bar_container);

			// Update progress bar
			function updateProgressBar(percent) {
				$percent.text(percent);
			}

			var xhr = $.ajaxSettings.xhr();

			// Upload progress
			if (xhr.upload) {
				xhr.upload.addEventListener('progress', function (e) {
					if (e.lengthComputable) {
						updateProgressBar((e.loaded / e.total) * 50);
					}
					else {
						xhr.upload.removeEventListener('progress');
						xhr.removeEventListener('progress');
						$percent.parent().html('<i class="fa fa-refresh fa-spin"></i>');
					}
				}, false);
			}

			// Download progress
			xhr.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					updateProgressBar(50 + (e.loaded / e.total) * 50);
				}
				else {
					xhr.upload.removeEventListener('progress');
					xhr.removeEventListener('progress');
					$percent.parent().html('<i class="fa fa-refresh fa-spin"></i>');
				}
			}, false);

			// Status change
			xhr.addEventListener('load', function (e) {
				$progress_bar_container.remove();
			});

			return xhr;
		}
	}
	
// / Ajax loading

// Tab container

	function _initTabContainer($containers) {
		$containers.each(function () {
			var $container = $(this);

			$container.find('> .tab-list [aria-click="change_tab"]').off('click').on('click', function () {
				var $item = $(this).parent();

				// If inactive => return
				if ($item.hasClass('active')) {
					return;
				}

				// Remove tab inactive
				$container.find('> .tab-list li.active, > .tab-content-list > .tab-content.active').removeClass('active').trigger('close').find('[aria-listen~="hide"]').trigger('hide');

				// Set select tab to active
				$item.addClass('active');
				
				$container.find('> .tab-content-list > .tab-content[aria-name="' + $item.attr('aria-name') + '"]').addClass('active').trigger('open').find('[aria-listen~="show"]').trigger('show');
			});

			$firstItem = $container.find('> .tab-list li.active:eq(0)');

			if ($firstItem.length == 0) {
				$firstItem = $container.find('> .tab-list li:visible:eq(0)');
			}			

			if ($firstItem.length == 0) {
				$firstItem = $container.find('> .tab-list li:eq(0)');
			}

			$firstItem.removeClass('active').find('[aria-click="change_tab"]').click();
		});
	}

// / Tab container

// Gallery
	
	/*
		params:
			data(*)
					images: [
						{ thumb(*), original(*), description, active }
					]
				or
					images_url
				description
	*/
	function _openGallery(params) {

		// Validate

			if (typeof params == 'undefined') {
				return;
			}

			if (!('data' in params)) {
				return;
			}

			if ((!('images' in params['data']) || params['data']['images'].length == 0) && !('images_url' in params['data'])) {
				return;
			}

		// / Validate

		// Create html

			var $html = $(
				'<div class="gallery-popup">' +
					'<section class="close-button">' +
						'<button type="button" class="close" aria-click="close"><span aria-hidden="true">&times;</span></button>' +
					'</section>' +
					'<section class="gallery-container">' +
					'</section>' +
				'</div>'
			);

			if (params['data']['description']) {
				$html.find('.gallery-container').addClass('has-description').html(
					'<div class="container-fluid">' +
						'<div class="row" style="height: 100vh">' +
							'<section class="col-xs-12 col-md-9">' +
								'<article class="image-part">' +
									'<section class="image-view-panel">' +
										'<span class="fa fa-spin fa-spinner" aria-name="spinner" style="display: none;"></span>' +
										'<img aria-name="image" class="image" src="#" style="display: none;" />' +
									'</section>' +
									'<section class="image-description-panel">' +
										'<div class="text-center" aria-name="description"></div>' +
									'</section>' +
									'<section class="image-list-panel">' +
										'<ul class="item-list">' +
										'</ul>' +
									'</section>' +
								'</article>' +
							'</section>' +
							'<section class="col-xs-12 col-md-3 description-part-container">' +
								'<article class="description-part">' +
									params['data']['description'] +
								'</article>' +
							'</section>' +
						'</div>' +
					'</div>'
				);
			}
			else {
				$html.find('.gallery-container').html(
					'<section class="image-part">' +
						'<section class="image-view-panel">' +
							'<span class="fa fa-spin fa-spinner" aria-name="spinner" style="display: none;"></span>' +
							'<img aria-name="image" class="image" src="#" style="display: none;" />' +
						'</section>' +
						'<section class="image-description-panel">' +
							'<div class="text-center" aria-name="description"></div>' +
						'</section>' +
						'<section class="image-list-panel">' +
							'<ul class="item-list">' +
							'</ul>' +
						'</section>' +
					'</section>'
				);
			}

			$body.append($html);

		// / Create html

		// Create items list

			var $itemList = $html.find('.item-list');

			if ('images' in params['data']) {
				hasActive = false;
				$(params['data']['images']).each(function() {
					$itemList.append('<li class="item" data-description="' + (this.description || '') + '"><img src="' + this.thumb + '" data-src="' + this.original + '" /></li>');	
					if (this.active) {
						showImage($itemList.children().last());
						hasActive = true;
					}
				});
				if (!hasActive) {
					showImage($itemList.children().first());
				}
				if (params['data']['images'].length == 1) {
					$('.image-list-panel').hide();
				}
			}
			else {
				// $html.find('[aria-name="spinner"]').show();
				// $html.find('[aria-name="image"]').hide();
				// $.ajax({
				// 	url: '/' + $button.attr('aria-gallery') + 's/get_gallery/' + $button.data('value'),
				// 	dataType: 'JSON'
				// }).always(function () {
				// 	$html.find('[aria-name="spinner"]').hide();
				// 	$html.find('[aria-name="image"]').show();
				// }).done(function(data) {
				// 	if (data.status == 0) {			
				// 		$(data.result).each(function() {
				// 			$itemList.append('<li class="item" data-description="' + this.description + '"><img src="' + this.small + '" data-src="' + this.original + '" /></li>');	
				// 			if (this.id == $button.data('id')) {
				// 				showImage($itemList.children(':last-child'));
				// 			}
				// 		});		
				// 		initChangeImage();
				// 	}
				// 	else {
				// 		turn_off_popup_gallery();
				// 	}
				// }).fail(function() {
				// 	turn_off_popup_gallery();
				// });
			}

		// / Create items list

		// Show image

			function showImage($item) {
				if ($item.hasClass('selected')) {
					return;
				}

				var src = $item.find('img').data('src');

				$item.siblings('.selected').removeClass('selected');
				$item.addClass('selected');

				// Set description
				$html.find('[aria-name="description"]').text($item.data('description'));

				// Set max height
				$html.find('[aria-name="image"]').css('max-height', $html.find('.image-view-panel')[0].getBoundingClientRect().height - 10 + 'px');

				
				$html.find('[aria-name="image"]').hide();
				$html.find('[aria-name="spinner"]').show();	
				var loadImage = new Image();
				loadImage.onload = function(){
					$html.find('[aria-name="image"]').attr('src', src);

					$html.find('[aria-name="spinner"]').hide();
					$html.find('[aria-name="image"]').show();
				};
				loadImage.src = src;
			}

		// / Show image

		// Events

			$itemList.find('.item').on('click', function () {
				showImage($(this));
			});

			$document.on('keydown.popup_gallery', function (e) {
				switch (e.keyCode) {
					case 37:
					case 40:
						e.preventDefault();
						prevImage();
						break;
					case 38:
					case 39:
						e.preventDefault();
						nextImage();
						break;
					case 27:
						e.preventDefault();
						turn_off_popup_gallery();
						break;
				}
			});

			if (isMobile()) {
				$html.find('.image-view-panel').on({
					swipeleft: function () {
						prevImage();
					},
					swiperight: function () {
						nextImage();
					}
				});
			}

			$html.find('.image').on('click', function (e) {
				e.stopPropagation();
				nextImage();
			});

			function prevImage() {
				var $selected = $itemList.find('.selected');

				if ($selected.is(':first-child')) {
					showImage($itemList.find('.item:last-child'));
				}
				else {
					showImage($selected.prev());
				}
			}

			function nextImage() {
				var $selected = $itemList.find('.selected');

				if ($selected.is(':last-child')) {
					showImage($itemList.find('.item:first-child'));
				}
				else {
					showImage($selected.next());
				}
			}

			_initHorizontalListScroll($html.find('.image-list-panel'));

			$html.find('[aria-click="close"], .image-view-panel').on('click', function () {
				turn_off_popup_gallery();
			});

			function turn_off_popup_gallery() {
				$(document).off('keydown.popup_gallery');
				$html.remove();
			};

		// / Events

	}

// / Gallery

// Context menu

	/*
		params
			position(*): {
				x, y
			}
			items(*): [{
				text, handle
			}]
	*/
	function _contextMenu(params) {
		if (typeof params == 'undefined' || !('items' in params)) {
			return;
		}
		var 
			$contextMenu = $('<article class="context-menu-container" style="top: ' + params['position']['y'] + 'px; left: ' + params['position']['x'] + 'px"></article>'),
			$list = $('<ul></ul>');

		$body.append($contextMenu);
		$contextMenu.html($list);

		// Create items
			
			$(params['items']).each(function () {
				$item = $(
					'<li>' +
						'<a>' +
							this.text +
						'</a>' +
					'</li>'
				);

				$item.on('click', this.handle)
				$list.append($item);
			});
		
		// / Create items

		// Events
			
			setTimeout(function () {
				$document.on({
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
			});
			
		// / Events
	}

// / Context menu

// Manual horizontal list
	
	/*
		params:
			col_full_width
			auto_next
	*/
	function _initManualHorizontalList($containers, params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		$containers.each(function () {
			var $container = $(this);
			if ($container.data('horizontal_list')) {
				$container.trigger('update_horizontal_list');
				return;
			}

			var 
				$listWrapper = $container.find('.list-wrapper'),
				$list = $container.find('.list'),
				$showingCol = $list.children(':eq(0)'),
				scrollInterval,
				continueScroll = function () {
					if ($showingCol.is(':last-child')) {
						$showingCol = $list.children().first();
					}
					else {
						$showingCol = $showingCol.next();
					}

					$listWrapper.animate({
						scrollLeft: $listWrapper.scrollLeft() + $showingCol.offset().left + $showingCol.outerWidth() - ($listWrapper.offset().left + parseInt($listWrapper.css('padding-left')) + $listWrapper.width())
					}, 200);
				};

			// Create prev, next buttons
			$container.prepend('<section class="prev"><span class="fa fa-chevron-left"></span></section><section class="next"><span class="fa fa-chevron-right"></span></section>');

			// Update event
			$container.on('changedSize show', function () {
				// Set col full width & scroll to showing col
				if (params['col_full_width']) {
					$container.find('.col').css('width', $container.find('.list-wrapper').width() + 'px');
					$listWrapper.animate({
						scrollLeft: $listWrapper.scrollLeft() + $showingCol.offset().left + $showingCol.outerWidth() - ($listWrapper.offset().left + parseInt($listWrapper.css('padding-left')) + $listWrapper.width())
					}, 200);
				}

				$firstCol = $list.children().first();
				$lastCol = $list.children().last()

				// Status for prev, next buttons
				if ($list.children().length > 0 && ($list.outerWidth() - parseInt($firstCol.css('margin-left')) - parseInt($lastCol.css('margin-right'))) > $listWrapper.width()) {
					$container.find('> .prev, > .next').show();

					// If have much col, save showing col for find
					$list.children().each(function () {
						$col = $(this);
						if ($col.offset().left + $col.outerWidth() > $listWrapper.offset().left) {
							$showingCol = $col;
							return false;
						}
					});
				}
				else {
					$container.find('> .prev, > .next').hide();
				}
			}).trigger('changedSize').attr('aria-listen', ($container.attr('aria-listen') ? $container.attr('aria-listen') + ' ' : '') + 'show');

			// Window resize
			$window.on('resize', function () {
				$container.trigger('changedSize');
			});

			// Auto next
			if (params['auto_next'] && $list.children().length > 1) {
				if (params['auto_next_delay']) {
					setTimeout(function () {
						scrollInterval = setInterval(function () {
							continueScroll();
						}, params['auto_next']);
					}, params['auto_next_delay'])
				}
				else {
					scrollInterval = setInterval(function () {
						continueScroll();
					}, params['auto_next']);	
				}
				
				$container.on({
					mouseenter: function () {
						clearInterval(scrollInterval);
					},
					mouseleave: function () {
						scrollInterval = setInterval(function () {
							continueScroll();
						}, params['auto_next']);
					}
				})
			}

			// Button events
			$container.find('> .prev').on('click', function (e) {
				e.stopPropagation();

				// Find col can't see from showing col - right to left
				$lastCol = [];
				offsetForCantSee = $listWrapper.offset().left + parseInt($listWrapper.css('padding-left'));
				$cantSeeCol = (function findCantSeeCol($checkCol) {
					// If empty => choose last col
					if ($checkCol.length == 0) {
						return $lastCol;
					}

					// If can't see => choose
					if ($checkCol.offset().left + $checkCol.outerWidth() <= offsetForCantSee) {
						return $checkCol;
					}

					$lastCol = $checkCol;
					return findCantSeeCol($checkCol.prev());
				})($showingCol.prev());

				// If empty => last
				if ($cantSeeCol.length == 0) {
					$cantSeeCol = $list.children().last();
				}

				// Unless first child => get prev child for display
				// if (!$cantSeeCol.is(':first-child')) {
				// 	$cantSeeCol = $cantSeeCol.prev();
				// }

				// Scroll to can't see col
				$listWrapper.animate({
					scrollLeft: $listWrapper.scrollLeft() + $cantSeeCol.offset().left - offsetForCantSee
				}, 200);
				$showingCol = $cantSeeCol;

				continueScroll = function () {
					if ($showingCol.is(':first-child')) {
						$showingCol = $list.children().last();
					}
					else {
						$showingCol = $showingCol.prev();
					}
					$listWrapper.animate({
						scrollLeft: $listWrapper.scrollLeft() + $showingCol.offset().left - ($listWrapper.offset().left + parseInt($listWrapper.css('padding-left')))
					}, 200);
				}
			});
			$container.find('> .next').on('click', function (e) {
				e.stopPropagation();

				// Find col can't see from showing col - left to right
				$lastCol = [];
				offsetForCantSee = $listWrapper.offset().left + parseInt($listWrapper.css('padding-left')) + $listWrapper.width();
				$cantSeeCol = (function findCantSeeCol($checkCol) {
					// If empty => choose last col
					if ($checkCol.length == 0) {
						return $lastCol;
					}

					// If can't see => choose
					if ($checkCol.offset().left >= offsetForCantSee) {
						return $checkCol;
					}

					$lastCol = $checkCol;
					return findCantSeeCol($checkCol.next());
				})($showingCol.next());

				// If empty => first
				if ($cantSeeCol.length == 0) {
					$cantSeeCol = $list.children().first();
				}

				// Unless last child => get next child for display
				// if (!$cantSeeCol.is(':last-child')) {
				// 	$cantSeeCol = $cantSeeCol.next();
				// }

				// Scroll to can't see col
				$listWrapper.animate({
					scrollLeft: $listWrapper.scrollLeft() + $cantSeeCol.offset().left + $cantSeeCol.outerWidth() - offsetForCantSee
				}, 200);
				$showingCol = $cantSeeCol;

				continueScroll = function () {
					if ($showingCol.is(':last-child')) {
						$showingCol = $list.children().first();
					}
					else {
						$showingCol = $showingCol.next();
					}
					
					$listWrapper.animate({
						scrollLeft: $listWrapper.scrollLeft() + $showingCol.offset().left + $showingCol.outerWidth() - ($listWrapper.offset().left + parseInt($listWrapper.css('padding-left')) + $listWrapper.width())
					}, 200);
				}
			});

			$container.data('horizontal_list', true);
		});
	}

// / Manual horizontal list

// Popup 

	function _getPopupContent() {
		$('[aria-popupcontent]').each(function () {
			_popupContent[this.getAttribute('aria-popupcontent')] = this.outerHTML;
			this.remove();
		});
	}

	/*
		params:
			id: (popup_full)
				id of popup.
				if wanna show two popup, ids must different
			z-index: (30)
				z-index of popup
			overlay:
				transparent
				gray
			width: (none)
				small, medium, large, maximum
			esc: (true)
				allow escape popup with click outside or 'esc' key
	*/
	function getPopup(params) {
		if (typeof(params) == 'undefined') {
			params = {};
		}

		var 
			id = ('id' in params) ? params.id : 'popup_full',
			zIndex = 'z-index' in params ? params['z-index'] : '30',
			esc = !('esc' in params) || params.esc,
			overlay = 'overlay' in params ? params['overlay'] : 'transparent',
			width = 'width' in params ? params['width'] : '';

		var $popup = $('#' + id);

		if ($popup.length == 0) {
			$popup = $(
				'<article id="' + id + '" style="z-index: ' + zIndex + ';" class="popup-full-container">' +
					'<div class="popup-full">' +
						'<section class="popup-close">&times;</section>' +
						'<section class="popup-content"></section>' +
					'</div>' +
				'</article>');

			$popup.find('.popup-close').add($popup).on('click', function () {
				if ($popup.is('[data-esc]')) {
					$popup.off();
				}
			});
			$popup.children().on('click', function (e) {
				e.stopPropagation();
			});

			$('main').append($popup);
		}

		$popup.attr('data-width', width);

		if (esc) {
			$popup.attr('data-esc', '');
		}
		else {
			$popup.removeAttr('data-esc');
		}

		$popup.on = function () {
			$popup.addClass('on');
			$popup.scrollTop(0);
			$(document).on('keydown.turn_off_popup_' + id, function (e) {
				if ($popup.is('[data-esc]')) {
					if (e.keyCode == 27) {
						e.preventDefault();
						$popup.off();
					}
				}
				if ('enterKey' in params) {
					if (e.keyCode == 13) {
						e.preventDefault();
						$popup.find('[data-type="primary_button"]').click();
					}
				}
			});
			$body.css('width', $body.width() + 'px');
			$body.addClass('no-scroll');
		}

		$popup.off = function (isButtonClick) {
			$popup.removeClass('on');
			$(document).off('keydown.turn_off_popup_' + id);
			if ($('.popup-full-container.on').length == 0) {
				$body.removeClass('no-scroll');
				$body.css('width', '');	
			}

			// $popup.trigger('onEscape');
			if ($popup.data('onEscape')) {
				$popup.data('onEscape')(isButtonClick);
			}
		};

		return $popup;
	}

	/*
		*
			html: (* or url)
				popup content
		OR
			url: (* or html)
				url to load popup content
			urlData
			success:
				function ($popup)
			always:
			fail:

		esc: (true)
			allow escape popup with click outside or 'esc' key
		id: (popup_full)
			id of popup.
			if wanna show two popup, ids must different
		z-index: (30)
			z-index of popup
		overlay: (transparent) 
			transparent, gray
		width: (none)
			small, medium, large, maximum
		onEscape:
			handle on popup escape
	*/
	function popupFull(params) {
		if (typeof params == 'undefined' || !('url' in params || 'html' in params)) {
			return;
		}

		// Get popup
		var popupParams = {};
		popupParams.esc = !('esc' in params) || params.esc;
		popupParams.id = 'id' in params ? params.id : 'popup_full';
		popupParams['z-index'] = 'z-index' in params ? params['z-index'] : '30';
		popupParams['overlay'] = 'overlay' in params ? params['overlay'] : 'transparent';
		popupParams['width'] = 'width' in params ? params['width'] : '';

		var $popup = getPopup(popupParams);

		$popup.data('onEscape', params.onEscape);

		var $popupContent = $popup.find('.popup-content');

		if ('html' in params) {
			$popupContent.html(params.html);

			// Turn on popup    
			$popup.on();

			// Turn off popup
			$popup.find('[aria-click="close-popup"]').on('click', function () {
				$popup.off();
			});
		}
		else {
			// Url
			$.ajax({
				url: params.url,
				data: params.urlData,
				dataType: 'JSON'
			}).always(function () {
				if ('always' in params) {
					params['always']();
				}
			}).done(function (data) {
				if (data.status == 0) {
					$popupContent.html(data.result);

					// Turn on popup    
					$popup.on();

					// Turn off popup
					$popup.find('[aria-click="close-popup"]').on('click', function () {
						$popup.off();
					});

					if ('success' in params) {
						params['success']($popup);
					}
				}
				else {
					$popup.remove();

					if ('fail' in params) {
						params['fail']();
					}
					else {
						errorPopup();
					}
				}
			}).fail(function () {
				$popup.remove();

				if ('fail' in params) {
					params['fail']();
				}
				else {
					errorPopup();
				}
			});
		}

		return $popup;
	}

	/*
		title:
			title of popup
		content:
			content of popup
		type: (default)
			type of popup
		buttons: (escape button - default - Close)
			array of button
				text: (Button)
					text of button
				type: (default)
					type of button
				handle: (close popup)
					handle on click button
					return false if want prevent close
		esc: (true)
			allow escape popup with click outside or 'esc' key
		overlay: (transparent)
			transparent, gray
		id: (popup_prompt)
			id of popup.
			if wanna show two popup, ids must different
		z-index: (31)
			z-index of popup
		onEscape:
			handle on popup escape

	*/
	function popupPrompt(params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		// Get popup

		var popupParams = { enterKey: true };
		popupParams.esc = !('esc' in params) || params.esc;
		popupParams.id = 'id' in params ? params.id : 'popup_prompt';
		popupParams['z-index'] = 'z-index' in params ? params['z-index'] : '31';
		popupParams['overlay'] = 'overlay' in params ? params['overlay'] : 'transparent';

		var $popup = getPopup(popupParams);

		$popup.data('onEscape', params.onEscape);

		// Get popup content

		var $popupContent = $popup.find('.popup-content');

		$popupContent.css({
			width: 'auto',
			height: 'auto'
		});

		var 
			type = 'type' in params ? params.type : 'default',
			title = 'title' in params ? params.title : null,
			content = 'content' in params ? params.content : null,
			buttons = 'buttons' in params ? params.buttons : null;

		var $box = $('<article class="box box-' + type + ' margin-0"></article>');

		$popupContent.html($box);

		// Popup title
		if (title) {
			$box.append('<section class="box-header with-border"><h2 class="box-title">' + title + '</h2></section>');
		}

		// Popup content
		if (content) {
			$box.append('<section class="box-body">' + content + '</section>');
		}

		// Popup buttons

		var $buttonContainter = $('<section class="box-footer text-center"></section>');
		$box.append($buttonContainter);

		if (buttons) {
			$(buttons).each(function () {
				var 
					button = this,
					text = 'text' in button ? button.text : 'Button',
					type = 'type' in button ? button.type : 'default',
					handle = 'handle' in button ? button.handle : null;

				var $button = $('<button class="btn btn-flat btn-' + type + ' margin-5" ' + (button.primaryButton ? 'data-type="primary_button"' : '') + '>' + text + '</button>');

				$button.on('click', function () {
					if (handle) {
						if (handle() == false) {
							return;
						}
					}
					$popup.off($(this));
				});

				$buttonContainter.append($button);
			});
		}
		else {
			var $button = $('<button type="button" class="btn btn-flat btn-default margin-5">' + _t.form.close + '</button>');

			$button.on('click', function () {
				$popup.off($(this));
			});

			$buttonContainter.append($button);
		}

		// Turn on popup    
		$popup.on();

		// Turn off popup
		$popup.find('[aria-click="close-popup"]').on('click', function () {
			$popup.off();
		});
	}

	function errorPopup() {
		popupPrompt({
			title: _t.form.error_title,
			type: 'danger',
			content: _t.form.error_content
		});
	}

	function _errorPopup() {
		popupPrompt({
			title: _t.form.error_title,
			type: 'danger',
			content: _t.form.error_content
		});
	}

// / Popup