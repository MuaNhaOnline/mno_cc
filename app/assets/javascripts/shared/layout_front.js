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

	// init tab
	
});

//endregion

// start scroll header
function initHeader() {
	var header = $('.header-fixed');
	var logo = $('.logo');
	var imgLogo = $('.logo > img');

	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		
		if (scroll != 0) {
			$(header).css('height', '46px');
			$(imgLogo).css('padding', '12px 0');
		}
		else {
			$(header).css('height', '60px');
			$(imgLogo).css('padding', '17px 0px');
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
