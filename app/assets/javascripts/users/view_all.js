$(function () {
  var $list = $('#user_list'), find;

  initPagination();

  /*
    Pagination
  */

  function initPagination() {
    var order = { interact: 'desc' };

    find = _initPagination({
      url: '/users/_view_all_list',
      list: $list,
      pagination: $('#pagination'),
      data: function () {
        return order;
      }
    });

    var $searchForm = $('#search_form');
    initForm($searchForm, {
      submit: function () {
        find({
          data: {
            keyword: $searchForm[0].elements['keyword'].value
          }
        });
      }
    });

    /*
      Order
    */

    var $orderButtons = $searchForm.find('[aria-click="order"]');
    $orderButtons.on('click', function () {
      var $button = $(this);
      // If now
      if ($button.is('[data-now]')) {
        // Toggle
        if ($button.data('sort') == 'asc') {
          $button.data('sort', 'desc').find('[aria-name="sort"]').removeClass('fa-sort-asc').addClass('fa-sort-desc');
          order = {};
          order[$button.data('name')] = 'desc';
        }
        else {
          $button.data('sort', 'asc').find('[aria-name="sort"]').removeClass('fa-sort-desc').addClass('fa-sort-asc');
          order = {};
          order[$button.data('name')] = 'asc';
        }
      }
      // Not now
      else {
        $orderButtons.removeAttr('data-now').find('[aria-name="sort"]').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
        $button.attr('data-now', '').data('sort', $button.data('sort')).find('[aria-name="sort"]').removeClass('fa-sort').addClass('fa-sort-' + $button.data('sort'));
        order = {};
        order[$button.data('name')] = $button.data('sort');
      }
      find();
    });

    /*
      / Order
    */
  }

  /*
    / Pagination
  */
});