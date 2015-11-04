$(function() {
	Jump();

	//init dot dot dot
	$('[data-dot]').dotdotdot({
		watch: 'window'
	});
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