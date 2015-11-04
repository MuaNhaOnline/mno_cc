$(function() {
	Jump();

	//init dot dot dot
	$('[data-dot]').dotdotdot({
		watch: 'window'
	});

	// Delete button
	$('[aria-click="delete"]').on('click', function () {
		var $item = $(this).closest('.item');

		if (confirm('Bạn có chắc muốn xóa blog này?')) {
			$.ajax({
				url: '/blogs/delete',
				method: 'POST',
				data: { id: $item.data('value') },
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status == 0) {
					$item.remove();
				}
				else {
					alert('Xóa blog thất bại');
				}
			}).fail(function () {
				alert('Xóa blog thất bại');
			})
		}
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