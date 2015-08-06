//region Initialization

$(function () {
	// init tooltip
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

	//init search-box
	initMore();
});

//end

//region search-box
function initMore() {
	$('[data-function="show-search-plus"]').on('click', function () {
		var searchPlus = $('#more_search');
		searchPlus.fadeIn(500);
		$(this).hide();
	});
}
//end