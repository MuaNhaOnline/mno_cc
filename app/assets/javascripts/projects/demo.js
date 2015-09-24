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
	// init distributor-project slick
	$('.single-logo').slick({
		asNavFor: '.content-logo',
		prevArrow: $('[data-button="previous"]'),
		nextArrow: $('[data-button="next"]'),
	});
	$('.content-logo').slick({
		asNavFor: '.single-logo',
		fade: true,
		arrow: false,
		draggable: false
	});
	// end

	// init Tablist
	initTablist();

	// init switch
	initSwitch();
	// end
});

// Affix tablist
function initTablist() {
	var $nav = $('#nav_list_project');

	$nav.affix({
		offset: {
			top: $nav.offset().top + 100,
			bottom: $('footer').outerHeight(true) + 779 +30
		}
	});
}

function initSwitch() {
	var $slideNav = $('.slide-nav');
	var $li = $slideNav.find('li');

	$li.on('click', function(e) {
		var $content = $('.nav-project').find('.content');

		$slideNav.find('.active').removeClass('active');
		$(this).addClass('active');

		$content.find('.active').removeClass('active');
		$('[data-object=' + $(this).attr('data-switch-object') + ']').addClass('active');
	});

}