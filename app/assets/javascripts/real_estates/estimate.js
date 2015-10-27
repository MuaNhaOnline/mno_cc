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
});