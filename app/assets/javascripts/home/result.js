// Initilization
$(function() {
	Jump();
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