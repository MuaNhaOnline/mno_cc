$(function () {

	// Init favorite items list
	
		_initLargeItemsList($('#favorite_projects_list'));
		_initMediumItemsList($('#projects_list'));
	
	// / Init favorite items list

	// Fixed search box

		$(window).on('resize', function () {
			$('.projects-index .search-box-container').css('width', $('.projects-index .search-box-container').parent().width() + 'px');
		});
		$('body').on('loaded', function () {
			$('.projects-index .search-box-container').css('width', $('.projects-index .search-box-container').parent().width() + 'px');

			_initFixedScroll(
				$('.projects-index .search-box-container'), 
				$('#projects_list')
			);
		})
	
	// / Fixed search box

});