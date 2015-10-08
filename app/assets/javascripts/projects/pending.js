$(function () {
  var $list = $('#project_list'), find;

  initItem();
  initApprove();
  initDelete();
  initPagination();

  /*
    Item
  */

  function initItem($item) {
    if ($item) {
      setItem($item);
    }
    else {
      $list.find('.item').each(function () {
        setItem($(this));
      });
    }

    function setItem($item) {
      $item.find('.address').dotdotdot({
        height: 40,
        watch: true
      });
    }
  }
  
  /*
    / Item
  */

  /*
    Approve
  */

  function initApprove() {
    $list.find('[aria-click="approve"]').on('click', function () {
      var $item = $(this).closest('.item');

      toggleLoadStatus(true);
      $.ajax({
          url: '/projects/approve/' + $item.data('value'),
          method: 'POST',
          contentType: 'JSON'
      }).done(function () {
        toggleLoadStatus(false);
      }).done(function (data) {
        if (data.status == 0) {
          $item.remove();
          find();
        }
        else {
          popupPrompt({
            title: _t.form.error_title,
            content: _t.form.error_content,
            type: 'danger'
          });
        }
      }).fail(function () {
        popupPrompt({
          title: _t.form.error_title,
          content: _t.form.error_content,
          type: 'danger'
        });
      });
    });
  }

  /*
    / Approve
  */

  /*
    Delete buttons
  */

  function initDelete() {
    $list.find('[aria-click="delete"]').on('click', function () {
      var $item = $(this).closest('.item');

      popupPrompt({
        title: _t.form.confirm_title,
        content: _t.project.view.pending.delete_confirm,
        type: 'warning',
        buttons: [
          {
            text: _t.form.yes,
            type: 'warning',
            handle: function () {
              toggleLoadStatus(true);
              $.ajax({
                url: '/projects/delete/' + $item.data('value'),
                method: 'POST',
                contentType: 'JSON'
              }).always(function () {
                toggleLoadStatus(false);
              }).done(function (data) {
                if (data.status == 0) {
                  $item.remove();
                  find();
                }
                else {
                  popupPrompt({
                    title: _t.form.error_title,
                    content: _t.form.error_content,
                    type: 'danger'
                  });
                }
              }).fail(function () {
                popupPrompt({
                  title: _t.form.error_title,
                  content: _t.form.error_content,
                  type: 'danger'
                });
              });
            }
          },
          {
            text: _t.form.no
          }
        ]
      })
    });
  }

  /*
    / Delete buttons
  */

  /*
    Pagination
  */

  function initPagination() {
    var order = { interact: 'desc' };

    find = _initPagination({
      url: '/projects/_pending_list',
      list: $list,
      pagination: $('#pagination'),
      data: function () {
        return order;
      },
      done: function (content) {
        $list.html(content);
        initItem();
        initApprove();
        initDelete();
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