// Initilization
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
	$('.slide-logo').slick({
		centerMode: true,
		centerPadding: '60px',
		slidesToShow: 3,
		variableWidth: true,
		focusOnSelect: true,
		autoplay: true,
		autoplaySpeed: 4000
	});

	// initScrollBox();
	initFixList();
});
// end

// start Scroll Box
// function initScrollBox() {
	
// }
// end

// start fix-list Select
function initFixList() {
	//Event click item
	var itemli = $('.fix-list').find('label');
	$(itemli).on('click', function() {
		$(itemli).removeClass('active');
		$(this).addClass('active');

		var target = $(this).attr('data-target');
		$('html, body').animate({
			scrollTop: $(target).offset().top - 50
		}, 500);
	});

	//scroll event
	var topListContent = $('.content-list').offset().top;
	var bottomListContent = $('.distributor-project').offset().top;

	$(window).on('scroll', function() {
		var scroll = $(window).scrollTop();
		if (scroll >= topListContent && scroll <= bottomListContent) {
			$('.fix-list').addClass('fixed');
		}
		else {
			$('.fix-list').removeClass('fixed');
		}
	});
}
// end