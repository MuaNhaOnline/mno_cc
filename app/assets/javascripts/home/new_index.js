$(function () {


	// Gallery
	
		$('.gallery-ctn img').on({
			'mouseenter click': function () {
				var $img = $(this);

				// Check status
				if ($img.hasClass('active')) {
					return;
				}

				$img.addClass('active').siblings('.active').removeClass('active');
			}
		});

	// / Gallery


});