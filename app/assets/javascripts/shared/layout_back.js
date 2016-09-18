$(function () {
	_initGlobalEvent();

	// Init

	(function () {

		// Notification

			var
				page 	= 	0,
				loading = 	false,
				$list 	= 	$('#_notifications_list');

			// Load items
			function loadItems(untilFull) {
				if (loading) {
					return;
				}

				// Loading status
				loading = $('<li class="text-center" style="padding: 10px;"></li>');
				$list.append(loading);
				loading.startLoadingStatus();
				$.ajax({
					url: '/notifications/_mini_list',
					data: {
						page: ++page
					}
				}).always(function () {
					loading.remove();
					loading = false;
				}).done(function (data) {
					if (data.status == 0) {
						var $newItems = $(data.result);
						initItems($newItems);
						$list.append($newItems);

						if (untilFull) {
							if ($list.prop('scrollHeight') < $list.parent().height()) {
								loadItems(true);
							}
						}
					}
					else if (data.status == 1) {
						// Set loading = true for stop load item again
						loading = true;
					}
					else {
						page--;
					}
				}).fail(function () {
					page--;
				});
			}

			function setReadItem($item) {
				$item.removeClass('unread');
				var remain = $('#_notifications_list li.unread').length;
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
			}
			
			function initItems($items) {
				$items.filter('.unread').on('mouseenter.change_read_status click.change_read_status', function () {
					setReadItem($(this));
				});	
			}

			// First load notification button
			$('#_notification_button').on('click.loadItems', function () {
				$(this).off('click.loadItems');
				loadItems(true);
			});

			$list.on('scroll', function () {
				if (this.scrollTop + $(this).height() >= this.scrollHeight - 50 && !loading) {
					loadItems();
				}
			});
		
		// / Notification
	})();

	// / Init

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