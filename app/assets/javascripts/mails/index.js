var searchData;

$(function () {

	var $list = $('#mails_list');

	// Get, init

		/*
			params:
				always
				fail
		*/
		function get(params) {
			params = params || {};

			$.ajax({
				url: '/mails/index',
				data: searchData,
				cache: false
			}).always(function () {
				if ('always' in params) {
					params.always();
				}
			}).done(function (data) {
				if (data.status == 0) {
					// Fill list
					$list.html(data.result.list);

					initList();

					// Check paging
					$('[data-action="prev_page"]').prop('disabled', data.result.page == 1);
					$('[data-action="next_page"]').prop('disabled', data.result.page == data.result.max_page);

					// Replace state
					_replaceState(this.url);
				}
				else if (data.status == 1) {
					$list.html('<tr><td class="text-center"><b>Không tìm thấy thư</b></td></tr>');
				}
				else {
					_errorPopup();
					if ('fail' in params) {
						params.fail();
					}
				}
			}).fail(function () {
				_errorPopup();
				if ('fail' in params) {
					params.fail();
				}
			});
		}

		function initList() {
			initReadTime($list);

			$list.find('[type="checkbox"]').parent().on('click', function (e) {
				e.stopPropagation();
			});
			$list.find('tr').on('click', function () {
				var $row 	= 	$(this);
				var id 		= 	$row.data('value');

				$row.removeClass('unread').addClass('read');

				popupFull({
					url: 		'/mails/view/' + id,
					width: 		'medium',
					success: 	function ($popup) {
									// Delete
									$popup.find('[data-action="delete"]').on('click', function () {
										$popup.off();
										deleteMail($row);
									});

									// Reply
									$popup.find('[data-action="reply"]').on('click', function () {
										popupFull({
											url: 		'/mails/_form/',
											urlData: 	{
															reply_id: id
														},
											width: 		'medium',
											success: 	function ($popup) {
															var $form = $popup.find('form');

															initForm($form, {
																submit: function () {
																	$form.find('[type="submit"]').startLoadingStatus();
																	$.ajax({
																		url: 	'/mails/save',
																		data: 	$form.serialize()
																	}).always(function () {
																		$form.find('[type="submit"]').endLoadingStatus();
																	}).done(function (data) {
																		if (data.status == 0) {
																			$popup.off();
																			if (searchData['by_type'] == 'sent' && searchData['page'] == 1) {
																				get();
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
														}
										});
									});
								}
				});
			});
		}
		initList();

	// / Get, init

	// Page
	
		// Prev page
		$('[data-action="prev_page"]').on('click', function () {
			var $button = $(this);

			// Set status
			$button.startLoadingStatus();

			// Set data
			searchData['page']--;

			get({
				always: 	function () {
								$button.endLoadingStatus();
							},
				fail: 		function () {
								searchData['page']++;
							}
			});
		});
	
		// Next page
		$('[data-action="next_page"]').on('click', function () {
			var $button = $(this);

			// Set status
			$button.startLoadingStatus();

			// Set data
			searchData['page']++;

			// Get data
			get({
				always: 	function () {
								$button.endLoadingStatus();
							},
				fail: 		function () {
								searchData['page']--;
							}
			});
		});
	
	// / Page

	// Type
	
		$('[data-action="change_type"]').on('click', function () {
			var $button 	= 	$(this),
				$parent 	= 	$button.parent(),
				$current 	= 	$parent.siblings('.active')

			// Check if is active
			if ($parent.hasClass('active')) {
				return;
			}

			// Set status
			$('#list_title').text($button.text());
			$parent.addClass('active');
			$current.removeClass('active');
			$button.find('i').startLoadingStatus();

			// Set data
			searchData['page'] 	= 	1;
			searchData['by_type'] = 	$button.data('value');

			// Get data
			get({
				always: 	function () {
								$button.find('i').endLoadingStatus();
							},
				fail: 		function () {
								$('#list_title').text($current.find('>*').text());
								$parent.removeClass('active');
								$current.addClass('active');
							}
			});
		});
		$('#list_title').text($('.active > [data-action="change_type"]').text());
	
	// / Type

	// Check all
	
		$('[data-action="checked_toggle"]').on('click', function () {

			if ($(this).find('i').hasClass('fa-square-o')) {
				$('[data-action="checked_toggle"] i').addClass('fa-check-square-o').removeClass('fa-square-o');
				$list.find('[type="checkbox"]').prop('checked', true);
			}
			else {
				$('[data-action="checked_toggle"] i').addClass('fa-square-o').removeClass('fa-check-square-o');
				$list.find('[type="checkbox"]').prop('checked', false);
			}

		});
	
	// / Check all

	// Create
	
		$('[data-action="create"]').on('click', function () {
			popupFull({
				url: 		'/mails/_form',
				width: 		'medium',
				success: 	function ($popup) {
								var $form = $popup.find('form');

								initForm($form, {
									submit: function () {
										$form.find('[type="submit"]').startLoadingStatus();
										$.ajax({
											url: 	'/mails/save',
											data: 	$form.serialize()
										}).always(function () {
											$form.find('[type="submit"]').endLoadingStatus();
										}).done(function (data) {
											if (data.status == 0) {
												$popup.off();
												if (searchData['by_type'] == 'sent' && searchData['page'] == 1) {
													get();
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
							}
			});
		});
	
	// / Create

	// Delete
	
		$('[data-action="delete"]').on('click', function () {
			var $button = $(this);

			// Get selected
			var $selected = $list.find('[type="checkbox"]:checked').closest('tr');

			// Check exists
			if ($selected.length == 0) {
				return;
			}

			// Delete
			deleteMail($selected);
		});

		function deleteMail($items, $button) {
			$button = $button || $();
			
			popupPrompt({
				title: 			'Xác nhận',
				content: 		'Bạn có chắc muốn xóa' + ($items.length == 1 ? '' : $items.length + ' ') + ' thư này?',
				type: 			'warning',
				buttons: 		[
									{
										text: 'Có',
										type: 'warning',
										primaryButton: true,
										handle: function () {
											$button.startLoadingStatus();
											$items.hide();
											$.ajax({
												url: 	'/mails/delete/',
												data: 	{
															ids: 	$items.map(function () {
																		return $(this).data('value');
																	}).get()
														},
												method: 'POST'
											}).done(function (data) {
												if (data.status == 0) {
													get();
												}
												else {
													$items.show();
													_errorPopup();
												}
											}).fail(function () {
												$items.show();
												_errorPopup();
											}).always(function () {
												$button.endLoadingStatus();
											});
										}
									},
									{
										text: 'Không'
									}
								]
			})
		}
	
	// / Delete

});