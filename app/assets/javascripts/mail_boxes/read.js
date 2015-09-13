$(function () {
	var 
		$form = $('#reply_form'),
		$container = $('#mail_container');

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
				if (data.status == 0) {
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
	initReplyButton();
	initSaveDraft();

	/*
		Reply button
	*/

	function initReplyButton() {
		$container.find('[aria-click="reply"]').on('click', function () {
			if ($form.is('.collapsed-box')) {
				$form.find('[data-widget="collapse"]').click();
			}
			$body.animate({ scrollTop: $form.offset().top });
			$form.find('#subject').focus();
		});
	}

	/*
		/ Reply button
	*/

	/*
		Save draft
	*/

	function initSaveDraft() {
		$form.find('[aria-click="save-draft"]').on('click', function () {
			$.ajax({
				url: '/mail_boxes/send_mail',
				method: 'POST',
				data: $form.serialize() + '&draft',
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status == 0) {
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
		});
	}

	/*
		/ Save draft
	*/
});