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
});
// end

// start Scroll Box
function initScrollBox() {
	$(window).on('scroll', function() {
		var scroll = $(window).scrollTop();
		if (scroll >= 2100) {
			$('#wrapper-fix-list').addClass('fix')
			$('.content-list').addClass('col-md-offset-3');
		}
		else {
			$('#wrapper-fix-list').removeClass('fix');			
			$('.content-list').removeClass('col-md-offset-3');
		}
	});
}
// end

// start fix-table Select
function initFixTable() {
	var itemli = $('.fix-table').find('li');
	$(itemli).on('click', function() {
		$(itemli).removeClass('active');
		$(this).addClass('active');
	});
}
// end