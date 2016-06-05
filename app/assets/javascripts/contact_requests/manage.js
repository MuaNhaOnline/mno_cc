var currentPage;

$(function () {

	var
		find,
		currentStatus = $('#by_status :selected').data('value');

	// By status
	
		$('#by_status').on('change', function () {
			currentStatus = $(this).find(':selected').data('value');
			find({
				data: {
					by_status: this.value
				}
			});
		});
	
	// / By status

	// Item
	
		function initItems() {
			$('#list button[type="submit"]').on('click', function () {
				var $item = $(this).closest('tr');

				data = $item.find(':input').serialize();

				toggleLoadStatus(true);
				$.ajax({
					url: '/contact_requests/manage_save',
					method: 'POST',
					data: data,
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						a = currentStatus;
						b = $item.find('[name="request[status]"]').val();
						if (currentStatus.indexOf($item.find('[name="request[status]"]').val().toString()) == -1) {
							find({
								data: 'last_data',
								note: 'reload'
							});
						}
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				}).always(function () {
					toggleLoadStatus(false);
				})
			});

			$('#list .user a').on('click', function () {
				popupFull({
					url: '/contact_requests/_manage_user_info',
					urlData: {
						user_id: $(this).data('value'),
						user_type: $(this).data('type')
					},
					width: 'small'
				});
			});

			initReadTime($('#list'));
		}
	
	// / Item

	// Pagination
	
		find = _initPagination({
			url: 			window.location.pathname,
			replaceState: 	true,
			pagination: 	$('#pagination'),
			list: 			$('#list'),
			init_list: 		function ($list, note) {
								initItems();
								if (note != 'reload') {
									_scrollTo($('.content').offset().top);
								}
							}
		});
	
	// / Pagination

	initItems();
	
});