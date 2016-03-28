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

	// Price range search
	initPriceRangeSearch();

	// Position search
	initPositionSearch();
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

/*
	Search by price range
*/

function initPriceRangeSearch() {
	var slider, find, $slider = $("#slider"), interval = $slider.data('min_interval') ? parseInt($slider.data('min_interval')) : 500000000;

	var 
		old_from = $slider.data('from') || 0,
		old_to = $slider.data('to') || 2000000000;
	$slider.ionRangeSlider({
		keyboard: true,
		min: $slider.data('min') || 0,
		max: $slider.data('max') || 3000000000,
		from: $slider.data('from') || 0,
		to: $slider.data('to') || 2000000000,
		type: 'double',
		step: $slider.data('step') || 1000000,
		keyboard_step: $slider.data('keyboard_step') || 500000000,
		grid: true,
		grid_num: $slider.data('grid_num') || 4,
		values_separator: $slider.data('values_separator') || " đến ",
		min_interval: $slider.data('min_interval') || 500000000,
		drag_interval: true,
		onFinish: function (data) {
			find();

			if (old_from != data.from) {
				old_from = data.from;
				if (data.from_percent > 25) {
					slider.update({
						min: parseInt(data.from / interval) * interval
					});
				}
				else if (data.from - data.min < interval) {
					var newMin = data.min - ((parseInt(data.min / (interval * 10)) + 1) * (interval * 2));

					if (newMin < 0) {
						newMin = 0;
					}

					slider.update({
						min: newMin
					});
				}
			}

			if (old_to != data.to) {
				old_to = data.to;
				if (data.to_percent < 75) {
					slider.update({
						max: (parseInt(data.to / interval) + 1) * interval
					});
				}
				else if (data.max - data.to < interval) {
					var newMax = data.max + ((parseInt(data.max / (interval * 10)) + 1) * (interval * 2));

					if (newMax < (interval * 4) - data.min) {
						newMin = (interval * 4) - data.min;
					}

					slider.update({
						max: newMax
					});
				}
			}
		}
	});
	slider = $('#slider').data('ionRangeSlider');

  find = _initPagination({
		url: '/projects/search',
		list: $('#price_list'),
		pagination: $('#price_pagination'),
    data: function () {
			return { price: $('#slider').val(), per: $slider.data('per'), list_type: 2 };
		}
  });
}

/*
	/ Search by price range
*/

/*
	Position search
*/

function initPositionSearch() {
	var find, $district_name = $('[aria-name="district_name"]');

	$('[aria-click="position_change"]').on('click', function () {
		find({
			data: {
				district: $(this).data('value')
			}
		});
		$district_name.text($(this).text());
	});

  find = _initPagination({
    url: '/projects/search',
    list: $('#position_list'),
    data: { list_type: 2 },
    pagination: $('#position_pagination')
  });
}

/*
	/ Position search
*/