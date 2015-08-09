$(function () {
  var $form = $('#create_p');

  initForm($form, {
    object: 'project'
  });
  initLocation();
  initCheckArea();
  initChangeCurrency();

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
    Check area
  */

  function initCheckArea() {
    var 
      $campusArea = $form.find('#campus_area'),
      $widthX = $form.find('#width_x'),
      $widthY = $form.find('#width_y'),
      $areaAlert = $form.find('#area_alert');

    $campusArea.add($widthX).add($widthY).on({
      'change': function () {
        // If empty => valid too
        if ($campusArea.val() && $widthX.val() && $widthY.val() && !isValidArea($campusArea.val(), $widthX.val(), $widthY.val())) {
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
    Change currency
  */

  function initChangeCurrency() {
    var 
      $currency = $('#currency_id'),
      $display = $('#currency_display');

    $currency.on('change', function () {
      $display.text($currency.children(':selected').text());
    }).change();
  }

  /*
    / Change currency
  */
})