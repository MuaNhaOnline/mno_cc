$(function () {
  var $form = $('#create_re');
  
  /*
    Init
  */

  initForm($form, {
    object: 'real_estate',
    submit: function () {
      $.ajax({
        url: '/real_estates/create',
        type: 'POST',
        data: $form.serialize(),
        dataType: 'JSON'
      }).done(function (data) {
        if (data.status == 0) {
          if ($form.data('full')) {
            window.location = '/real_estates/' + data.result;
          }
          else {
            popupPrompt({
              title: _t.form.success_title,
              content: _t.real_estate.create.success_content,
              type: 'success',
              buttons: [
                {
                  text: _t.real_estate.create['continue'],
                  type: 'primary',
                  handle: function () {
                    // Hidden id input
                    $form.data('full', true);
                    $form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');

                    // Turn on until full inputs
                    toggleUntilFull(true);

                    // Init toggled input
                    $form.inputToggle();

                    // Collapse all success boxes
                    collapseBoxes($form.find('.input-box:not(.until-full) .box:not(.collapse-box)'));

                    // Scroll to first until full input
                    $body.animate(
                        { scrollTop: $('.input-box.until-full:visible').offset().top - 50 }
                    );
                  }
                }, {
                  text: _t.real_estate.create.view,
                  handle: function () {
                    window.location = '/real_estates/' + data.result;
                  }
                }
              ]
            })
          }
        }
        else {
          var result = data.result;
          var errors = '';
          for (var i = 0; i < result.length; i++) {
            errors += result[i] + '<br />';
          }
          popupPrompt({
            title: _t.form.error_title,
            type: 'danger',
            content: errors
          })
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
  initUnitInput();
  if (!$form.data('full')) {
    toggleUntilFull(false); 
  }
  initPrice();
  initSaveDraft();
  initLocation();

  /*
    / Init
  */

  /*
    Toggle until full elements
  */

  function toggleUntilFull(on) {
    if (on) {
      $form.find('.input-box.until-full').show().find(':input').prop('disabled', false);
    }
    else {
      $form.find('.input-box.until-full').hide().find(':input').prop('disabled', true); 
    }
  }

  /*
    / Toggle until full elements
  */

  /*
    Collapse boxes
  */

  function collapseBoxes($boxes) {
    $boxes.addClass('collapse-box');
    $boxes.find('[data-widget="collapse"] i').removeClass('fa-minus').addClass('fa-plus');
    $boxes.find('.box-body, .box-footer').hide();
  }

  /*
    / Collapse boxes
  */

  /*
    Unit format
  */

  function initUnitInput() {
  	changeCurrency();

  	$form.find('#currency_id').on('change', function () {
  		changeCurrency();
  	});

  	/*
		Change currency
  	*/
  	function changeCurrency() {
  		$form.find('.unit-label').attr('data-currency', $form.find('#currency_id :selected').text());
  	}

  	$form.find('[aria-click="change-unit"]').on('click', function () {
  		var $button = $(this);

		// Change text
		$button.closest('ul').siblings('button').text($button.text());

		// Change value
		$button.closest('ul').siblings('input[type="hidden"]').val($button.data('value')).change();
  	});
  }

  /*
    / Unit format
  */

  /*
    Price format
  */

  function initPrice() {
    $form.find('#sell_price, #rent_price').on({
      focus: function () {
        _temp['price'] = this.value;
      },
      keyup: function () {
        var input = this;
        var value = input.value;

        var oldPrice = _temp['price'];
        if (oldPrice == value) {
          return;
        }

        // Get current selection end
        var selectionEnd = value.length - input.selectionEnd;

        value = moneyFormat(intFormat(value), ',');
        input.value = value;
        selectionEnd = value.length - selectionEnd;
        input.setSelectionRange(selectionEnd, selectionEnd);

        _temp['price'] = value;
      },
      paste: function () {
        var input = this;
        var value = input.value;

        var oldPrice = _temp['price'];
        if (oldPrice == value) {
          return;
        }

        // Get current selection end
        var selectionEnd = value.length - input.selectionEnd;

        value = moneyFormat(intFormat(value), ',');
        input.value = value;
        selectionEnd = value.length - selectionEnd;
        input.setSelectionRange(selectionEnd, selectionEnd);

        _temp['price'] = value;
      }
    }).focusout();
  }

  /*
    / Price format
  */

  /*
    Init location
  */

  function initLocation() {
    var 
      $lat = $form.find('#lat'),
      $long = $form.find('#long');

    $form.find('#location').css({
      height: '300px'
    }).locationpicker({
      radius: 100,
      location: {latitude: $lat.val(), longitude: $long.val()},
      inputBinding: {
        latitudeInput: $lat,
        longitudeInput: $long,
        locationNameInput: $form.find('#address')
      }
    });
  }

  /*
    / Init location
  */

  /*
    Save draft
  */

  function initSaveDraft() {
    $form.find('[aria-click="save-draft"]').on('click', function () {
      $.ajax({
        url: '/real_estates/create',
        type: 'POST',
        data: $form.serialize() + '&draft',
        dataType: 'JSON'
      }).done(function (data) {
        if (data.status == 0) {
          popupPrompt({
            title: _t.form.success_title,
            content: _t.real_estate.create.save_draft_success_content,
            type: 'success'
          })
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
});