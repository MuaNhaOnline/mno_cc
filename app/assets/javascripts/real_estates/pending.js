$(function () {
  var $list = $('#re_list'), find;

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
          url: '/real_estates/approve/' + $item.data('value'),
          type: 'PUT',
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
        content: _t.real_estate.view.pending.delete_confirm,
        type: 'warning',
        buttons: [
          {
            text: _t.form.yes,
            type: 'warning',
            handle: function () {
              toggleLoadStatus(true);
              $.ajax({
                url: '/real_estates/' + $item.data('value'),
                type: 'DELETE',
                dataType: 'JSON'
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
    find = _initPagination({
      url: '/real_estates/_pending_list',
      list: $list,
      pagination: $('#pagination'),
      done: function (content) {
        $list.html(content);
        initItem();
        initApprove();
        initDelete();
      }
    });

    var searchForm = document.getElementById('search_form');
    initForm($(searchForm), {
      submit: function () {
        find({
          data: {
            keyword: searchForm.elements['keyword'].value
          }
        });
      }
    });
  }

  /*
    / Pagination
  */
});