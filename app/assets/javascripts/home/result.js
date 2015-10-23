// Initilization
$(function() {
	Jump();

	initTypeTab();
	initSearchForm();
});
// end

// init Jump
function Jump() {
	var top;
	$(window).load(function() {
		top = $('.navigator').offset().top;		

		$body.animate({
			scrollTop: top
		}, 500)
	});
}
// end

/*
	Search form
*/

	function initSearchForm() {
		var $form = $('#search_form');

		
	}

/*
	/ Search form
*/