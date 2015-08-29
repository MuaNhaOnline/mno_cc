$(function () {
  var $form = $('#create_ac');
  
  /*
    Init
  */

  initForm($form, {
    object: 'appraisal_company',
    submit: function () {
      toggleLoadStatus(true);
      $.ajax({
        url: '/appraisal_companies/create',
        type: 'POST',
        data: $form.serialize(),
        dataType: 'JSON'
      }).always(function () {
        toggleLoadStatus(false);
      }).done(function (data) {
        if (data.status == 0) {
          alert('OK');
        }
        else {
          popupPrompt({
            title: _t.form.error_title,
            type: 'danger',
            content: _t.form.error_content
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
});