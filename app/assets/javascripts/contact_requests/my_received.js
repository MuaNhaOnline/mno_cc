var page, per;

$(function () {

	var
		pagination;

	// Item
	
		function initItems() {
			$('#list .message textarea').on('change', function () {
				data = {
					request: {
						id: $(this).closest('tr').data('value')
					}
				};
				data['request'][this.name] = this.value;

				$.ajax({
					url: '/contact_requests/save',
					method: 'POST',
					data: data,
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {

					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				})
			});

			initReadTime($('#list'));
		}
	
	// / Item

	// Pagination

		// Init pagination
		pagination = _initPagination2({
			url: 			window.location.pathname,
			list: 			$('#list'),
			paginator: 		$('#paginator'),
			replaceState: 	true,
			done: 			function () {
								initItems();
							}
		});
	
	// / Pagination

	initItems();
	
});