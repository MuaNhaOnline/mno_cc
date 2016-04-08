$(function () {
	var 
		$list = $('#investor_list');

	initItem();
	initDelete();
	initPagination();

	/*
		Item
	*/

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

			$item.find('[aria-object="name"]').dotdotdot({
				height: 50,
				watch: true
			});

		}

	}

	/*
		/ Item
	*/

	/*
		Delete buttons
	*/

		function initDelete() {
			$list.find('[aria-click="delete"]').on('click', function () {
				var $item = $(this).closest('.item');

				popupPrompt({
					title: _t.form.confirm_title,
					content: _t.investor.view.manager.delete_confirm,
					type: 'warning',
					buttons: [
						{
							text: _t.form.yes,
							type: 'warning',
							handle: function () {
								toggleLoadStatus(true);
								$.ajax({
									url: '/investors/delete/' + $item.data('value'),
									method: 'POST',
									contentType: 'JSON'
								}).always(function () {
									toggleLoadStatus(false);
								}).done(function (data) {
									if (data.status == 0) {
										$item.parent().remove();
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
		}

	/*
		/ Delete buttons
	*/

	/*
		Pagination
	*/

	function initPagination() {
		find = _initPagination({
			url: '/investors/_manage_list',
			list: $list,
			pagination: $('#pagination'),
			done: function (content) {
				$list.html(content);
				initItem();
				initDelete();
			}
		});

		var searchForm = document.getElementById('search_form');
		initForm($(searchForm), {
			submit: function () {
				find({
					data: {
						keyword: searchForm.elements['keyword'].value
					}
				});
			}
		});
	}

	/*
		/ Pagination
	*/
});