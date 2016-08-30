$(function () {

	// Init favorite items list
	
		_initMediumItemsList($('#res_list'));
	
	// / Init favorite items list

	// Fixed search box

		$(window).on('resize', function () {
			$('.home-search .search-box-container').css('width', $('.home-search .search-box-container').parent().width() + 'px');
		});
		$('.home-search .search-box-container').css('width', $('.home-search .search-box-container').parent().width() + 'px');

		_initFixedScroll(
			$('.home-search .search-box-container'), 
			$('.home-search #res_list')
		);
	
	// / Fixed search box

});