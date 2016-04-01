$(function () {

	var currentGroupId = null;

	// Group

		initGroupItems($('#groups_list > *'));
	
		// Create
		
			$('#create_group').on('click', function () {
				var $popup = popupFull({
					url: '/system_groups/_create_form',
					width: 'small',
					success: function ($popup) {
						var $form = $popup.find('form');
						initForm($form, {
							submit: function () {
								$.ajax({
									url: '/system_groups/save',
									method: 'POST',
									data: $form.serialize(),
									dataType: 'JSON'
								}).done(function (data) {
									if (data.status == 0) {
										var $item = $(data.result);
										initGroupItems($item);
										$('#groups_list').prepend($item);
										$popup.off();
									}
									else {
										errorPopup();
									}
								}).fail(function () {
									errorPopup();
								});
							}
						});
					},
					fail: function () {
						errorPopup();
					}
				});
			});
		
		// / Create

		// Edit
		
			$('#edit_group').on('click', function () {
				if (!currentGroupId) {
					return;
				}

				var $popup = popupFull({
					url: '/system_groups/_create_form/' + currentGroupId,
					width: 'small',
					success: function ($popup) {
						var $form = $popup.find('form');
						initForm($form, {
							submit: function () {
								$.ajax({
									url: '/system_groups/save',
									method: 'POST',
									data: $form.serialize(),
									dataType: 'JSON'
								}).done(function (data) {
									if (data.status == 0) {
										var $item = $(data.result);
										initGroupItems($item);
										$item.addClass('active');

										$('#groups_list > .active').replaceWith($item);
										$popup.off();
									}
									else {
										errorPopup();
									}
								}).fail(function () {
									errorPopup();
								});
							}
						});
					},
					fail: function () {
						errorPopup();
					}
				});
			});
		
		// / Edit

		// Delete
		
			$('#delete_group').on('click', function () {
				if (!currentGroupId) {
					return;
				}

				popupPrompt({
					title: 'Bạn có chắc muốn xóa?',
					content: 'Bạn có chắc muốn xóa nhóm này không?',
					type: 'warning',
					buttons: [
						{
							text: 'Xóa',
							type: 'warning',
							handle: function () {
								$.ajax({
									url: '/system_groups/delete/' + currentGroupId,
									method: 'POST',
									dataType: 'JSON'
								}).done(function (data) {
									if (data.status == 0) {
										$('#groups_list > .active').remove();
										$('.users-container, .permissions-container').addClass('hidden');
										currentGroupId = null;
									}
									else {
										errorPopup();
									}
								}).fail(function () {
									errorPopup();
								})
							}
						},
						{
							text: 'Không'
						}
					]
				})
			});
		
		// / Delete

		// Init items
		
			function initGroupItems($items) {
				$items.on('click', function () {
					var $item = $(this);

					if ($item.hasClass('active')) {
						return;
					}

					currentGroupId = $item.data('value');
					$item.addClass('active').siblings('.active').removeClass('active');
					$('.users-container, .permissions-container').removeClass('hidden');

					$.ajax({
						url: '/system_groups/get_data_for_manage/' + currentGroupId,
						dataType: 'JSON'
					}).done(function (data) {
						if (data.status == 0) {
							var $usersList = $(data.result.users);

							initUserItems($usersList.find('.item'));

							$('#users_list').html($usersList);

							updatePermissionList(data.result.permissions);
						}
						else {
							errorPopup();
						}
					}).fail(function () {
						errorPopup();
					})
				});;
			}
		
		// / Init items
	
	// / Group

	// User

		// Find user
		
			initForm($('#find_user_form'));
			$('#find_user').on('valueChange', function () {
				if (!this.value && !$(this).data('value')) {
					return;
				}

				openUserInfoPopup($(this).data('value'));
			});

		// / Find user

		// Init user info popup
		
			function openUserInfoPopup(userId) {
				popupFull({
					url: '/system_groups/_user_info_for_manage',
					urlData: {
						id: currentGroupId,
						user_id: userId
					},
					width: 'small',
					success: function ($popup) {
						$popup.find('[aria-click="add"]').on('click', function () {
							$.ajax({
								url: '/system_groups/add_or_remove_user',
								method: 'POST',
								data: {
									id: currentGroupId,
									user_id: userId,
									is_add: 1
								},
								dataType: 'JSON'
							}).done(function (data) {
								if (data.status == 0) {
									$popup.off();

									var $item = $(data.result);

									initUserItems($item.children());

									$('#users_list').prepend($item);
								}
								else {
									errorPopup();                                                                 
								}
							}).fail(function () {
								errorPopup();
							})
						});

						$popup.find('[aria-click="remove"]').on('click', function () {
							$.ajax({
								url: '/system_groups/add_or_remove_user',
								method: 'POST',
								data: {
									id: currentGroupId,
									user_id: userId
								},
								dataType: 'JSON'
							}).done(function (data) {
								if (data.status == 0) {
									$popup.off();
									$('#users_list .item[data-value="' + userId + '"]').parent().remove();
								}
								else {
									errorPopup();                                                                 
								}
							}).fail(function () {
								errorPopup();
							})
						});
					}
				})
			}
		
		// / Init user info popup

		// Init user
		
			function initUserItems($items) {
				$items.on('click', function () {
					openUserInfoPopup($(this).data('value'));
				});
			}

		// / Init user
	
	// / User

	// Permission

		// Init item
			
			$('#permissions_list [aria-click="toggle_childs"]').on('click', function (e) {
				// Prevent default of label
				e.preventDefault();

				var $button = $(this);

				if ($button.hasClass('active')) {
					$button.closest('.item').removeClass('open');
					$button.addClass('fa-caret-left').removeClass('fa-caret-down active');
				}
				else {
					$button.closest('.item').addClass('open');
					$button.addClass('fa-caret-down active').removeClass('fa-caret-left');
				}
			});
		
		// / Init item

		// Update permissions
		
			$('#save_permissions').on('click', function () {
				if (!currentGroupId) {
					return;
				}

				$.ajax({
					url: '/system_groups/save_permissions/' + currentGroupId,
					data: $('#permissions_list').serialize(),
					method: 'POST',
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						alert('OK');
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			});

			function updatePermissionList(permissionIds)  {
				$('#permissions_list input').prop('checked', false);
				$('#permissions_list').find(permissionIds.map(function (permissionId) {
					return 'input[value="' + permissionId + '"]';
				}).join(',')).prop('checked', true);
			}
		
		// / Update permissions
	
	// / Permission

})