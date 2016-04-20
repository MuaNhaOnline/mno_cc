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


});