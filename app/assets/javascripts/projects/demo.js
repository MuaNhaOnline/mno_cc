// Init
$(function() {
	
	//init dot dot dot
	$('[data-dot]').dotdotdot({
		watch: "window"
	});

	//init slick	
	$('.favorite-projects').find('.content').slick({
		fade: true,
		dots: true,
		autoplay: true,
		autoplaySpeed: 2000,
		prevArrow: $(this).find('#favor-prev'),
		nextArrow:  $(this).find('#favor-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});

	// init Tablist
	initTablist();
});

// Affix tablist
function initTablist() {
	var $nav = $('#nav_list_project');

	$nav.affix({
		offset: {
			top: $nav.offset().top + 100,
			bottom: $('footer').outerHeight(true) + $('.distributor-project').outerHeight(true) +30
		}
	});
}

// dropdown-district
function initDropdownDistrict() {

}