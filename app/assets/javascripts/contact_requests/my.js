$(function () {

	var find;

	// List

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
		
			find = _initPagination({
				url: '/contact_requests/_my_list',
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