$(function () {
  var $list = $('#contact_list'), find;

  initPagination();
  initItem();

  function initItem() {
		initReadTime($list);

  	$list.find('.item').each(function () {
  		var $item = $(this);

  		// View statistic

  			$item.find('[aria-click="view_statistic"]').on('click', function () {
  				popupFull({
  					url: '/contact_requests/_view_statistic/' + $item.data('value'),
            success: function ($popup) {
              initReadTime($popup);
            }
  				});
  			});

  		// / View statistic

      // Set result

        $item.find('[aria-click="contacted"]').on('click', function () {
          $html = $(_popupContent['result']);
          var $form = $html.find('form');

          $form.find('[name="result[contact_request_id]"]').val($item.data('value'));
          initForm($form, {
            submit: function () {
              $.ajax({
                url: '/contact_requests/set_result',
                method: 'POST',
                data: $form.serialize(),
                dataType: 'JSON'
              }).done(function (data) {
                if (data.status == 0) {
                  find();
                }
                else {
                  errorPopup();
                }
              }).fail(function () {
                errorPopup();
              });
            }
          });

          popupFull({
            html: $html,
            width: 'small'
          });
        });

      // / Set result

  	});
  }

  // Pagination

  function initPagination() {
    find = _initPagination({
      url: '/contact_requests/_index_list',
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