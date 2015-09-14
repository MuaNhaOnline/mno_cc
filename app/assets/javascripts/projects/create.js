$(function () {
  var $form = $('#create_p');

  initForm($form, {
    object: 'project',
    submit: function () {
      // Validate

      toggleLoadStatus(false);
      $.ajax({
        url: '/projects/create',
        method: 'POST',
        data: $form.serialize(),
        dataType: 'JSON'
      }).always(function () {
        toggleLoadStatus(false);
      }).done(function (data) {
        if (data.status == 0) {
          window.location = '/projects/my'
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
        });
      });
    }
  });
  initLocation();
  initChangeCurrency();
  initSaveDraft();
  initCheckDates();

  /*
    Init location
  */

  function initLocation() {
    var 
      $lat = $form.find('#lat'),
      $long = $form.find('#long');

    $form.find('#map').css({
      height: '300px'
    }).locationpicker({
      radius: 100,
      location: {latitude: $lat.val(), longitude: $long.val()},
      inputBinding: {
        latitudeInput: $lat,
        longitudeInput: $long,
        locationNameInput: $form.find('#location'),
        streetInput: $form.find('#street'),
        wardInput: $form.find('#ward'),
        districtInput: $form.find('#district'),
        provinceInput: $form.find('#province')
      },
      enableAutocomplete: true
    }, {
      'isNew': $form.find('#location').data('new')
    });
  }

  /*
    / Init location
  */

  /*
    Change currency
  */

  function initChangeCurrency() {
    var 
      $currency = $('#currency_id'),
      $display = $('#currency_display');

    changeCurrency();

    $form.find('#currency_id').on('change', function () {
      changeCurrency();
    });
    
    function changeCurrency() {
      $display.text($currency.children(':selected').text());
    }
  }

  /*
    / Change currency
  */

  /*
    Save draft
  */

  function initSaveDraft() {
    $form.find('[aria-click="save-draft"]').on('click', function () {
      toggleLoadStatus(false);
      $.ajax({
        url: '/projects/create',
        type: 'POST',
        data: $form.serialize() + '&draft',
        dataType: 'JSON'
      }).always(function () {
        toggleLoadStatus(false);
      }).done(function (data) {
        if (data.status == 0) {
          $form.prepend('<input type="hidden" name="project[id]" value="' + data.result + '" />');
          popupPrompt({
            title: _t.form.success_title,
            content: _t.project.view.create.save_draft_success_content,
            type: 'success'
          });
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
        });
      });
    });
  }

  /*
    / Save draft
  */

  /*
    Check dates
  */

  function initCheckDates() {
    var
      $estimate_starting_date = $form.find('#estimate_starting_date'),
      $estimate_finishing_date = $form.find('#estimate_finishing_date'),
      $starting_date = $form.find('#starting_date'),
      $finished_base_date = $form.find('#finished_base_date'),
      $transfer_date = $form.find('#transfer_date'),
      $docs_issue_date = $form.find('#docs_issue_date');

    $estimate_starting_date.add($estimate_finishing_date).on('change', function () {
      if ($estimate_starting_date.val() && $estimate_finishing_date.val()) {
        if (isLesser($estimate_finishing_date, $estimate_starting_date)) {
          $form.toggleValidInput($estimate_finishing_date, false, 'greater_start');
        }
        else {
          $form.toggleValidInput($estimate_finishing_date, true, 'greater_start');
        }
      }
    });

    $starting_date.add($finished_base_date).on('change', function () {
      if ($starting_date.val() && $finished_base_date.val()) {
        if (isLesser($finished_base_date, $starting_date)) {
          $form.toggleValidInput($finished_base_date, false, 'greater_start');
        }
        else {
          $form.toggleValidInput($finished_base_date, true, 'greater_start');
        }
      }
    });

    $transfer_date.add($finished_base_date).on('change', function () {
      if ($transfer_date.val() && $finished_base_date.val()) {
        if (isLesser($transfer_date, $finished_base_date)) {
          $form.toggleValidInput($transfer_date, false, 'greater_finish');
        }
        else {
          $form.toggleValidInput($transfer_date, true, 'greater_finish');
        }
      }
    });

    $docs_issue_date.add($finished_base_date).on('change', function () {
      if ($docs_issue_date.val() && $finished_base_date.val()) {
        if (isLesser($docs_issue_date, $finished_base_date)) {
          $form.toggleValidInput($docs_issue_date, false, 'greater_finish');
        }
        else {
          $form.toggleValidInput($docs_issue_date, true, 'greater_finish');
        }
      }
    });

    function isLesser($d1, $d2) {
      var 
        p1 = $d1.val().split('/'),
        p2 = $d2.val().split('/'),
        date1 = new Date(p1[2], p1[1] - 1, p1[0]),
        date2 = new Date(p2[2], p2[1] - 1, p2[0]);

      return date1 < date2
    }
  }

  /*
    / Check dates
  */
})