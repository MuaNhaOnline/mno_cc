$(function () {

	(function () {
		var currentPage = 1;

		$('#activity_log_load').on('click', function () {
			$.ajax({
				url: '/home/_log_list',
				data: {
					page: ++currentPage
				},
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status == 0) {
					var $list = $(data.result);

					if ($('#activity_log .time-label').last().data('milestone') == $list.siblings('.time-label:eq(0)').data('milestone')) {
						$list.siblings('.time-label:eq(0)').hide();
					}

					$('#activity_log').append($list);
				}
				else if (data.status == 1) {
					$('#activity_log_load').remove();
				}
				else {
					errorPopup();
				}
			}).fail(function () {
				errorPopup();
			});
		})
	})();

});