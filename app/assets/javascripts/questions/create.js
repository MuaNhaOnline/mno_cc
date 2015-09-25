$(function () {
	var $form = $('#question_form');

	initForm($form, {
		object: 'question',
		submit: function () {
			$form.find('.callout-danger').remove();

			toggleLoadStatus(true);
			$.ajax({
				url: '/questions/create',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
          popupPrompt({
            title: _t.form.success_title,
            type: 'success',
            content: 'Đăng câu hỏi thành công, vui lòng chờ để nhận câu trả lời.',
            onEscape: function () {
            	window.location = '/';
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
	});
});