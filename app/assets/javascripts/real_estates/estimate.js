$(function() {
	$('.slick-agent').slick({		
		autoplay: true,
		autoplaySpeed: 3000,
		infinite: true,
		slidesToScroll: 4,
		arrows: false,
		slidesToShow: 4,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true,
				}
			},
			{
				breakpoint: 500,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					centerMode: true,
				}
			}
		]
	});

	ToggleCountry();
	ToggleDistrict();
});

function ToggleCountry() {
	$country = $('.country');
	$li = $('.country').find('li');

	$li.on('click', function(e) {
		e = e || window.event;
		var $this = $(this);

		if ($this.hasClass("divider-vertical") || $this.hasClass("more")) {
			return;
		}

		$country.find('.active').removeClass('active');
		$this.addClass('active');
	});
}

function ToggleDistrict() {
	$district = $('.district');
	$li = $('.district').find('li');

	$li.on('click', function(e) {
		e = e || window.event;
		var $this = $(this);

		if ($this.hasClass("divider-vertical") || $this.hasClass("more")) {
			return;
		}

		$district.find('.active').removeClass('active');
		$this.addClass('active');
	});
}