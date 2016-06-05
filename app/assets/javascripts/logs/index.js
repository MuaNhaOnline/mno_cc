var
	currentPage,
	itemPerPage;

$(function () {

	var
		loadMoreUrl = window.location.pathname,
		$list = $('#activity_log');

	// Reach bottom
		
		var
			$reachBottom 	= 	$('#reach_bottom'),
			loading 		= 	false;

		$(window).on('scroll.loadMore', function () {
			if (!loading && $reachBottom.isOnScreen()) {
				loadMoreItems();
			}
		});

		function loadMoreItems() {
			// Start loading
			loading = true;
			$reachBottom.startLoadingStatus('loadMore');

			$.ajax({
				url: loadMoreUrl,
				data: {
					page: 	++currentPage,
					per: 	itemPerPage
				}
			}).done(function (data) {
				if (data.status == 0) {
					var $newItems = $(data.result);

					$newItems.filter('.time-label[data-milestone="' + $list.find('.time-label:last').data('milestone') + '"]').hide();

					$('#activity_log').append($newItems);

					window.history.replaceState({}, document.title, this.url);
				}
				else if (data.status == 1) {
					$(window).off('scroll.loadMore');
				}
				else {
					currentPage--;
					_errorPopup();
				}
			}).fail(function () {
				currentPage--;
				_errorPopup();
			}).always(function () {
				loading = false;
				$reachBottom.endLoadingStatus('loadMore');
			});
		}
	
	// / Reach bottom
});