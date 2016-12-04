$(function () {
    var
        $form = $('#user_form'),
        accountChecking = false,
        emailChecking = false;

	initForm($form, {
		submit: function () {
			// Check if checking
			if (accountChecking) {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: 'Đang kiểm tra tên tài khoản, vui lòng thực hiện lại sau'
				});
				return;
			}
			if (emailChecking) {
				popupPrompt({
					title: _t.form.error_title,
					type: 'danger',
					content: 'Đang kiểm tra email, vui lòng thực hiện lại sau'
				});
				return;
			}

			$.ajax({
				url: $form.attr('action'),
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
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
					_errorPopup();
				}
			}).fail(function () {
				_errorPopup();
			});
		}
	});

	// Check account
	(function () {
		var $account = $form.find('#account');

		$account.on('change', function () {
			// if valid
			if (!$account.data('invalid')) {
				// if checking => abort
				if (accountChecking) {
					accountChecking.abort();
				}

				// check unique
				accountChecking = $.ajax({
					url:       '/users/check_unique_account',
                    method:     'POST',
					data:      { account: $account.val() }
				}).always(function () {
					accountChecking = false;
				}).done(function (data) {
					if (data.status === 0) {
						if (data.result) {
							$form.toggleValidInput($account, true, 'unique');
						}
						else {
							$form.toggleValidInput($account, false, 'unique', null, 'Tên đăng nhập đã được sử dụng');
						}
					}
					else {
						_errorPopup();
					}
				}).fail(function (xhr, status) {
					if (status != 'abort') {
						_errorPopup();
					}
				});
			}
		});
    })();

	// Check email
    (function () {
		var $email = $form.find('#email');

		$email.on('change', function () {
			// if valid
			if (!$email.data('invalid')) {
				// if checking => abort
				if (emailChecking) {
					emailChecking.abort();
				}

				// check unique
				emailChecking = $.ajax({
					url: '/users/check_unique_email',
                    method: 'POST',
					data: { email: $email.val() }
				}).always(function () {
					emailChecking = false;
				}).done(function (data) {
					if (data.status == 0) {
						if (data.result) {
							$form.toggleValidInput($email, true, 'unique');
						}
						else {
							$form.toggleValidInput($email, false, 'unique', null, 'Email này đã được sử dụng');
						}
					}
					else {
						_errorPopup();
					}
				}).fail(function (xhr, status) {
					if (status != 'abort') {
						_errorPopup();
					}
				});
			}
			else {
				if (emailChecking) {
					emailChecking.abort();
				}
			}
		});
    })();

	// Check repeat password
    (function () {
		var 
			$password = $form.find('#password'), 
			$repeatPassword = $form.find('#repeat_password');

		$password.add($repeatPassword).on('change', function () {
			if ($password.val() && $repeatPassword.val()) {
				if ($password.val() == $repeatPassword.val()) {
					$form.toggleValidInput($repeatPassword, true, 'same');
				}
				else {
					$form.toggleValidInput($repeatPassword, false, 'same', null, 'Mật khẩu không trùng khớp');	
				}
			}
		});
    })();

	// / Check repeat password

	// Change password
	$form.find('[data-action="change_password"]').on('click', function () {
		var 
			$html = $('<article class="box box-primary"><section class="box-header"><h3 class="box-title">Đổi mật khẩu</h3></section><form class="form box-body"><input type="hidden" name="user[id]" value="' + $form.find('[name="user[id]"]').val() + '" /><article class="form-group"><label for="old_password">Mật khẩu cũ</label><input name="user[old_password]" data-constraint="required" class="form-control" type="password" id="user[old_password]" /></article><article class="form-group"><label for="password">Mật khẩu mới</label><input name="user[password]" data-constraint="required" class="form-control" type="password" id="password" /></article><article class="form-group"><label for="repeat_password">Nhập lại mật khẩu mới</label><input name="repeat_password" data-constraint="required" class="form-control" type="password" id="repeat_password" /></article><article class="text-center"><button type="submit" class="btn btn-primary btn-flat">' + _t.form.finish + '</button> <button type="button" class="btn btn-default btn-flat">' + _t.form.cancel + '</button></article></form></article>'),
			$form2 = $html.find('form');

		var $popup = popupFull({
			html: $html,
            width: 'small'
		});

		$html.find('button[type="button"]').on('click', function () {
			$popup.off();
		});

		initForm($form2, {
			object: 'user',
			submit: function () {
				$.ajax({
					url: '/users/change_password',
					method: 'POST',
					data: $form2.serialize(),
					dataType: 'JSON'
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
						$form2.toggleValidInput($repeatPassword, false, 'same', null, 'Mật khẩu không trùng khớp');	
					}
				}
			});
		}

		// / Check repeat password
	});

	// Cancel change mail
	(function () {
        $form.find('[data-action="cancel_change_mail"]').on('click', function () {
            var $btn = $(this);

            $.ajax({
                url: '/users/cancel_change_email/' + $form[0].elements['user[id]'].value,
                method: 'POST',
                dataType: 'JSON'
            }).done(function (data) {
                if (data.status == 0) {
                    $btn.closest('.form-group').remove();
                    $form.find('[data-name="email"]').show();
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
    })();
});