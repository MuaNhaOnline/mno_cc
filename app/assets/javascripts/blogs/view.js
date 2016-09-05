$(function () {
	// Relative re
		
		(function () {
			var $ctn = $('#relative_re');

			_initMediumItemsList($('#relative_re'));

			if ($ctn.length == 0) {
				return;
			}

			// Fixed right column
			var fixedManager = _initFixedScroll($ctn, $('.blog'));
			if (window.innerWidth < 992) {
				fixedManager.end();
			}
			else {
				fixedManager.start();
			}

			// Window event
			$(window).on('resize', function () {
				if (window.innerWidth < 992) {
					// Fixed right column
					fixedManager.end();
				}
				else {
					// Fixed right column
					fixedManager.start();
				}
			});
		})();

	// / Relative re

	// Relative blogs
	
		$('.relative-blogs .title').dotdotdot({
			watch: 'window',
			height: 50
		});
	
	// / Relative blogs
});