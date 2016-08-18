$(function () {
	var $form = $('#blog_form');

	initForm($form, {
		submit: function () {
			toggleLoadStatus(true);
			$.ajax({
				url: '',
				method: 'POST',
				data: $form.serialize(),
			}).always(function () {
				toggleLoadStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					window.location = '/blogs';
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