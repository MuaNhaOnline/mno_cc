// Initilization
$(function() {
	//init dot dot dot
	$('[data-dot]').dotdotdot();

	//init slick	
	$('.favorite-property').find('.content').slick({
		fade: true,
		dots: true,
		prevArrow: $(this).find('#favor-prev'),
		nextArrow:  $(this).find('#favor-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});
});
// end