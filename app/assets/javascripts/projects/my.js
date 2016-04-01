$(function () {
	var $list = $('#project_list'), find;

	initItem();
	initPagination();

	// Item

	function initItem($item) {
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
				$status = $item.find('[aria-name="status"]');

			$status.html('');

			if (isDraft) {
				if ($status.children('[aria-name="draft"]').length == 0) {
					$status.append('<article class="node status-animation node-default"><div class="text"><span>Chưa hoàn thành</span></div><div class="fa fa-file-text-o"></div></article>')
				}
			}
			else {
				if (isPending) {
					$status.append('<article class="node status-animation node-danger"><div class="text"><span>' + _t.project.attribute.pending_status + '</span></div><div class="fa fa-legal"></div></article>')
				}
				else {
					$status.append('<article class="node status-animation node-success"><div class="text"><span>' + _t.project.attribute.success_status + '</span></div><div class="fa fa-check"></div></article>')
				}

				if (isShow) {
					$status.append('<article class="node status-animation node-primary"><div class="text"><span>' + _t.project.attribute.show_status + '</span></div><div class="fa fa-eye"></div></article>')
				}
				else {
					$status.append('<article class="node status-animation node-warning"><div class="text"><span>' + _t.project.attribute.hide_status + '</span></div><div class="fa fa-eye-slash"></div></article>')
				}
			}

			// Constrol buttons

			if (isShow) {
				$item.find('[aria-click="change-show-status"]').attr('title', _t.project.view.my.hide).removeClass('fa-eye').addClass('fa-eye-slash');
			}
			else {
				$item.find('[aria-click="change-show-status"]').attr('title', _t.project.view.my.show).removeClass('fa-eye-slash').addClass('fa-eye');
			}

			if (isDraft) {
				$item.find('[aria-click="edit"]').attr('title', _t.project.view.my['continue']);
			}
			else {
				$item.find('[aria-click="edit"]').attr('title', _t.project.view.my.edit);
			}

			_initStatusAnimation($item);

			// / Status

			// Change show status buttons

				$item.find('[aria-click="change-show-status"]').on('click', function () {
					var status = $item.data('status');
					var isShow = listString.has('show', status);

					toggleLoadStatus(true);
					$.ajax({
						url: '/projects/change_show_status/' + $item.data('value') + '/' + (isShow ? 0 : 1),
						method: 'POST',
						data: {
							is_show: (isShow ? 0 : 1)
						},
						contentType: 'JSON'
					}).always(function () {
						toggleLoadStatus(false);
					}).done(function (data) {
						if (data.status == 0) {
							if (isShow) {
								$item.data('status', listString.remove('show', status));
							}
							else {
								$item.data('status', listString.add('show', status));
							}
							initItem($item);
						}
						else {
							popupPrompt({
								title: _t.form.error_title,
								content: _t.form.error_content,
								type: 'danger'
							});
						}
					}).fail(function () {
						popupPrompt({
							title: _t.form.error_title,
							content: _t.form.error_content,
							type: 'danger'
						});
					});
				});

			// / Change show status buttons

			// Delete buttons

				$item.find('[aria-click="delete"]').on('click', function () {
					popupPrompt({
						title: _t.form.confirm_title,
						content: _t.project.view.my.delete_confirm,
						type: 'warning',
						primaryButton: true,
						buttons: [
							{
								text: _t.form.yes,
								type: 'warning',
								handle: function () {
									toggleLoadStatus(true);
									$.ajax({
										url: '/projects/delete/' + $item.data('value'),
										method: 'POST',
										contentType: 'JSON'
									}).always(function () {
										toggleLoadStatus(false);
									}).done(function (data) {
										if (data.status == 0) {
											$item.remove();
											find();
										}
										else {
											popupPrompt({
												title: _t.form.error_title,
												content: _t.form.error_content,
												type: 'danger'
											});
										}
									}).fail(function () {
										popupPrompt({
											title: _t.form.error_title,
											content: _t.form.error_content,
											type: 'danger'
										});
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

			// Continue buttons
			
				$item.find('[aria-click="continue"]').on('click', function (e) {
					var items = [], step = $(this).data('step');

					if (step > 0) {
						items.push({
							text: 'Thông tin cơ bản',
							handle: function () {
								window.location = '/du-an/chinh-sua/' + $item.data('value')
							}
						});

						if (step > 1) {
							items.push({
								text: 'Thông tin chi tiết',
								handle: function () {
									window.location = '/du-an/dang-chi-tiet/' + $item.data('value')
								}
							});

							if (step > 2) {
								items.push({
									text: 'Thiết lập hình ảnh',
									handle: function () {
										window.location = '/du-an/thiet-lap-hinh-anh/' + $item.data('value')
									}
								});

								items.push({
									text: 'Hoàn tất',
									handle: function () {
										popupPrompt({
											title: 'Xác nhận',
											content: 'Khi hoàn thành, bạn không thể chỉnh sửa thông tin về cấu trúc dự án. Bạn có chắc muốn hoàn thành?',
											type: 'danger',
											buttons: [
												{
													text: _t.form.yes,
													type: 'danger',
													handle: function () {
														$.ajax({
															url: '/projects/setup_interact_images_finish/' + $item.data('value'),
															dataType: 'JSON'
														}).done(function (data) {
															if (data.status == 0) {
																if (data.result.length > 0) {
																	popupPrompt({
																		type: 'warning',
																		title: 'Chưa hoàn tất',
																		content: 'Thiết lập chưa hoàn tất, vui lòng kiểm tra lại thiết lập hình ảnh',
																		buttons: [
																			{
																				text: 'Thiết lập hình ảnh',
																				type: 'primary',
																				handle: function () {
																					window.location = '/du-an/thiet-lap-hinh-anh/' + $item.data('value');
																				}
																			},
																			{
																				text: 'Để sau'
																			}
																		]
																	})
																}
																else {
																	window.location = '/du-an/cua-toi';
																}
															}
															else {
																errorPopup();
															}
														}).fail(function () {
															errorPopup();
														});
													}
												},
												{
													text: _t.form.no
												}
											]
										})
									}
								});
							}
						}
					}

					_contextMenu({
						position: {
							x: e.pageX,
							y: e.pageY
						},
						items: items
					});
				});
			
			// / Continue buttons
		}
	}

	// / Item

	// Pagination

	function initPagination() {
		var order = { interact: 'desc' };

		find = _initPagination({
			url: '/projects/_my_list',
			list: $list,
			pagination: $('#pagination'),
			data: function () {
				return order;
			},
			done: function (content) {
				$list.html(content);
				initItem();
			}
		});

		var $searchForm = $('#search_form');
		initForm($searchForm, {
			submit: function () {
				find({
					data: {
						keyword: $searchForm[0].elements['keyword'].value
					}
				});
			}
		});

		// Order

		var $orderButtons = $searchForm.find('[aria-click="order"]');
		$orderButtons.on('click', function () {
			var $button = $(this);
			// If now
			if ($button.is('[data-now]')) {
				// Toggle
				if ($button.data('sort') == 'asc') {
					$button.data('sort', 'desc').find('[aria-name="sort"]').removeClass('fa-sort-asc').addClass('fa-sort-desc');
					order = {};
					order[$button.data('name')] = 'desc';
				}
				else {
					$button.data('sort', 'asc').find('[aria-name="sort"]').removeClass('fa-sort-desc').addClass('fa-sort-asc');
					order = {};
					order[$button.data('name')] = 'asc';
				}
			}
			// Not now
			else {
				$orderButtons.removeAttr('data-now').find('[aria-name="sort"]').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
				$button.attr('data-now', '').data('sort', $button.data('sort')).find('[aria-name="sort"]').removeClass('fa-sort').addClass('fa-sort-' + $button.data('sort'));
				order = {};
				order[$button.data('name')] = $button.data('sort');
			}
			find();
		});

		// / Order
	}

	// / Pagination
});