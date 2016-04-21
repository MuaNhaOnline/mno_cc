$(function () {

	// Contact

		(function () {
			var $contactForm = $('#contact_form');

			_initContactForm($contactForm, {
				requestInfo: $contactForm.data('request_info'),
				contactInfo: $contactForm.data('contact_info'),
				done: function (data) {
					popupPrompt({
						title: 'Đăng ký thành công',
						content: 'Bạn đã đăng ký thành công, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất'
					});
				}
			});
		})();
	
	// / Contact

	// Search
	
		(function () {
			$('.search-ctn .map-search').on('click', function () {
				popupPrompt({
					title: 'Rất tiếc',
					content: 'Xin lỗi bạn, chức năng này đang hoàn thiện'
				});
			});
		})();
	
	// / Search

	// Gallery
	
		// $('.gallery-ctn img').on({
		// 	'mouseenter click': function () {
		// 		var $img = $(this);

		// 		// Check status
		// 		if ($img.hasClass('active')) {
		// 			return;
		// 		}

		// 		$img.addClass('active').siblings('.active').removeClass('active');
		// 	}
		// });

	// / Gallery

	// Rating
	
		(function () {
			$('.rating-ctn .btn').on('click', function () {
				popupPrompt({
					title: 'Cám ơn bạn',
					content: 'Cám ơn bạn đã đánh giá',
					buttons: [
						{
							text: 'Xem bất động sản',
							type: 'green',
							handle: function () {
								window.location = '/bat-dong-san';
								return false;
							}
						},
						{
							text: 'Xem dự án',
							type: 'green',
							handle: function () {
								window.location = '/du-an';
								return false;
							}
						},
						{
							text: 'Đóng'
						}
					]
				});
			});
		})();
	
	// / Rating


});