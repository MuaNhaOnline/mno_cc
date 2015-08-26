//region Initialization

$(function () {
	//init Header
	initHeader();

	// init tooltip
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

	//init search-box
	initMore();

	//init datepicker
	$('.datepicker').datepicker();
	
});

//endregion

// start scroll header
function initHeader() {
	var header = $('.header-fixed');
	var logo = $('.logo');

	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		
		if (scroll != 0) {
			$(header).css('height', '46px');
			$(logo).css('width', '180px');		
		}
		else {
			$(header).css('height', '60px');
			$(logo).css('width', '220px');
		}
	});
}
// end

//start search-box
function initMore() {
	$('[data-function="show-search-plus"]').on('click', function () {
		var searchPlus = $('#more_search');
		searchPlus.fadeToggle(500);

		$('.btn-search-plus').fadeToggle();
	});
}
//end
