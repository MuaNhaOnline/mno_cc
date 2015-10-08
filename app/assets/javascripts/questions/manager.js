$(function () {
	var $list = $('#question_list'), find;

	initItem();
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
			_initGlobalEvent($item);

			/*
				Form
			*/

				var $form = $item.find('[aria-name="answer_form"]');

				initForm($form, {
					submit: function () {
						toggleLoadStatus(true);
						$.ajax({
							url: '/questions/answer',
							method: 'POST',
							data: $form.serialize(),
							dataType: 'JSON'
						}).always(function () {
							toggleLoadStatus(false);
						}).done(function (data) {
							if (data.status == 0) {
								var answer = $form[0].elements['answer'].value;

								if (answer) {
									$form.addClass('hidden');
									$item.find('[aria-name="answer_content"]').removeClass('hidden').find('.answer-content').text(answer);

									$item.closest('.box').removeClass('box-default').addClass('box-success');
								}
								else {
									$item.closest('.box').removeClass('box-success').addClass('box-default');
								}
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
							})
						});
					}
				});

			/*
				/ Form
			*/
			
			/*
				Edit
			*/

				$item.find('[aria-click="edit"]').on('click', function () {
					$form.removeClass('hidden');
					$item.find('[aria-name="answer_content"]').addClass('hidden');
				});

			/*
				/ Edit
			*/

			/*
				Delete
			*/

				$item.find('[aria-click="delete"]').on('click', function () {
					popupPrompt({
						title: _t.form.confirm_title,
						content: _t.form.delete_confirm,
						type: 'warning',
						buttons: [
							{
								text: _t.form.yes,
								type: 'warning',
								handle: function () {
									toggleLoadStatus(true);
									$.ajax({
										url: '/questions/' + $item.data('value'),
										method: 'DELETE',
										dataType: 'JSON'
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

			/*
				/ Delete
			*/

			/*
				Pin
			*/

				$item.find('[aria-click="pin"]').on('click', function () {
					var isPinned = $item.data('is_pinned');
					toggleLoadStatus(true);
					$.ajax({
						url: '/questions/pin/' + $item.data('value') + '/' + (isPinned ? 0 : 1),
						method: 'PUT',
						dataType: 'JSON'
					}).always(function () {
						toggleLoadStatus(false);
					}).done(function (data) {
						if (data.status == 0) {
							$item.data('is_pinned', !isPinned);
							setPinnedStatus();
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

				function setPinnedStatus() {
					if ($item.data('is_pinned')) {
						$item.find('[aria-name="pin_icon"]').show();
						$item.find('[aria-name="pin_text"]').text('Bỏ ghim');
						console.log($item.find('[aria-name="pin_text"]').text());
					}
					else {
						$item.find('[aria-name="pin_icon"]').hide();
						$item.find('[aria-name="pin_text"]').text('Ghim');
						console.log($item.find('[aria-name="pin_text"]').text());
					}
				}

				setPinnedStatus();

			/*
				Pin
			*/
		}
	}

	/*
		/ Item
	*/

	/*
		Pagination
	*/

	function initPagination() {
		find = _initPagination({
			url: '/questions/_manager_list',
			list: $list,
			pagination: $('#pagination'),
			done: function (content) {
				$list.html(content);
				initItem();
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