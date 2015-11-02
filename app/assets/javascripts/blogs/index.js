$(function() {
	Jump();
});
// init Jump
function Jump() {
	var top;
	$(window).load(function() {
		top = $('.navigator').offset().top - 80;
		$body.animate({
			scrollTop: top
		}, 500)
	});
}