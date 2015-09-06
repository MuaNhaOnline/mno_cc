// Initilization
$(function() {
	//init dot dot dot
	$('[data-dot]').dotdotdot();

	//init slick	
	$('.favorite-projects').find('.content').slick({
		fade: true,
		dots: true,
		prevArrow: $(this).find('#favor-prev'),
		nextArrow:  $(this).find('#favor-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});
	$('.wrapper-distributor').find('.list').slick({
		centerMode: true,
		centerPadding: '60px',
		slidesToShow: 3,
		variableWidth: true
	});

	initScrollBox();
});
// end

// start Scroll Box
function initScrollBox() {
	$(window).on('scroll', function() {
		var scroll = $(window).scrollTop();
		if (scroll >= 1600) {
			$('.fix-table').removeClass('nofix');
			$('.fix-table').addClass('fix');
		}
		else {
			$('.fix-table').removeClass('fix');
			$('.fix-table').addClass('nofix');
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