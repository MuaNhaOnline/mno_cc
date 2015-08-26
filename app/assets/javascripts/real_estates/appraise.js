$(function () {
  var $list = $('#re_list');

  initPagination();
  initAppraisalCompany();

  /*
    Appraisal company
  */

  function initAppraisalCompany() {
    $list.find('[aria-click="edit-appraisal-company"]').on('click', function () {
      var 
        $row = $(this).closest('tr'),
        $html = $('<article style="width: 300px; max-width: 80vw" class="box box-solid box-default"><form class="form box-body"><input type="hidden" name="id" value="' + $row.data('value') + '" /><article class="form-group"><input name="ac_id" data-url="/appraisal_companies/autocomplete" aria-input-type="autocomplete" class="form-control" placeholder="' + _t.real_estate.view.appraise.appraisal_company_placeholder + '" /></article><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">' + _t.form.finish + '</button> <button type="button" class="btn btn-default btn-flat">' + _t.form.cancel + '</button></article></form></article>'),
        $form = $html.find('form');

      var $popup = popupFull({
        html: $html
      });

      $html.find('button[type="button"]').on('click', function () {
        $popup.off();
      });

      initForm($form, {
        submit: function () {
          $.ajax({
            url: '/real_estates/set_appraisal_company',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'JSON'
          }).done(function (data) {
            if (data.status === 0) {
              $popup.off();

              $row.find('[aria-object="ac"]').text($form.find('[name="ac_id_ac"]').val());
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
    Appraisal company
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
        url: '/real_estates/_appraise_list',
        afterLoad: function (content) {
          $list.html(content);
        }
      }
    );
  }

  /*
    / Pagination
  */
});