$(function () {
	var $form = $('#investor_form');

	initForm($form, {
		submit: function () {
			$.ajax({
				url: '/investors/save',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).done(function (data) {
				if(data.status == 0) {
					// window.location = '/investors/' + data.result;
					window.location = '/chu-dau-tu/quan-ly'
				}
				else {
					errorPopup();
				}
			}).fail(function () {
				errorPopup();
			});
		}
	});
});