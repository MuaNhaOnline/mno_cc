// Initilization
$(function() {
	//init dot dot dot
	$('[data-dot]').dotdotdot({
		watch: "window"
	});

	//init slick
	$('.project-is-interested').find('.content').slick({
		fade: true,
		dots: true,
		prevArrow: $(this).find('#project-prev'),
		nextArrow:  $(this).find('#project-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});
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