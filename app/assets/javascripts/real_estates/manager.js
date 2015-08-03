$(function () {
  var $list = $('#re_list');

  $list.children().each(function () {
    initStatus($(this));
  });
  initChangeShowStatus();
  initDelete();

  /*
    Init display with status
  */

  function initStatus($row) {
    var 
      status = $row.data('status'),
      isDraft = listString.has('draft', status),
      isPending = listString.has('pending', status),
      isShow = listString.has('show', status);

    // Status

    var statusHtml = '';
    if (isDraft) {
      statusHtml += '<span class="label label-default">' + _t.real_estate.attribute.draft_status + '</span><br />';
    }
    else if (isPending) {
      statusHtml += '<span class="label label-warning">' + _t.real_estate.attribute.pending_status + '</span><br />';
    }

    if (isShow) {
      statusHtml += '<span class="label label-primary">' + _t.real_estate.attribute.show_status + '</span>';
    }
    else {
      statusHtml += '<span class="label label-danger">' + _t.real_estate.attribute.hide_status + '</span>';
    }

    $row.find('[aria-object="status"]').html(statusHtml);

    // Constrol buttons

    if (isShow) {
      $row.find('[aria-click="change-show-status"]').text(_t.real_estate.manager.hide);
    }
    else {
      $row.find('[aria-click="change-show-status"]').text(_t.real_estate.manager.show);
    }

    if (isDraft) {
      $row.find('[aria-click="edit"]').text(_t.real_estate.manager['continue']);
    }
    else {
      $row.find('[aria-click="edit"]').text(_t.real_estate.manager.edit);
    }
  }

  /*
    / Init display with status
  */

  /*
    Init change show status buttons
  */

  function initChangeShowStatus() {
    $list.find('[aria-click="change-show-status"]').on('click', function () {
      var $row = $(this).closest('tr');
      var status = $row.data('status');
      var isShow = listString.has('show', status);

      $.ajax({
          url: '/real_estates/change_show_status/' + $row.data('value') + '/' + (isShow ? 0 : 1),
          type: 'PUT',
          contentType: 'JSON'
      }).done(function (data) {
        if (data.status == 0) {
          if (isShow) {
            $row.data('status', listString.remove('show', status));
          }
          else {
            $row.data('status', listString.add('show', status));
          }
          initStatus($row);
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
    / Init change show status buttons
  */

  /*
    Init delete buttons
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
    / Init delete buttons
  */
});