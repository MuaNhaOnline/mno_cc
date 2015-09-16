$(function () {
  var $list = $('#project_list'), find;

  initApprove();
  initDelete();
  initPagination();

  /*
    Approve
  */

  function initApprove() {
    $list.find('[aria-click="approve"]').on('click', function () {
      var $item = $(this).closest('.item');

      toggleLoadStatus(true);
      $.ajax({
          url: '/projects/approve/' + $item.data('value'),
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
        content: _t.project.view.pending.delete_confirm,
        type: 'warning',
        buttons: [
          {
            text: _t.form.yes,
            type: 'warning',
            handle: function () {
              toggleLoadStatus(true);
              $.ajax({
                url: '/projects/' + $item.data('value'),
                type: 'DELETE',
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
    find = _initPagination({
      url: '/projects/_pending_list',
      list: $list,
      pagination: $('#pagination'),
      done: function (content) {
        $list.html(content);
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