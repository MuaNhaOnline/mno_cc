$(function () {
  var $list = $('#re_list');

  initDisplay();
  initAppraise();
  initPagination();

  /*
    Display
  */

  function initDisplay() {
    $list.find('tr').each(function () {
      var 
        $row = $(this),
        $sell_price = $row.find('[aria-object="sell_price"]'),
        $rent_price = $row.find('[aria-object="rent_price"]');

      $sell_price.text(moneyFormat($sell_price.text()));
      $rent_price.text(moneyFormat($rent_price.text()));
    });
  }

  /*
    / Display
  */

  /*
    Appraise
  */

  function initAppraise() {
    $list.find('[aria-click="appraise"]').on('click', function () {
      var 
        $button = $(this),
        $row = $button.closest('tr'),
        $html = $('<article style="width: 300px; max-width: 80vw" class="box box-solid box-default"><form class="form box-body"><input type="hidden" name="real_estate_id" value="' + $row.data('value') + '" /><div></div><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">' + _t.form.finish + '</button> <button type="button" class="btn btn-default btn-flat">' + _t.form.cancel + '</button></article></form></article>'),
        $form = $html.find('form'),
        $inputs = $form.find('div'),
        purpose = $button.data('type');

      if (purpose == 'sell' || purpose == 'sell_rent') {
        $inputs.append('<article class="form-group"><label for="sell_price">' + _t.appraisal_company.view.appraise.sell_price + '</label><input name="sell_price" value="' + $row.find('[aria-object="sell_price"]').text() + '" data-constraint="integer" class="form-control separate-number" id="sell_price" /></article>');
      }
      if (purpose == 'rent' || purpose == 'sell_rent') {
        $inputs.append('<article class="form-group"><label for="rent_price">' + _t.appraisal_company.view.appraise.rent_price + '</label><input name="rent_price" value="' + $row.find('[aria-object="rent_price"]').text() + '" data-constraint="integer" class="form-control separate-number" id="rent_price" /></article>');
      }

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
            url: '/appraisal_companies/set_price',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'JSON'
          }).always(function () {
            toggleLoadStatus(false);
          }).done(function (data) {
            if (data.status == 0) {
              $popup.off();

              $row.find('[aria-object="rent_price"]').text($form.find('[name="sell_price"]').val());
              $row.find('[aria-object="sell_price"]').text($form.find('[name="rent_price"]').val());
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
    / Appraise
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
        url: '/appraisal_companies/_appraise_list',
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