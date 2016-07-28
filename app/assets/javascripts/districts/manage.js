$(function () {
	var
		$list = $('#list'),
		$form = $('#form');

	initItem();

	function initItem() {
		$list.sortable({
			cursor: 'move',
			axis: 'y',
			dropOnEmpty: false,
			handle: '[data-action="move"]',
			revert: 100,
			tolerance: 'pointer',
			activate: function () {
				$list.addClass('dragging');
			},
			deactivate: function () {
				$list.removeClass('dragging');
			},
			update: function (event, ui) {
				// Item
				var $item = ui.item;

				// Old order
				var oldOrder = $item.attr('data-order');

				// Check sign
				var sign = ui.position.top > ui.originalPosition.top  ? 1 : -1;

				// New order
				var newOrder = (sign == 1 ? $item.prev() : $item.next()).attr('data-order');

				// Update items
				$item.attr('data-order', newOrder);
				(sign == 1 ? $item.prevAll() : $item.nextAll())
					.filter(function () {
						return sign * ($(this).attr('data-order') - oldOrder) > 0
					})
					.each(function () {
						$(this).attr('data-order', $(this).attr('data-order') - sign);
					});

				// Ajax
				$.ajax({
					url: '/districts/update_order',
					data: {
						id: $item.data('value'),
						order: newOrder
					},
					method: 'POST'
				}).done(function (data) {
					if (data.status != 0) {
						_errorPopup();
					}
				}).fail(function () {
					_errorPopup();
				});
			}
		});
	}

	// Search form
	$form.find('select').on('change', function () {
		$.ajax({
			url: $form.attr('action'),
			data: $form.serialize()
		}).done(function (data) {
			if (data.status == 0) {
				$list.html(data.result);
				initItem();

				_replaceState(this.url);
			}
			else {
				_errorPopup();
			}
		}).fail(function () {
			_errorPopup();
		});
	});
});