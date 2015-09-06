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
		slidesToShow: 3		
	});
});
// end