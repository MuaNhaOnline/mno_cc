$(function () {
  var $list = $('#investor_list');

  initDelete();
  initPagination();
  initRename();

  /*
    Delete buttons
  */

  function initDelete() {
    $list.find('[aria-click="delete"]').on('click', function () {
      var $row = $(this).closest('tr');

      popupPrompt({
        title: _t.form.confirm_title,
        content: _t.investor.view.manager.delete_confirm,
        type: 'warning',
        buttons: [
          {
            text: _t.form.yes,
            type: 'warning',
            handle: function () {
              toggleLoadStatus(true);
              $.ajax({
                url: '/investors/' + $row.data('value'),
                type: 'DELETE',
                contentType: 'JSON'
              }).always(function () {
                toggleLoadStatus(false);
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
    Rename
  */

  function initRename() {
    $list.find('[aria-click="rename"]').on('click', function () {
      var 
        $button = $(this),
        $row = $button.closest('tr'),
        $html = $('<article style="width: 300px; max-width: 80vw" class="box box-solid box-default"><form class="form box-body"><input type="hidden" name="id" value="' + $row.data('value') + '" /><article class="form-group"><input class="form-control" value="' + $row.find('[aria-object="name"]').text() + '" name="name" /></article><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">' + _t.form.finish + '</button> <button type="button" class="btn btn-default btn-flat">' + _t.form.cancel + '</button></article></form></article>'),
        $form = $html.find('form');

      var $popup = popupFull({
        html: $html
      });

      $html.find('button[type="button"]').on('click', function () {
        $popup.off();
      });

      initForm($form, {
        submit: function () {
          toggleLoadStatus(true);
          $.ajax({
            url: '/investors/rename',
            method: 'PUT',
            data: $form.serialize(),
            dataType: 'JSON'
          }).always(function () {
            toggleLoadStatus(false);
          }).done(function (data) {
            if (data.status == 0) {
              $popup.off();

              $row.find('[aria-object="name"]').text($form.find('[name="name"]').val());
            }
            else {
              popupPrompt({
                title: _t.form.error_title,
                type: 'danger',
                content: _t.form.error_content
              });
            }
          }).fail(function () {
            popupPrompt({
              title: _t.form.error_title,
              type: 'danger',
              content: _t.form.error_content
            })
          });
        }
      });
    });
  }

  /*
    / Rename
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
        url: '/investors/_manager_list',
        afterLoad: function (content) {
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