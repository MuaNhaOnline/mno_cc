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
						isForceHide = listString.has('force_hide', status),
						isFull = listString.has('full', status),
						isFavorite = listString.has('favorite', status),
						// isAppraised = listString.has('appraised', status),
						// isNotAppraised = listString.has('not_appraised', status);
						$status = $item.find('[aria-name="status"]');

					$status.html('');

					if (isForceHide) {
						$status.append('<article class="node status-animation node-warning"><div class="text"><span>' + _t.real_estate.attribute.hide_status + '</span></div><div class="fa fa-eye-slash"></div></article>')
					}
					else {
						$status.append('<article class="node status-animation node-primary"><div class="text"><span>' + _t.real_estate.attribute.show_status + '</span></div><div class="fa fa-eye"></div></article>')
					}

					if (isFavorite) {
						$status.append('<article class="node status-animation node-danger"><div class="text"><span>' + _t.real_estate.attribute.favorite_status + '</span></div><div style="top: 1px" class="fa fa-heart"></div></article>')
					}

					// Constrol buttons

					if (isForceHide) {
						$item.find('[aria-click="change-force-hide-status"]').attr('title', _t.real_estate.view.manager.show).removeClass('fa-eye-slash').addClass('fa-eye');
					}
					else {
						$item.find('[aria-click="change-force-hide-status"]').attr('title', _t.real_estate.view.manager.hide).removeClass('fa-eye').addClass('fa-eye-slash');
					}

					if (isFavorite) {
						$item.find('[aria-click="change-favorite-status"]').attr('title', _t.real_estate.view.manager.unfavorite).removeClass('fa-heart').addClass('fa-heart-o');
					}
					else {
						$item.find('[aria-click="change-favorite-status"]').attr('title', _t.real_estate.view.manager.favorite).removeClass('fa-heart-o').addClass('fa-heart');
					}

					_initStatusAnimation($item);

					if (justSetStatus) {
						return;
					}

				// / Status

				// Change force hide status buttons

					$item.find('[aria-click="change-force-hide-status"]').on('click', function () {
						var $button 	= 	$(this);
							status 		= 	$item.data('status');
							isForceHide = 	listString.has('force_hide', status);

						$button.startLoadingStatus();
						$.ajax({
							url: '/real_estates/change_force_hide_status/' + $item.data('value') + '/' + (isForceHide ? 0 : 1),
							method: 'POST'
						}).done(function (data) {
							if (data.status == 0) {
								if (isForceHide) {
									$item.data('status', listString.remove('force_hide', status));
								}
								else {
									$item.data('status', listString.add('force_hide', status));
								}
								initItems($item, true);
							}
							else {
								_errorPopup();
							}
						}).fail(function () {
							_errorPopup();
						}).always(function () {
							$button.endLoadingStatus();
						});
					});

				// / Change force hide status buttons
			
				// Change favorite status buttons

					$item.find('[aria-click="change-favorite-status"]').on('click', function () {
						var $button 	= 	$(this);
							status 		= 	$item.data('status');
							isFavorite 	= 	listString.has('favorite', status);

						$button.startLoadingStatus();
						$.ajax({
							url: '/real_estates/change_favorite_status/' + $item.data('value') + '/' + (isFavorite ? 0 : 1),
							method: 'POST'
						}).done(function (data) {
							if (data.status == 0) {
								if (isFavorite) {
									$item.data('status', listString.remove('favorite', status));
								}
								else {
									$item.data('status', listString.add('favorite', status));
								}
								initItems($item, true);
							}
							else {
								_errorPopup();
							}
						}).fail(function () {
							_errorPopup();
						}).always(function () {
							$button.endLoadingStatus();
						});
					});

				// / Change favorite status buttons
		
				// Delete buttons

					$item.find('[aria-click="delete"]').on('click', function () {
						var $button = $(this);
						popupPrompt({
							title: _t.form.confirm_title,
							content: _t.real_estate.view.manager.delete_confirm,
							type: 'warning',
							primaryButton: true,
							buttons: [
								{
									text: _t.form.yes,
									type: 'warning',
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
													if (findData.page !== 1) {
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