$(function () {

	// Init favorite items list
	
		_initMediumItemsList($('#res_list'));
	
	// / Init favorite items list

	// Fixed search box

		$(window).on('resize', function () {
			$('.res-search .search-box-container').css('width', $('.res-search .search-box-container').parent().width() + 'px');
		});
		$('.res-search .search-box-container').css('width', $('.res-search .search-box-container').parent().width() + 'px');

		_initFixedScroll(
			$('.res-search .search-box-container'), 
			$('.res-search #res_list')
		);
	
	// / Fixed search box

	// Pagination
	
		_initPagination3({
			url:			'',
			list:			$('#res_list'),
			paginator:		$('#res_paginator'),
			replaceState: 	true
		});
	
	// / Pagination

});