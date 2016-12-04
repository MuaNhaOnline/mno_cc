$(function () {

	// Init favorite items list
	
		_initLargeItemsList($('#favorite_res_list'));
	
	// / Init favorite items list

	// Init items list
	
		function initItemList() {
			_initMediumItemsList($('#res_list'));
		}
		initItemList();
	
	// / Init items list

	// Pagination
	
		_initPagination3({
			url:			'',
			list:			$('#res_list'),
			paginator:		$('#res_paginator'),
			replaceState: 	true,
			done:			function () {
								initItemList();
							}
		});
	
	// / Pagination

});