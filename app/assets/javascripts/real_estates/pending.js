$(function () {
  var $list = $('#re_list');

  initApprove();
  initDelete();
  initPagination();

  /*
    Approve
  */

  function initApprove() {
    $list.find('[aria-click="approve"]').on('click', function () {
      var $row = $(this).closest('tr');

      $.ajax({
          url: '/real_estates/approve/' + $row.data('value'),
          type: 'PUT',
          contentType: 'JSON'
      }).done(function (data) {
        if (data.status == 0) {
          $row.remove();
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
      var $row = $(this).closest('tr');

      popupPrompt({
        title: _t.form.confirm_title,
        content: _t.real_estate.manager.delete_confirm,
        type: 'warning',
        buttons: [
          {
            text: _t.form.yes,
            type: 'warning',
            handle: function () {
              $.ajax({
                url: '/real_estates/' + $row.data('value'),
                type: 'DELETE',
                contentType: 'JSON'
              }).done(function (data) {
                if (data.status == 0) {
                  $row.remove();
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
    _initSearchablePagination(
      $list,
      $('#search_form'),
      $('#pagination'), 
      {
        url: '/real_estates/_pending_list',
        afterLoad: function (content) {
          $list.html(content);
          initDelete();
      }
    });
  }

  /*
    / Pagination
  */
});