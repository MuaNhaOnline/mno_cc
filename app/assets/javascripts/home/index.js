// Initilization
$(function() {
	//init slick
	$('.project-is-interested').find('.content').slick({
		fade: true,
		dots: true,
		prevArrow: $(this).find('#project-prev'),
		nextArrow:  $(this).find('#project-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});
	$('.favorite-property').find('.content').slick({
		fade: true,
		dots: true,
		prevArrow: $(this).find('#favor-prev'),
		nextArrow:  $(this).find('#favor-next'),
		customPaging: function() {
			return "<i></i>";
		}
	});
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

	//initPaging
	initPaging();
});
// end

// start initPaging
function initPaging() {

	// suggest property
	paging_suggest_property = _initPagination({
		url: '/real_estates/search',
		pagination: $('#pagination_suggest_property'),
		list: $('#list_suggest_property')	
	});	

	// new property
	paging_new_property = _initPagination({
		url: '/real_estates/search',
		pagination: $('#pagination_new_property'),
		list: $('#list_new_property')	
	});	

}
// end