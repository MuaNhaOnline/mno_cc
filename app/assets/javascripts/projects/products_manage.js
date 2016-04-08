$(function () {

	var searchData = null, find;

	// Search

		var $searchForm = $('#search_form');

		initPagination();
		initForm($searchForm, {
			submit: function () {
				searchData = {};
				$.each($searchForm.serializeArray(), function () {
					searchData[this.name] = this.value;
				});
				find();
			}
		});
	
	// / Search

	// List
	
		function initItemList() {
			$('#list tr [aria-object="status"]').on('change', function () {
				var $item = $(this).closest('tr');

				$.ajax({
					url: '/projects/set_product_status',
					method: 'POST',
					data: {
						product_type: $item.data('type'),
						product_id: $item.data('value'),
						product_status: this.value
					},
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
		}

		function initPagination() {
			find = _initPagination({
				url: '/projects/_products_manage_list',
				pagination: $('#pagination'),
				data: function () {
					return searchData;
				},
				done: function (content) {
					$('#list').html(content);
					initItemList();
				}
			});
		}
	
	// / List

});