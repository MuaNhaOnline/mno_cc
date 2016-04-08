$(function () {

	var find;

	// List

		find = _initPagination({
			url: '/real_estates/_requests_manage_list',
			pagination: $('#pagination'),
			done: function (content) {
				$('#list').html(content);
			}
		});
	
	// / List
});