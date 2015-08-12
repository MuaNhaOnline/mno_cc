$(function () {
  var $form = $('#create_re');
  
  /*
    Init
  */

  initShapeWidthConstraint();
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
                    $form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');

                    // Turn on until full inputs
                    toggleUntilFull(true);

                    // Init toggled input
                    $form.inputToggle();

                    // Collapse all success boxes
                    collapseBoxes($form.find('.input-box:not(.until-full) .box:not(.collapse-box)'));
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
  initSaveDraft();
  initLocation();
  initCheckArea();
  initUncheck();
  initUntilFull();  

  /*
    / Init
  */

  /*
    Toggle until full elements
  */

  function toggleUntilFull(on, isStart) {
    if (on) {
      $form.find('.input-box.until-full').show().find(':input').prop('disabled', false);
      $form.find('[aria-click="turn-on-until-full"]').remove();
      if (!isStart) {
        $body.animate(
          { scrollTop: $form.find('.input-box.until-full:visible:eq(0)').offset().top - 20 }
        );
      }
      $form.data('full', true);
    }
    else {
      $form.find('.input-box.until-full').hide().find(':input').prop('disabled', true); 
      $form.find('[aria-click="turn-on-until-full"]').on('click', function () {
        toggleUntilFull(true);
      });
    }
  }

  /*
    / Toggle until full elements
  */

  /*
    Collapse boxes
  */

  function collapseBoxes($boxes) {
    $boxes.addClass('collapsed-box');
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
    Check area
  */

  function initCheckArea() {
    var 
      $campusArea = $form.find('#campus_area'),
      $constructionalArea = $form.find('#constructional_area'),
      $usingArea = $form.find('#using_area'),
      $widthX = $form.find('#width_x'),
      $widthY = $form.find('#width_y'),
      $areaAlert = $form.find('#area_alert');

    $campusArea.add($constructionalArea).add($usingArea).add($widthX).add($widthY).on({
      'change disable enable': function () {
        var $area;

        if ($campusArea.is(':enabled')) {
          $area = $campusArea;
        }
        else if ($constructionalArea.is(':enabled')) {
          $area = $constructionalArea;
        }
        else {
          $area = $usingArea;
        }

        // If empty => valid too
        if ($area.val() && $widthX.val() && $widthY.val() && !isValidArea($area.val(), $widthX.val(), $widthY.val())) {
          $areaAlert.show();
        }
        else {
          $areaAlert.hide();
        }
      }
    }).change();

    function isValidArea(area, widthX, widthY) {
      return widthX * widthY <= area;
    }
  }

  /*
    / Check area
  */

  /*
    Uncheck
  */

  function initUncheck() {
    $form.find('[aria-click="uncheck"]').on('click', function () {
      $(this).closest('.box').find('[type="checkbox"]').prop('checked', false);
    });
  }

  /*
    / Uncheck
  */

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
    });
  }

  /*
    / Init location
  */

  /*
    Until full
  */

  function initUntilFull() {
    toggleUntilFull($form.data('full'), true);
  }

  /*
    / Init until full
  */

  /*
    Shape width
  */

  function initShapeWidthConstraint() {
    var 
      $shape = $form.find('#shape');
      $shapeWidth = $form.find('#shape_width'),
      $widthX = $form.find('#width_x');

    $shape.add($shapeWidth).add($widthX).data('validate', function () {
      var
        shapeWidth = $shapeWidth.val(),
        width = $widthX.val();

      if (shapeWidth && width) {
        switch ($shape.children(':selected').val()) {
          case '1':
            if (parseFloat(shapeWidth) <= parseFloat(width)) {
              return {
                status: false,
                input: $shapeWidth,
                constraint: 'width'
              };
            }
            break;
          case '2':
            if (parseFloat(shapeWidth) >= parseFloat(width)) {
              $form.toggleValidInput($shapeWidth, false, 'width');
              return {
                status: false,
                input: $shapeWidth,
                constraint: 'width'
              };
            }
            break;
        }
      }  

      return {
        status: true,
        input: $shapeWidth
      };    
    });
  }

  /*
    / Shape width
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