$(function () {
	var 
		$list = $('#mails_list'),
		$box = $('#mail_box');

	initRead();
	initRemove();

	initCheckToggle();
	initPagination();

	/*
		Read
	*/

	function initRead() {
		$list.children().on('click', function (e) {
			if (!$(e.target).is('[type="checkbox"]')) {
				window.location = '/mail_boxes/compose/' + $(this).data('value');
			}
		});
	}

	/*
		/ Read
	*/

	/*
		Check toggle
	*/

	function initCheckToggle() {
		$box.find('[aria-click="check-toggle"]').on('click', function () {
			var $button = $(this);

			if ($button.data('is_check')) {
				$list.find('[type="checkbox"]').prop('checked', false);
				$button.data('is_check', false);
				$button.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
			}
			else {
				$list.find('[type="checkbox"]').prop('checked', true);
				$button.data('is_check', true);
				$button.find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
			}
		});
	}

	/*
		/ Check toggle
	*/

	/*
		Remove
	*/

	function initRemove() {
		$box.find('[aria-click="remove"]').on('click', function () {
			// Get items selected
			var $items = $list.find('[type="checkbox"]:checked').closest('tr');
			
			// Check if user not select
			if ($items.length == 0) {
				popupPrompt({
					title: _t.form.info_title,
					content: _t.mail_box.view.inbox.select_for_remove,
					type: 'info'
				});
				return;
			}

			var ids = '';

			$items.each(function () {
				ids += ',' + $(this).data('value');
			});

			ids = ids.substr(1);

			$.ajax({
				url: '/mail_boxes/delete',
				method: 'POST',
				data: { ids: ids },
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status == 0) {
					$items.remove();
				}
				else {
	        popupPrompt({
	          title: _t.form.error_title,
	          type: 'danger',
	          content: _t.form.error_content
	        })	
				}
			}).fail(function () {
        popupPrompt({
          title: _t.form.error_title,
          type: 'danger',
          content: _t.form.error_content
        })
			});
		});
	}

	/*
		/ Remove
	*/
	
  /*
    Pagination
  */

  function initPagination() {
    _initSearchablePagination(
      $list,
      $('#search'),
      $('#pagination'), 
      {
        url: '/mail_boxes/_draft_list',
        afterLoad: function (content) {
          $list.html(content);
					initRead();
					initRemove();
        }
      }
    );
  }

  /*
    / Pagination
  */
});