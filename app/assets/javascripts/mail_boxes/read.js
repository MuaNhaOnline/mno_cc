$(function () {
	var $form = $('#reply_form');

	$form.find("#content").wysihtml5();

	initForm($form, {
		object: 'mail_box',
		submit: function () {
			$.ajax({
				url: '/mail_boxes/send_mail',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status === 0) {
					alert('OK')
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