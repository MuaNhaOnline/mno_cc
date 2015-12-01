$(function () {
  var $list = $('#contact_list');

  initPagination();
  initItem();

  function initItem() {
		initReadTime($list);

  	$list.find('.item').each(function () {
  		var $item = $(this);

  		// View history

  			$item.find('[aria-click="view_history"]').on('click', function () {
  				popupFull({
  					url: '/contact_user_infos/_view_history/' + $item.data('value'),
            success: function ($popup) {
              initReadTime($popup);
            }
  				});
  			});

  		// / View history
  	});
  }

  // Pagination

  function initPagination() {
    find = _initPagination({
      url: '/contact_user_infos/_index_list',
      list: $list,
      pagination: $('#pagination'),
      done: function (content) {
        $list.html(content);
        initItem();
      }
    });
  }

  // / Pagination

});