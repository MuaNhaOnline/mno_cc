$(function () {
	// Relative re
		
		(function () {
			var $ctn = $('#relative_re'),
				$list = $ctn.find('.medium-items-list');

			if ($ctn.length == 0) {
				return;
			}

			// Fixed right column
			var fixedManager = _initFixedScroll($('.relative-re-ctn'), $('.blog'));
			if (window.innerWidth < 992) {
				fixedManager.end();
			}
			else {
				fixedManager.start();
			}

			// Round item width
			var width = $ctn[0].getBoundingClientRect().width;
			$ctn.find('.item-ctn').css('margin-right', Math.ceil(width) - width);

			// Move relative re by width
			if (window.innerWidth < 992) {
				$('.blog').append($('.relative-re-ctn'));
				$('.relative-re-ctn').removeClass('box-small');
			}
			else {
				$('#relative_re_ctn').append($('.relative-re-ctn'));
				$('.relative-re-ctn').addClass('box-small');
			}

			// Window event
			$(window).on('resize', function () {
				// Round item width
				var width = $ctn[0].getBoundingClientRect().width;
				$ctn.find('.item-ctn').css('margin-right', Math.ceil(width) - width);

				// Scroll to active item
				$list.scrollLeft($list.scrollLeft() + $ctn.find('.active').position().left);

				// Set ctn height
				$list.css('height', $ctn.find('.active > .item').outerHeight());

				if (window.innerWidth < 992) {
					// Move relative re by width
					$('.blog').append($('.relative-re-ctn'));
					$('.relative-re-ctn').removeClass('box-small');

					// Fixed right column
					fixedManager.end();
				}
				else {
					// Move relative re by width
					$('#relative_re_ctn').append($('.relative-re-ctn'));
					$('.relative-re-ctn').addClass('box-small');

					// Fixed right column
					fixedManager.start();
				}
			});

			// Active first item
			$ctn.find('.item-ctn:eq(0)').addClass('active');
			$list.css('height', $ctn.find('.item-ctn:eq(0) .item').outerHeight());

			// Prev re
			$ctn.find('.prev').on('click', function () {
				var
					$currentItem = $ctn.find('.active');
					$willShow = $currentItem.prev();

				if ($willShow.length == 0) {
					$willShow = $ctn.find('.item-ctn:last');
				}

				$willShow.addClass('active');
				$currentItem.removeClass('active');
				$list.css('height', $willShow.children('.item').outerHeight());

				$list.stop().animate({
					scrollLeft: $list.scrollLeft() + $willShow.position().left
				});
			});

			// Next re
			$ctn.find('.next').on('click', function () {
				var
					$currentItem = $ctn.find('.active');
					$willShow = $currentItem.next();

				if ($willShow.length == 0) {
					$willShow = $ctn.find('.item-ctn:first');
				}

				$willShow.addClass('active');
				$currentItem.removeClass('active');
				$list.css('height', $willShow.children('.item').outerHeight());

				$list.stop().animate({
					scrollLeft: $list.scrollLeft() + $willShow.position().left
				}, 300);
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