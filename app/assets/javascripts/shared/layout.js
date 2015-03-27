// #start initialization
$(function (){
	//process toggle button
	$('.user-mini-toggle-button').on('click', function () {
		initial_toggle_button(this);
	});
	$('.button-mini-sitemap').on('click', function () {
		initial_toggle_button(this);
	});

	//Khởi tạo Header
	initHeader();
});
// #end initialization

// #start header
function initHeader () {
	$(window).scroll(function(event) {
		$('header').addClass('scroll');
		$('header > .logo').addClass('scroll-logo');
		$('header > .user').addClass('scroll-user');		
		$('header > .sitemap').addClass('scroll-sitemap');
		$('header > .mini-sitemap').addClass('scroll-mini-sitemap');
		$('header > .button-mini-sitemap').addClass('scroll-button-mini-sitemap');
		$('header > .posting').addClass('scroll-posting');
		$('header > .user-mini').addClass('scroll-user-mini');
		if ($(window).scrollTop() == 0) {
			$('header').removeClass('scroll');
			$('header > .logo').removeClass('scroll-logo');
			$('header > .sitemap').removeClass('scroll-sitemap');
			$('header > .mini-sitemap').removeClass('scroll-mini-sitemap');
			$('header > .button-mini-sitemap').removeClass('scroll-button-mini-sitemap');
			$('header > .posting').removeClass('scroll-posting');
			$('header > .user-mini').removeClass('scroll-user-mini');
			$('header > .user').removeClass('scroll-user');
		}
	});
}
// #end header

// #start toggle_button
	// #start toggle
		// toggle object
		function toggle(object) {
			//get $object
			object = $(object);

			//toggle
			object.toggle();
		}
	// #end toggle
	function initial_toggle_button (sender) {
		toggle(sender.getAttribute('data-toggle-target'));
	}
// #end toggle_button