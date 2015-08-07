$(function () {
	var $form = $('#create_user');

	initForm($form, {
		object: 'user',
		submit: function () {
			// Check if checking
			if (_temp.accountChecking) {
        popupPrompt({
          title: _t.form.error_title,
          type: 'danger',
          content: 'Đang kiểm tra tên tài khoản, vui lòng thử lại sau'
        });

        return;
			}
			if (_temp.emailChecking) {
        popupPrompt({
          title: _t.form.error_title,
          type: 'danger',
          content: 'Đang kiểm tra email, vui lòng thử lại sau'
        });

        return;
			}

			$.ajax({
				url: '/register',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).done(function (data) {
				if (data.status == 0) {
					alert('OK');
				}
				else {
          var result = data.result;
          var errors = '';
          for (var i = 0; i < result.length; i++) {
            errors += result[i] + '<br />';
          }
          popupPrompt({
            title: _t.form.error_title,
            type: 'danger',
            content: errors
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

	initCheckAccount();
	initCheckEmail();
	initCheckRepeatPassword();

	/*
		Check account
	*/

	function initCheckAccount() {
		var $account = $form.find('#account')

		_temp.accountChecking = false;

		$account.on('change', function () {
			// if valid
			if ($account.val()) {
				// if checking => abort
				if (_temp.accountChecking) {
					_temp.accountChecking.abort();
				}

				// check unique

				_temp.accountChecking = $.ajax({
					url: '/users/check_unique_account',
					data: { account: $account.val() },
					dataType: 'JSON'
				}).always(function () {
					_temp.accountChecking = false;
				}).done(function (data) {
					if (data.status === 0) {
						if (data.result) {
							$form.toggleValidInput($account, true, 'unique');
						}
						else {
							$form.toggleValidInput($account, false, 'unique');
						}
					}
					else {
						popupPrompt({
		          title: _t.form.error_title,
		          type: 'danger',
		          content: _t.form.error_content
		        });
					}
				}).fail(function (xhr, status) {
					if (status !== 'abort') {
		        popupPrompt({
		          title: _t.form.error_title,
		          type: 'danger',
		          content: _t.form.error_content
		        })
					}
				});
			}
		});
	}

	/*
		/ Check account
	*/

	/*
		Check email
	*/

	function initCheckEmail() {
		var $email = $form.find('#email')

		_temp.emailChecking = false;

		$email.on('change', function () {
			// if valid
			if ($email.val()) {
				// if checking => abort
				if (_temp.emailChecking) {
					_temp.emailChecking.abort();
				}

				// check unique

				_temp.emailChecking = $.ajax({
					url: '/users/check_unique_email',
					data: { email: $email.val() },
					dataType: 'JSON'
				}).always(function () {
					_temp.emailChecking = false;
				}).done(function (data) {
					if (data.status === 0) {
						if (data.result) {
							$form.toggleValidInput($email, true, 'unique');
						}
						else {
							$form.toggleValidInput($email, false, 'unique');
						}
					}
					else {
						popupPrompt({
		          title: _t.form.error_title,
		          type: 'danger',
		          content: _t.form.error_content
		        });
					}
				}).fail(function (xhr, status) {
					if (status !== 'abort') {
		        popupPrompt({
		          title: _t.form.error_title,
		          type: 'danger',
		          content: _t.form.error_content
		        })
					}
				});
			}
			else {
				if (_temp.emailChecking) {
					_temp.emailChecking.abort();
				}
			}
		});
	}

	/*
		/ Check email
	*/

	/*
		Check repeat password
	*/

	function initCheckRepeatPassword() {
		var 
			$password = $form.find('#password'), 
			$repeatPassword = $form.find('#repeat_password');

		$password.add($repeatPassword).on('change', function () {
			if ($password.val() && $repeatPassword.val()) {
				if ($password.val() === $repeatPassword.val()) {
					$form.toggleValidInput($repeatPassword, true, 'same');
				}
				else {
					$form.toggleValidInput($repeatPassword, false, 'same');	
				}
			}
		});
	}

	/*
		/ Check repeat password
	*/

});