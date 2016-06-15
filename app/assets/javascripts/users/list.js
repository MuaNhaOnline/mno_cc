var page, per, order = {};

$(function () {
	var 
		$list 		= 	$('#user_list'), 
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
				initReadTime($list);
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