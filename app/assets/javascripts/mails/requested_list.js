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
			// Update request info
			$('#list button[type="submit"]').on('click', function () {
				var 
					$button = $(this);
					$item 	= $button.closest('tr'),
					id 		= $item.data('value');

				data = $item.find(':input').serialize();

				$button.startLoadingStatus('submit');
				$.ajax({
					url: '/mails/save_request/' + id,
					method: 'POST',
					data: data
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

			// Reply
			$('#list [data-action="reply"]').on('click', function () {
				var id = $(this).closest('tr').data('value');

				popupFull({
					url: 		'/mails/_form',
					urlData: 	{
									reply_id: id
								},
					width: 		'medium',
					success: 	function ($popup) {
									var $form = $popup.find('form');

									initForm($form, {
										submit: function () {
											$.ajax({
												url: 		$form.attr('action'),
												method: 	'POST',
												data: 		$form.serialize()
											}).done(function (data) {
												if (data.status == 0) {
													popupPrompt({
														title: 'Trả lời thành công'
													});
													$popup.off();
												}
												else {
													_errorPopup();
												}
											}).fail(function () {
												_errorPopup();
											});
										}
									});
								}
				});
			});

			// View user into
			$('#list .user a').on('click', function () {
				popupFull({
					url: 		'/contact_requests/_manage_user_info',
					urlData: 	{
									user_id: $(this).data('value'),
									user_type: $(this).data('type')
								},
					width: 		'small'
				});
			});

			// Read time
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
			alert: 			$('#alert'),
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