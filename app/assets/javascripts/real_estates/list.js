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

	// Fixed search box

		$(window).on('resize', function () {
			$('.re-list .search-box-container').css('width', $('.re-list .search-box-container').parent().width() + 'px');
		});
		$('.re-list .search-box-container').css('width', $('.re-list .search-box-container').parent().width() + 'px');

		_initFixedScroll(
			$('.re-list .search-box-container'), 
			$('#res_list'),
			{
				addMax: -10
			}
		);
	
	// / Fixed search box

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