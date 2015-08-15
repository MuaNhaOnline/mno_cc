$(function () {
	var $form = $('#signin_form');

	initForm($form, {
		object: 'user',
		submit: function () {
			$.ajax({
				url: '/signin',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status === 0) {
          location = '/home/back'
				}
				else if (data.status === 5) {
          popupPrompt({
            title: _t.form.error_title,
            content: data.result.result,
            type: 'danger',
            onEscape: function () {
            	$form.find('#password').val('').focus();
		          if (data.result.status == 1) {
		        		// Account wrong
            		$form.find('#account').select();
		          }
            }
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
        })
			});
		}
	})
});