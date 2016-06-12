var page, per, order = {};

$(function () {
	var 
		$list 		= 	$('#re_list'), 
		$searchForm = 	$('#search_form'),
		pagination;

	// Item

		function initItems($item, justSetStatus) {
			justSetStatus = typeof justSetStatus == 'undefined' ? false : justSetStatus;

			if ($item) {
				setItem($item);
			}
			else {
				$list.find('.item').each(function () {
					setItem($(this));
				});
			}

			function setItem($item) {

				$item.find('.address').dotdotdot({
					height: 40,
					watch: true
				});

				// Status

					var 
						status = $item.data('status'),
						isDraft = listString.has('draft', status),
						isPending = listString.has('pending', status),
						isShow = listString.has('show', status),
						isFull = listString.has('full', status),
						// isAppraised = listString.has('appraised', status),
						// isNotAppraised = listString.has('not_appraised', status);
						$status = $item.find('[aria-name="status"]');

					$status.html('');

					if (isDraft) {
						if ($status.children('[aria-name="draft"]').length == 0) {
							$status.append('<article class="node status-animation node-default"><div class="text"><span>' + _t.real_estate.attribute.draft_status + '</span></div><div class="fa fa-file-text-o"></div></article>')
						}
					}
					else {
						// if (isAppraised) {
						//   statusHtml += '<span class="label label-success">' + _t.real_estate.attribute.appraised_status + '</span><br />';
						// }
						// else if (isNotAppraised) {
						//   statusHtml += '<span class="label label-warning">' + _t.real_estate.attribute.not_appraised_status + '</span><br />';
						// }

						if (isPending) {
							$status.append('<article class="node status-animation node-danger"><div class="text"><span>' + _t.real_estate.attribute.pending_status + '</span></div><div class="fa fa-legal"></div></article>')
						}
						else {
							$status.append('<article class="node status-animation node-success"><div class="text"><span>' + _t.real_estate.attribute.success_status + '</span></div><div class="fa fa-check"></div></article>')
						}

						if (isShow) {
							$status.append('<article class="node status-animation node-primary"><div class="text"><span>' + _t.real_estate.attribute.show_status + '</span></div><div class="fa fa-eye"></div></article>')
						}
						else {
							$status.append('<article class="node status-animation node-warning"><div class="text"><span>' + _t.real_estate.attribute.hide_status + '</span></div><div class="fa fa-eye-slash"></div></article>')
						}
					}

					// Constrol buttons
					if (isShow) {
						$item.find('[aria-click="change-show-status"]').attr('title', _t.real_estate.view.my.hide).removeClass('fa-eye').addClass('fa-eye-slash');
					}
					else {
						$item.find('[aria-click="change-show-status"]').attr('title', _t.real_estate.view.my.show).removeClass('fa-eye-slash').addClass('fa-eye');
					}

					if (isDraft) {
						$item.find('[aria-click="edit"]').attr('title', _t.real_estate.view.my['continue']);
					}
					else {
						$item.find('[aria-click="edit"]').attr('title', _t.real_estate.view.my.edit);
					}

					_initStatusAnimation($item);

					if (justSetStatus) {
						return;
					}

				// / Status

				// Change show status buttons

					$item.find('[aria-click="change-show-status"]').on('click', function () {
						var $button = $(this),
							status 	= $item.data('status'),
							isShow 	= listString.has('show', status);

						$button.startLoadingStatus();
						$.ajax({
							url: '/real_estates/change_show_status/' + $item.data('value') + '/' + (isShow ? 0 : 1),
							method: 'POST',
							contentType: 'JSON'
						}).always(function () {
							$button.endLoadingStatus();
						}).done(function (data) {
							if (data.status == 0) {
								if (isShow) {
									$item.data('status', listString.remove('show', status));
								}
								else {
									$item.data('status', listString.add('show', status));
								}
								initItems($item, true);
							}
							else {
								_errorPopup();
							}
						}).fail(function () {
							_errorPopup();
						});
					});

				// / Change show status buttons

				// Owner
				
					$item.find('[aria-click="own_info"]').on('click', function () {
						var $button 	= 	$(this),
							$html 		= 	$(_popupContent['re_owner']),
							$popup 		= 	popupFull({
												html: $html,
												width: 'small'
											}),
							$form 		= 	$popup.find('form'),
							form 		= 	$form[0],
							owner_info 	= 	$item.data('owner');

						form['owner_info[id]'].value 		= $item.data('value');
						form['owner_info[type]'].value 		= owner_info['type'] || '';
						form['owner_info[name]'].value 		= owner_info['name'] || '';
						form['owner_info[phone]'].value 	= owner_info['phone'] || '';
						form['owner_info[email]'].value 	= owner_info['email'] || '';
						form['owner_info[address]'].value 	= owner_info['address'] || '';

						initForm($form, {
							submit: function () {
								$popup.off();
								if (form['owner_info[type]'].value == '') {
									return;
								}
								
								$button.startLoadingStatus();
								$.ajax({
									url: '/real_estates/set_owner_info',
									data: $form.serialize(),
									method: 'POST',
									dataType: 'JSON'
								}).done(function (data) {
									if (data.status == 0) {
										$item.data('owner', {
											type: form['owner_info[type]'].value,
											name: form['owner_info[name]'].value,
											phone: form['owner_info[phone]'].value,
											email: form['owner_info[email]'].value,
											address: form['owner_info[address]'].value
										});
									}
									else {
										_errorPopup();
									}
								}).fail(function () {
									_errorPopup();
								}).always(function () {
									$button.endLoadingStatus();
								});
							}
						});
					});
				
				// / Owner

				// Delete buttons

					$item.find('[aria-click="delete"]').on('click', function () {
						var $button = $(this);
						popupPrompt({
							title: _t.form.confirm_title,
							content: _t.real_estate.view.my.delete_confirm,
							type: 'warning',
							buttons: [
								{
									text: _t.form.yes,
									type: 'warning',
									primaryButton: true,
									handle: function () {
										$button.startLoadingStatus();
										$.ajax({
											url: '/real_estates/delete/' + $item.data('value'),
											method: 'POST'
										}).done(function (data) {
											if (data.status == 0) {
												// Remove item immediate
												$item.parent().remove();

												// Reload page
												var findData = pagination.lastData;
												if ($list.children().length == 0) {
													if (findData.page != 1) {
														findData.page--;
													}
												}
												pagination.find({
													data: 		findData,
													scrollTo: 	false
												});
											}
											else {
												_errorPopup();
											}
										}).fail(function () {
											_errorPopup();
										}).always(function () {
											$button.endLoadingStatus();
										});
									}
								},
								{
									text: _t.form.no
								}
							]
						})
					});

				// / Delete buttons
			}
		}

	// / Item

	// Pagination

		// Init pagination
		pagination = _initPagination2({
			url: 			window.location.pathname,
			list: 			$list,
			paginator:  	$('#paginator'),
			replaceState: 	true,
			alert: 			$('#alert'),
			done: 			function () {
								initItems();
							}
		});

		// Set last data
		pagination.lastData = {
			search: {
						keyword: $searchForm[0].elements['keyword'].value
					},
			order: 	order
		}

		// Init search form
		initForm($searchForm, {
			submit: function () {
				pagination.find({
					data: 			{
										search: {
											keyword: $searchForm[0].elements['keyword'].value
										},
										order: order
									},
					scrollTo: 		false,
					startRequest: 	function () {
										$searchForm.find('[type="submit"]').startLoadingStatus();
									},
					endRequest: 	function () {
										$searchForm.find('[type="submit"]').endLoadingStatus();
									}
				});
			}
		});

		// Default data
		$searchForm.find('[data-action="reset"]').on('click', function () {
			var $button = $(this);

			// Reset keyword
			$searchForm[0].elements['keyword'].value = '';
			// Reset order
			if (Object.keys(order).length) {
				var key = Object.keys(order)[0];
				$searchForm.find('[aria-click="order"][data-name="' + key + '"] [aria-name="sort"]').removeClass('fa-sort-' + order[key]).addClass('fa-sort');
			}
			order = {};
			// Reset last data
			pagination.lastData = {};

			// Find again
			pagination.find({
				data: 			{
									search: {},
									order: 	{},
									page: 	1
								},
				scrollTo: 		false,
				startRequest: 	function () {
									$button.startLoadingStatus();
								},
				endRequest: 	function () {
									$button.endLoadingStatus();
								}
			});
		});

		// Order

			if (Object.keys(order).length) {
				var key = Object.keys(order)[0];
				$searchForm.find('[aria-click="order"][data-name="' + key + '"] [aria-name="sort"]').removeClass('fa-sort').addClass('fa-sort-' + order[key]);
			}

			var $orderButtons = $searchForm.find('[aria-click="order"]');
			$orderButtons.on('click', function () {
				var $button = $(this);

				// Reset order
				order = {};

				// If now
				if ($button.is('[data-now]')) {
					// Toggle
					if ($button.data('sort') == 'asc') {
						$button.data('sort', 'desc').find('[aria-name="sort"]').removeClass('fa-sort-asc').addClass('fa-sort-desc');
						order[$button.data('name')] = 'desc';
					}
					else {
						$button.data('sort', 'asc').find('[aria-name="sort"]').removeClass('fa-sort-desc').addClass('fa-sort-asc');
						order[$button.data('name')] = 'asc';
					}
				}
				// Not now
				else {
					$orderButtons.removeAttr('data-now').find('[aria-name="sort"]').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
					$button.attr('data-now', '').data('sort', $button.data('sort')).find('[aria-name="sort"]').removeClass('fa-sort').addClass('fa-sort-' + $button.data('sort'));
					order[$button.data('name')] = $button.data('sort');
				}

				var data = pagination.lastData;
				data.order = order;
				pagination.find({
					data: 			data,
					scrollTo: 		false,
					startRequest: 	function () {
										$button.startLoadingStatus();
									},
					endRequest: 	function () {
										$button.endLoadingStatus();
									}
				});
			});

		// / Order

	// / Pagination

	initItems();
});