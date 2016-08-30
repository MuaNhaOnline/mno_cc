$(function () {
	$('#registrations .item [data-action="delete"]').on('click', function () {
		var	$button = $(this),
			$item = $button.closest('.item');

		$button.startLoadingStatus();
		$.ajax({
			url: '/registrations/delete/' + $item.data('value'),
			method: 'POST'
		}).always(function () {
			$button.endLoadingStatus();
		}).done(function (data) {
			if (data.status == 0) {
				$item.remove();
			}
			else {
				_errorPopup();
			}
		}).fail(function () {
			_errorPopup();
		});
	});
});