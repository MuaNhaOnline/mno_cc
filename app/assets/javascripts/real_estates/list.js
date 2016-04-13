$(function () {

	// Init favorite items list
	
		_initLargeItemsList($('#favorite_res_list'));
		_initMediumItemsList($('#res_list'));
	
	// / Init favorite items list

	// Fixed search box

		$(window).on('resize', function () {
			$('.re-list .search-box-container').css('width', $('.re-list .search-box-container').parent().width() + 'px');
		});
		$('.re-list .search-box-container').css('width', $('.re-list .search-box-container').parent().width() + 'px');

		_initFixedScroll(
			$('.re-list .search-box-container'), 
			$('.re-list #res_list')
		);
	
	// / Fixed search box

});