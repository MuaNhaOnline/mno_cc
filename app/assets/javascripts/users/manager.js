$(function () {

	initSearch($('#system_manager'))

	/*
		Search
	*/

	function initSearch ($box) {
		_initSearchablePagination($box.find('[aria-object="list"]'), $box.find('[aria-object="search"]'), $box.find('[aria-object="pagination"]'), {
			url: '/users/_manager_list'
		});
	}

	/*
		/ Search
	*/
});