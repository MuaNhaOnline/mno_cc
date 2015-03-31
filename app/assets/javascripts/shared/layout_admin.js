// #start start
$(function () {			
	//init Aside
	initAside();		

	//process toggle button
	$('.button-mini-userbox').on('click', function () {
		initial_toggle_button(this);
	});
	$('.button-mini-sitemap').on('click', function () {
		initial_toggle_button(this);
	});
	$('.button-mini-function').on('click', function() {
		initial_toggle_button(this);
	});

	//username click
	$('.userbox').on('click', function(e) {
		initial_toggle_button(this);
	});
});
// #end start

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

//initialize Aside
function initAside() {
	//left-aside
	var $selectElement = $('.left-aside > ul > li > .title');
	
	$selectElement.on('click', function(e) {
		//redefine event
		e = e || window.event;

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');	
			$(this).siblings('ul').slideUp('fast');
		}
		else {
			$(this).addClass('active');	
			$(this).siblings('ul').slideDown('fast');			
		}
	});

	//collapse-aside
	var $selectElement = $('.collapse-aside > ul > li > .title');
	
	$selectElement.on('click', function(e) {
		//redefine event
		e = e || window.event;

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');	
			$(this).siblings('ul').slideUp('fast');
		}
		else {
			$(this).addClass('active');	
			$(this).siblings('ul').slideDown('fast');			
		}
	});
}
//#end Aside