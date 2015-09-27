var $tabListProject = $('[role="tab-list-project"]');

// Init
$(function() {	

	//init dot dot dot
	$('[data-dot]').dotdotdot({
		watch: "window"
	});

	//init slick	
	$('#slick-favorite').slick({
		adaptiveHeight: true,
		fade: true,
		dots: true,
		autoplay: false,
		autoplaySpeed: 2000,
		prevArrow: $(this).find('#favor-prev'),
		nextArrow:  $(this).find('#favor-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});

	// init distributor-project slick
	$('.single-logo').slick({
		asNavFor: '.content-logo',
		prevArrow: $('[data-button="previous"]'),
		nextArrow: $('[data-button="next"]'),
	});
	$('.content-logo').slick({
		asNavFor: '.single-logo',
		fade: true,
		arrow: false,
		draggable: false
	});
	// end
	// initSwitch
	initSwitch();

	// initScroll
	initScroll();

	// init tab list project
	initTabListProject();

	// init Fixed
	initFixed();
});

// init tab list project
function initTabListProject() {	
	$tabListProject.find('a').on('click', function(e) {
		e.preventDefault();
		$(this).tab('show');
	});
}
// end

// Switcher
function initSwitch() {		
	$li = $('.slide-nav').find('li');
	
	$li.on('click', function(e) {
		var role = $(this).attr('role');
		var $content = $('.nav-project').find('.content [role="' + role + '"]');

		// remove active in content
		$content.find('li.active').removeClass('active');
		$content.find('li [data-object="' + $(this).attr('data-switch-object') + '"]').addClass('active');

		// remove active in tab
		var $slideNav = $(this).parentsUntil('.slide-nav');
		$slideNav.find('li.active').removeClass('active');
		$(this).addClass('active');
	});
}

// init fix box
function initFixed() {
	// start fixed tab
	var $wrapper = $('.tabs-wrapper');
	var $leftBox = $('.panel-left-box');
	var $distributorProject = $('.distributor-project');

	$window.load(function() {		
		console.log($footer.outerHeight(true) + $distributorProject.outerHeight(true) - 40);

		$tabListProject.affix({
			offset : {
				top: $wrapper.offset().top,
				bottom: $footer.outerHeight(true) + $distributorProject.outerHeight(true) + 80
			}		
		});
		$leftBox.affix({
			offset: {
				top: $wrapper.offset().top,
				bottom: $footer.outerHeight(true) + $distributorProject.outerHeight(true) + 80
			}
		})
	});	
	// end
}
// end

// Scroll
function initScroll() {	
	$('.scrollspy').find('a').on('click', function(e) {
		var idObject = $(this).attr('href');
		
		$body.animate({
			scrollTop: $(idObject).offset().top - 70
		}, 500);
	});

	// Check windows scroll
	$(window).on('scroll', function() {
		if ($('.header-fixed').is(':visible')) {			
			$body.addClass('nav-list-project');			
		} else {
			$body.removeClass('nav-list-project');
		}
	});

	$('body').scrollspy({
		target: '.scrollspy',
		offset: 106
	});
}