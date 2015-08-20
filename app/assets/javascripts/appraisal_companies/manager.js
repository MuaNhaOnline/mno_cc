$(function () {
  var $list = $('#ac_list');

  initDelete();
  initPagination();

  /*
    Delete buttons
  */

  function initDelete() {
    $list.find('[aria-click="delete"]').on('click', function () {
      var $row = $(this).closest('tr');

      popupPrompt({
        title: _t.form.confirm_title,
        content: _t.appraisal_company.view.manager.delete_confirm,
        type: 'warning',
        buttons: [
          {
            text: _t.form.yes,
            type: 'warning',
            handle: function () {
              $.ajax({
                url: '/appraisal_companies/' + $row.data('value'),
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
        url: '/appraisal_companies/_manager_list',
        afterLoad: function (content) {
          console.log(content);
          $list.html(content);
          initDelete();
        }
      }
    );
  }

  /*
    / Pagination
  */

});