$(function () {
  var 
    $list = $('#investor_list');

  initDelete();
  initPagination();
  initRename();

  /*
    Delete buttons
  */

  function initDelete() {
    $list.find('[aria-click="delete"]').on('click', function () {
      var $item = $(this).closest('.item');

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
                url: '/investors/' + $item.data('value'),
                type: 'DELETE',
                contentType: 'JSON'
              }).always(function () {
                toggleLoadStatus(false);
              }).done(function (data) {
                if (data.status == 0) {
                  $item.parent().remove();
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
        $item = $button.closest('.item'),
        $html = $(_popupContent['edit_form']),
        $form = $html.find('form'),
        form = $form[0];
      
      form.elements['id'].value = $item.data('value');
      form.elements['name'].value = $item.find('[aria-object="name"]').text();
      $(form.elements['avatar_image_id']).attr('data-init-value', $item.data('avatar-image-id'));

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

              $item.find('[aria-object="name"]').text(form.elements['name'].value);

              var avatarImageId = form.elements['avatar_image_id'];
              if (avatarImageId.value) {
                $item.find('[aria-object="avatar"]').attr('src', '/images/' + avatarImageId.value);
                $item.data('avatar-image-id', avatarImageId.value);
              }
              else {
                $item.find('[aria-object="avatar"]').attr('src', '/assets/investor/default.png');
                $item.data('avatar-image-id', '');
              }
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
    find = _initPagination({
      url: '/investors/_manager_list',
      list: $list,
      pagination: $('#pagination'),
      done: function (content) {
        $list.html(content);
        initDelete();
        initRename();
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