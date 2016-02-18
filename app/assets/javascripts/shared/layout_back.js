var _temp = {}, _popupContent = {};

$(function () {
	init();
	initSize();
	_getPopupContent();
	customPrototype();
	customJquery();
	_initGlobalEvent();

	// Init

	function init() {
		$('[data-toggle="offcanvas"]').on('click', function () {
			$.cookie('sidebar_collapse', $body.is('.sidebar-collapse') ? '1' : '0');
		});
	}

	// / Init

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

	// Custom jquery

	function customJquery() {

	}

	// / Custom jquery

});

// Global event

	function _initGlobalEvent($container) {
		if (typeof $container == 'undefined') {
			$container = $body;
		}

		// Collapse box

			$container.find(($container.is('.box') ? '' : '.box ') + '[aria-click="collapse-box"]').off('click').on('click', function () {
				var 
					$button = $(this),
					$box = $button.closest('.box');

				if ($box.is('.collapsed-box')) {
					$box.children('.box-body, .box-footer').slideDown();
					$box.removeClass('collapsed-box');
				}
				else {
					$box.children('.box-body, .box-footer').slideUp();
					$box.addClass('collapsed-box');
				}
			});

		// / Collapse box
	}

// / Global event

// Helper

	function toggleLoadStatus(on) {
		if (on) {
			$body.addClass('loading');
		}
		else {
			$body.removeClass('loading');
		}
	}

	function dataURLToBlob(dataURL, type) {
		var 
			byteString = atob(dataURL.split(",")[1]),
			ab = new ArrayBuffer(byteString.length),
			ia = new Uint8Array(ab),
			i;

		for (i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ab], {
			type: type
		});
	}

// / Helper

// Status animation

	function _initStatusAnimation($item) {
		$item.find('.status-animation').on({
			mouseenter: function () {
				var $node = $(this);
				$node.find('.text').stop().animate({
					width: $node.find('.text span').width() + 12.5
				}, 300);
			},
			mouseleave: function () {
				var $node = $(this);
				$node.find('.text').stop().animate({
					width: 0
				}, 300);
			}
		})
	}

// / Status animation

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
		if (typeof(params) === 'undefined') {
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
			$popup = $('<article id="' + id + '" style="z-index: ' + zIndex + ';" class="popup-full-container"><section class="popup-close"></section><section class="popup-full"><article class="popup-content"></article></section></article>');

			$popup.find('.popup-close').on('click', function () {
				if ($popup.is('[aria-esc]')) {
					$popup.off();
				}
			});

			$body.append($popup);
		}

		$popup.attr('aria-width', width);

		if (esc) {
			$popup.attr('aria-esc', '');
		}
		else {
			$popup.removeAttr('aria-esc');
		}

		if (overlay == 'gray') {
				$popup.addClass('gray');
		}
		else {
				$popup.removeClass('gray');
		}

		$popup.on = function () {
			$popup.addClass('on');
			$(document).on('keydown.turn_off_popup_' + id, function (e) {
				if ($popup.is('[aria-esc]')) {
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
			$body.addClass('no-scroll');
		}

		$popup.off = function (isButtonClick) {
			$popup.removeClass('on');
			$(document).off('keydown.turn_off_popup_' + id);
			$body.removeClass('no-scroll');

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
			success:
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
		if (typeof params === 'undefined' || !('url' in params || 'html' in params)) {
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
				}
			}).fail(function () {
				$popup.remove();

				if ('fail' in params) {
					params['fail']();
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
		if (typeof params === 'undefined') {
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

// / Popup

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

// String

	var listString = {};

	listString.has = function (key, string) {
		if (string) {
			return string.split(' ').indexOf(key) != -1; 
		}
		else {
			return false;
		}
	}

	listString.add = function (key, string) {
		if (!string) {
			return key;
		}

		if (listString.has(key, string)) {
			return string;
		}
		
		return string + ' ' + key;
	}

	listString.remove = function (key, string) {
		if (string) {
			return string.replace(new RegExp(key, 'g'), ''); 
		}
		else {
			return '';
		}
	}

// / String