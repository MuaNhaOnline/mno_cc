$(function () {
	customPrototype();
	customJquery();
	_initGlobalEvent();

	// Init

	(function () {
		$('[data-toggle="offcanvas"]').on('click', function () {
			$.cookie('sidebar_collapse', $body.is('.sidebar-collapse') ? '1' : '0');
		});

		// Notification
			
			function initItems($items) {
				$items.siblings('.unread').on('mouseenter.change_read_status click.change_read_status', function () {
					var $item = $(this);

					$item.removeClass('unread');
					var remain = $('#notifications_list li.unread').length;
					if (remain != 0) {
						$('#notification_count').text(remain);
					}
					else {
						$('#notification_count').remove();
					}

					$.ajax({
						url: '/notifications/set_read_status/' + $item.data('value'),
						method: 'POST',
						dataType: 'JSON'
					});
				});	
			}

			initItems($('#notifications_list li'));

			var loading = false, page = 1;
			$('#notifications_list').on('scroll', function () {
				if (this.scrollTop + $(this).height() >= this.scrollHeight - 50 && !loading) {
					loading = true;
					$.ajax({
						url: '/notifications/load_more',
						data: {
							page: ++page
						},
						dataType: 'JSON'
					}).always(function () {
						loading = false;
					}).done(function (data) {
						if (data.status == 0) {
							var $newItems = $(data.result);
							initItems($newItems);
							$('#notifications_list').append($newItems);
						}
						else {
							page--;
						}
					}).fail(function () {
						page--;
					});
				}
			});
		
		// / Notification
	})();

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

// Same contact popup (temporary from frontlayout)

	function _openSameContactPopup($html, params) {
		if (typeof params == 'undefined') {
			params = {};
		}

		var $popup = popupFull({
			html: $html,
			width: 'medium',
			esc: false,
			id: 'same_contact_popup'
		});

		$html.find('[aria-click="yes"]').on('click', function () {
			$popup.off();

			if ('yes' in params) {
				params['yes']();
			}
		});

		$html.find('[aria-click="no"]').on('click', function () {
			$popup.off();

			if ('no' in params) {
				params['no']();
			}
		});

		$html.find('[aria-click="sign_in"]').on('click', function () {
			$popup.off();
			_openSignInPopup();
		});
	}

// / Same contact popup (temporary from frontlayout)