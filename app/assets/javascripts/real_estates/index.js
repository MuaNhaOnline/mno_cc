$(function () {

	// Init favorite items list
	
		_initLargeItemsList($('#favorite_res_list'));
		_initMediumItemsList($('#res_list'));
	
	// / Init favorite items list

	// Fixed search box

		$(window).on('resize', function () {
			$('.re-index .search-box-container').css('width', $('.re-index .search-box-container').parent().width() + 'px');
		});
		$('body').on('loaded', function () {
			$('.re-index .search-box-container').css('width', $('.re-index .search-box-container').parent().width() + 'px');

			_initFixedScroll(
				$('.re-index .search-box-container'), 
				$('.re-index #res_list')
			);
		})
	
	// / Fixed search box

});