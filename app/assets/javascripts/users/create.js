$(function () {
	var $form = $('#create_user');

	initForm($form, {
		submit_status: true,
		object: 'user',
		submit: function () {
			// Check if checking
			if (_temp.accountChecking) {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: 'Đang kiểm tra tên tài khoản, vui lòng thực hiện lại sau'
				});

				return;
			}
			if (_temp.emailChecking) {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: 'Đang kiểm tra email, vui lòng thực hiện lại sau'
				});

				return;
			}

			toggleLoadStatus(true);
			$.ajax({
				url: '/register',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
				$form.submitStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					if ($form.find('[name="user[id]"]').length == 0) {
						window.location = '/users/active_callout/' + data.result + '/?status=success';
					}
					else {
						if (data.email_changed) {
							window.location = '/users/active_callout/' + data.result + '/?status=old_email';
						}
						else {
							window.location = '/users/' + data.result;	
						}
					}
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

	initCheckAccount();
	initCheckEmail();
	initCheckRepeatPassword();
	initChangePassword();
	initCancelChangeMail();

	// Check account

	function initCheckAccount() {
		var $account = $form.find('#account')

		_temp.accountChecking = false;

		$account.on('change', function () {
			// if valid
			if (!$account.data('invalid')) {
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

	// / Check account

	// Check email

	function initCheckEmail() {
		var $email = $form.find('#email')

		_temp.emailChecking = false;

		$email.on('change', function () {
			// if valid
			if (!$email.data('invalid')) {
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

	// / Check email

	// Check repeat password

	function initCheckRepeatPassword() {
		var 
			$password = $form.find('#password'), 
			$repeatPassword = $form.find('#repeat_password');

		$password.add($repeatPassword).on('change', function () {
			if ($password.val() && $repeatPassword.val()) {
				if ($password.val() == $repeatPassword.val()) {
					$form.toggleValidInput($repeatPassword, true, 'same');
				}
				else {
					$form.toggleValidInput($repeatPassword, false, 'same');	
				}
			}
		});
	}

	// / Check repeat password

	// Change password

	function initChangePassword() {
		$form.find('[aria-click="change-password"]').on('click', function () {
			var 
				$html = $('<article style="width: 300px; max-width: 80vw" class="box box-primary"><section class="box-header"><h3 class="box-title">Đổi mật khẩu</h3></section><form class="form box-body"><input type="hidden" name="user[id]" value="' + $form.find('[name="user[id]"]').val() + '" /><article class="form-group"><label for="old_password">Mật khẩu cũ</label><input name="user[old_password]" data-constraint="required" class="form-control" type="password" id="user[old_password]" /></article><article class="form-group"><label for="password">Mật khẩu mới</label><input name="user[password]" data-constraint="required" class="form-control" type="password" id="password" /></article><article class="form-group"><label for="repeat_password">Nhập lại mật khẩu mới</label><input name="repeat_password" data-constraint="required" class="form-control" type="password" id="repeat_password" /></article><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">' + _t.form.finish + '</button> <button type="button" class="btn btn-default btn-flat">' + _t.form.cancel + '</button></article></form></article>'),
				$form2 = $html.find('form');

			var $popup = popupFull({
				html: $html
			});

			$html.find('button[type="button"]').on('click', function () {
				$popup.off();
			});

			initForm($form2, {
				object: 'user',
				submit: function () {
					toggleLoadStatus(true);
					$.ajax({
						url: '/users/change_password',
						method: 'POST',
						data: $form2.serialize(),
						dataType: 'JSON'
					}).always(function () {
						toggleLoadStatus(false);
					}).done(function (data) {
						if (data.status == 0) {
							$popup.off();
							popupPrompt({
								title: _t.form.success_title,
								type: 'success',
								content: 'Đổi mật khẩu thành công'
							});
						}
						else {
							if (data.status == 5) {
								popupPrompt({
									title: _t.form.error_title,
									type: 'danger',
									content: 'Mật khẩu cũ không đúng'
								});
								return;
							}

							$popup.off();
							popupPrompt({
								title: _t.form.error_title,
								type: 'danger',
								content: _t.form.error_content
							})
						}
					}).fail(function () {
						$popup.off();
						popupPrompt({
							title: _t.form.error_title,
							type: 'danger',
							content: _t.form.error_content
						})
					});
				}
			});

			initCheckRepeatPassword_2();

			// Check repeat password

			function initCheckRepeatPassword_2() {
				var 
					$password = $form2.find('#password'), 
					$repeatPassword = $form2.find('#repeat_password');

				$password.add($repeatPassword).on('change', function () {
					if ($password.val() && $repeatPassword.val()) {
						if ($password.val() === $repeatPassword.val()) {
							$form2.toggleValidInput($repeatPassword, true, 'same');
						}
						else {
							$form2.toggleValidInput($repeatPassword, false, 'same');	
						}
					}
				});
			}

			// / Check repeat password
		});
	}

	// / Change password

	// Cancel change mail

	function initCancelChangeMail() {
		$form.find('[aria-click="cancel_change_mail"]').on('click', function () {
			var $btn = $(this);

			toggleLoadStatus(true);
			$.ajax({
				url: '/users/cancel_change_email/' + $form[0].elements['user[id]'].value,
				method: 'POST',
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
					$btn.closest('.form-group').remove();
					$form.find('[aria-name="email"]').removeClass('hide');
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
				});
			});
		});
	}

	// / Cancel change mail

});