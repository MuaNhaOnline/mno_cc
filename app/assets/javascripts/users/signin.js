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
          popupPrompt({
            title: _t.form.success,
            type: 'success',
            content: 'Đăng nhập thành công'
          });
				}
				else if (data.status === 5) {
          popupPrompt({
            title: _t.form.error_title,
            type: 'danger',
            content: _t.form.status
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