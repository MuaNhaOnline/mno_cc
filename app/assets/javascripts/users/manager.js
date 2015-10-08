$(function () {

	var 
		$systemMangerBox = $('#system_manager'),
		$userManagerBox = $('#user_manager'),
		$realEstateManagerBox = $('#real_estate_manager'),
		$projectManagerBox = $('#project_manager'),
		$appraiserBox = $('#appraiser'),
		$statisticianBox = $('#statistician');

	$systemMangerBox.hide();
	$statisticianBox.hide();
	
	// initBox($systemMangerBox, 'system_manager');
	initBox($userManagerBox, 'user_manager');
	initBox($realEstateManagerBox, 'real_estate_manager');
	initBox($projectManagerBox, 'project_manager');
	initBox($appraiserBox, 'appraiser');
	// initBox($statisticianBox, 'statistician');

	/*
		Box
	*/

	function initBox($box, type) {
		var 
			$modeToggle = $box.find('[aria-object="mode-toggle"]'),
			$list = $box.find('[aria-object="list"]'),
			$search = $box.find('[aria-object="search"]'),
			$pagination = $box.find('[aria-object="pagination"]');

		$box.data('is_add', false);
		$modeToggle.text('Chế độ thêm');

		if ($list.is(':empty')) {
			$list.html('<section class="callout callout-info no-margin">' + _t.user.view.manager.callout_empty_show_list + '</section>');
		}

		initModeToggle();
		initSearch();
		initList();

		/*
			Change mode
		*/

		function initModeToggle() {
			$modeToggle.on('click', function () {
				toggleMode();
			});
		}

		function toggleMode(is_add) {
			if ($box.data('is_add')) {
				$modeToggle.text('Chế độ thêm');
				$box.data('is_add', false);

				$search.search({
					keyword: '',
					note: 'change'
				});
			}
			else {
				$modeToggle.text('Chế độ xem');
				$box.data('is_add', true);

				$list.html('<section class="callout callout-info no-margin">' + _t.user.view.manager.callout_search_to_add + '</section>');
			}
		}

		/*
			/ Change mode
		*/

		/*
			Search
		*/

		function initSearch() {
			_initSearchablePagination($list, $search, $pagination, {
				url: '/users/_manager_list',
				data: function() {
					return {
						is_add: $box.data('is_add'),
						type: type
					}
				},
				afterLoad: function (data) {
					$list.html(data);
					initList();
				},
				ifEmpty: function (note) {
					if (note) {
						switch (note) {
							case 'change':
								if ($box.data('is_add')) {
									$list.html('<section class="callout callout-info no-margin">' + _t.user.view.manager.callout_search_to_add + '</section>');
								}
								else {
									$list.html('<section class="callout callout-info no-margin">' + _t.user.view.manager.callout_empty_show_list + '</section>');
								}								
								break;
							default:
								return false;
						}
					}
					else {
						return false;
					}
				}
			});
		}

		/*
			/ Search
		*/

		/*
			List
		*/

		function initList() {
			if ($box.data('is_add')) {
				$list.find('[aria-click="add"]').on('click', function () {
					var $item = $(this).closest('[aria-object="item"]');

					toggleLoadStatus(true);
					$.ajax({
						url: '/users/change_type',
						method: 'POST',
						data: {
							id: $item.data('value'),
							type: type,
							is: true
						},
						dataType: 'JSON'
					}).always(function () { 
						toggleLoadStatus(false);
					}).done(function (data) {
						if (data.status === 0) {
							$item.remove();
							$search.search({
								note: 'change'
							});
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
			}
			else {
				$list.find('[aria-click="remove"]').on('click', function () {
					var $item = $(this).closest('[aria-object="item"]');

					toggleLoadStatus(true);
					$.ajax({
						url: '/users/change_type',
						method: 'POST',
						data: {
							id: $item.data('value'),
							type: type,
							is: false
						},
						dataType: 'JSON'
					}).always(function () {
						toggleLoadStatus(false);
					}).done(function (data) {
						if (data.status === 0) {
							$item.remove();
							$search.search({
								note: 'change'
							});
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
			}
		}

		/*
			/ List
		*/
	}

	/*
		/ Box
	*/
});