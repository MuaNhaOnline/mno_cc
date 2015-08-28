$(function () {
	var $form = $('#forgot_form');

	initForm($form, {
		submit: function () {
			$.ajax({
				url: '/users/forgot_password',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON',
				async: false
			}).done(function (data) {
				if (data.status == 0) {
          window.location = '/users/active_callout/' + data.result + '/?status=forgot_password';
				}
				else {
					if (data.status == 1) {
		        popupPrompt({
		          title: _t.form.error_title,
		          type: 'danger',
		          content: 'Không tồn tại tài khoản với email trên.'
		        });						
						return;
					}

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