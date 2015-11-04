$(function() {
	Jump();
});
// init Jump
function Jump() {
	var top;
	$(window).load(function() {
		top = $('.title-blog').offset().top - 80;
		$body.animate({
			scrollTop: top
		}, 500)
	});
}