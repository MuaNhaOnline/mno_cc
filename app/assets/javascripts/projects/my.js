$(function () {
  var $list = $('#project_list'), find;

  initItem();
  initChangeShowStatus();
  initDelete();
  initPagination();

  /*
    Display with status
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

      $item.find('[aria-name="address"]').dotdotdot({
        height: 40,
        watch: true
      });

      /*
        Status
      */

      var 
        status = $item.data('status'),
        isDraft = listString.has('draft', status),
        isPending = listString.has('pending', status),
        isShow = listString.has('show', status),
        $status = $item.find('[aria-name="status"]');

      $status.html('');

      if (isDraft) {
        if ($status.children('[aria-name="draft"]').length == 0) {
          $status.append('<article class="node status-animation node-default"><div class="text"><span>' + _t.project.attribute.draft_status + '</span></div><div class="fa fa-file-text-o"></div></article>')
        }
      }
      else {
        if (isPending) {
          $status.append('<article class="node status-animation node-warning"><div class="text"><span>' + _t.project.attribute.pending_status + '</span></div><div class="fa fa-legal"></div></article>')
        }

        if (isShow) {
          $status.append('<article class="node status-animation node-success"><div class="text"><span>' + _t.project.attribute.show_status + '</span></div><div class="fa fa-eye"></div></article>')
        }
        else {
          $status.append('<article class="node status-animation node-danger"><div class="text"><span>' + _t.project.attribute.hide_status + '</span></div><div class="fa fa-eye-slash"></div></article>')
        }
      }

      // Constrol buttons

      if (isShow) {
        $item.find('[aria-click="change-show-status"]').attr('title', _t.project.view.my.hide).removeClass('fa-eye').addClass('fa-eye-slash');
      }
      else {
        $item.find('[aria-click="change-show-status"]').attr('title', _t.project.view.my.show).removeClass('fa-eye-slash').addClass('fa-eye');
      }

      if (isDraft) {
        $item.find('[aria-click="edit"]').attr('title', _t.project.view.my['continue']);
      }
      else {
        $item.find('[aria-click="edit"]').attr('title', _t.project.view.my.edit);
      }

      _initStatusAnimation($item);

      /*
        / Status
      */
    }
  }

  /*
    / Display with status
  */

  /*
    Change show status buttons
  */

  function initChangeShowStatus() {
    $list.find('[aria-click="change-show-status"]').on('click', function () {
      var $item = $(this).closest('.item');
      var status = $item.data('status');
      var isShow = listString.has('show', status);

      toggleLoadStatus(true);
      $.ajax({
        url: '/projects/change_show_status/' + $item.data('value') + '/' + (isShow ? 0 : 1),
        type: 'PUT',
        contentType: 'JSON'
      }).always(function () {
        toggleLoadStatus(false);
      }).done(function (data) {
        if (data.status == 0) {
          if (isShow) {
            $item.data('status', listString.remove('show', status));
          }
          else {
            $item.data('status', listString.add('show', status));
          }
          initItem($item);
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
    / Change show status buttons
  */

  /*
    Delete buttons
  */

  function initDelete() {
    $list.find('[aria-click="delete"]').on('click', function () {
      var $item = $(this).closest('.item');

      popupPrompt({
        title: _t.form.confirm_title,
        content: _t.project.view.my.delete_confirm,
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
      url: '/projects/_my_list',
      list: $list,
      pagination: $('#pagination'),
      done: function (content) {
        $list.html(content);
        initItem();
        initChangeShowStatus();
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