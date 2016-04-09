$(function () {

	var find;

	// List

		// Item
		
			function initItems() {
				$('#list .status select, #list .note textarea').on('change', function () {
					data = {
						request: {
							id: $(this).closest('tr').data('value')
						}
					};
					data['request'][this.name] = this.value;

					$.ajax({
						url: '/contact_requests/manage_save',
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

				$('#list .user a').on('click', function () {
					popupFull({
						url: '/projects/_request_manage_user_info',
						urlData: {
							user_id: $(this).data('value'),
							user_type: $(this).data('type')
						},
						width: 'small'
					});
				})
			}
		
		// / Item

		// Pagination
		
			find = _initPagination({
				url: '/projects/_requests_manage_list',
				pagination: $('#pagination'),
				done: function (content) {
					$('#list').html(content);
					initItems();
				}
			});
		
		// / Pagination

		initItems();
	
	// / List
});