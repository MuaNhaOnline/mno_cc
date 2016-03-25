$(function () {

	// Init favorite items list
	
		_initLargeItemsList($('#favorite_res_list'));
		_initMediumItemsList($('#res_list'));
	
	// / Init favorite items list

	// Fixed search box

		_initFixedScroll(
			$('.re-index .search-box-container'), 
			$('.re-index #res_list')
		);

		$(window).on('resize', function () {
			$('.re-index .search-box-container').css('width', $('.re-index .search-box-container').parent().width() + 'px');
		});
		$('.re-index .search-box-container').css('width', $('.re-index .search-box-container').parent().width() + 'px');
	
	// / Fixed search box

});