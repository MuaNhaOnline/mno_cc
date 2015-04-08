$(function(){
	init_item_info();
});

function init_item_info() {	
	$('tbody').on('mouseenter', function(e) {
		if ($(window).width() >= 768)
		{
			$(this).find('.item-info').toggle();
		}
	});
	$('tbody').on('mouseleave', function(e) {
		if ($(window).width() >= 768)
		{
			$(this).find('.item-info').toggle();
		}
	});
}