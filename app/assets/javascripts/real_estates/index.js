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
			$('.re-index .search-box-container').css('width', $('.re-index .search-box-container').parent().width() + 'px');
		});
		$('.re-index .search-box-container').css('width', $('.re-index .search-box-container').parent().width() + 'px');

		_initFixedScroll(
			$('.re-index .search-box-container'), 
			$('.re-index #res_list'),
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