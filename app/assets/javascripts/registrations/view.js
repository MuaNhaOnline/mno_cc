$(function () {
	// Delete
	
		$('#reg_info [data-action="delete"]').on('click', function () {
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
					window.location = data.result.redirect;
				}
				else {
					_errorPopup();
				}
			}).fail(function () {
				_errorPopup();
			});
		});
	
	// / Delete

	// Pagination
	
		var pagination = _initPagination2({
			url: 			window.location.pathname,
			list: 			$('#list'),
			paginator:  	$('#paginator'),
		});
	
	// / Pagination
});