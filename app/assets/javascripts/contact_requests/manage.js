var page, per, byStatus;

$(function () {

	var
		pagination,
		byStatusCode = $('#by_status :selected').data('value');

	// By status
	
		$('#by_status').on('change', function () {
			byStatusCode 	= 	$(this).find(':selected').data('value');
			byStatus 		= 	this.value;

			pagination.find({
				data: {
					by_status: 	byStatus,
				},
				scrollTo: 	false
			});
		});
	
	// / By status

	// Item
	
		function initItems() {
			$('#list button[type="submit"]').on('click', function () {
				var 
					$button = $(this);
					$item 	= $button.closest('tr');

				data = $item.find(':input').serialize();

				$button.startLoadingStatus('submit');
				$.ajax({
					url: '/contact_requests/manage_save',
					method: 'POST',
					data: data,
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						if (byStatusCode.indexOf($item.find('[name="request[status]"]').val()) == -1) {
							// Remove item immediate
							$item.prev().remove();
							$item.remove();

							// Reload page
							var findData = pagination.lastData;
							if ($('#list').children().length == 0) {
								if (findData.page != 1) {
									findData.page--;
								}
							}
							pagination.find({
								data: 		findData,
								scrollTo: 	false
							});
						}
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				}).always(function () {
					$button.endLoadingStatus('submit');
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

		// Init pagination
		pagination = _initPagination2({
			url: 			window.location.pathname,
			list: 			$('#list'),
			paginator: 		$('#paginator'),
			replaceState: 	true,
			done: 			function () {
								initItems();
							}
		})

		// Set last data
		pagination.lastData = {
			by_status: 	byStatus
		}
	
	// / Pagination

	initItems();
	
});