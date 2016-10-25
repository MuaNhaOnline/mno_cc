$(function () {

	// Init items list
	
		function initItemList() {
			_initMediumItemsList($('#res_list'));
		}
		initItemList();
	
	// / Init items list

	// Fixed search box

		$(window).on('resize', function () {
			$('.res-search .search-box-container').css('width', $('.res-search .search-box-container').parent().width() + 'px');
		});
		$('.res-search .search-box-container').css('width', $('.res-search .search-box-container').parent().width() + 'px');

		_initFixedScroll(
			$('.res-search .search-box-container'), 
			$('.res-search #res_list'),
			{
				addMax: -10
			}
		);
	
	// / Fixed search box

	// Pagination
	
		_initPagination3({
			url:			'',
			list:			$('#res_list'),
			paginator:		$('#res_paginator'),
			replaceState: 	true,
			done:			function () {
								initItemList();
							}
		});
	
	// / Pagination

	// Create registration
	
		$('[data-action="create_reg"]').on('click', function (e) {
			e.preventDefault();

			popupFull({
				url: 		this.href,
				width: 		'medium',
				success:	function ($popup) {
								var $form = $popup.find('#register_form');

								initForm($form, {
									submit: function () {
										$.ajax({
											url: $form.attr('action'),
											method: 'POST',
											data: $form.serialize()
										}).done(function (data) {
											if (data.status == 0) {
												window.location = data.result.redirect;
											}
											else {
												errorPopup()
											}
										}).fail(function () {
											errorPopup();
										})
									}
								});

								var
									options = {
										inputBinding: {
											locationNameInput: $form.find('#location_input'),
											streetInput: $form.find('#street_input'),
											districtInput: $form.find('#district_input'),
											provinceInput: $form.find('#province_input'),
											typeInput: $form.find('#type_input')
										},
										enableAutocomplete: true
									};

								$form.find('#map').locationpicker(
									options,
									{
										'isNew': 	true,
										required: 	false
									}
								);

								$('#locations_list .item .remove').on('click', function () {
									$(this).closest('.item').remove();
								});

								$form.find('#location_input').on({
									keydown: function (e) {
										if (e.keyCode == 13) {
											e.preventDefault();
										}
									},
									change: function (e, valid) {
										if (valid) {
											var
												type 	= 	$form.find('#type_input').val(),
												text 	= 	$form.find('#location_input').val(),
												name 	=	'',
												inputs;

											if (!type || !text) {
												return;
											}

											switch(type) {
												case 'province':
													inputs =
														'<input type="hidden" value="' + 	$form.find('#province_input').val() 	+ '" name="' + 	$form.find('#province_input').data('name') 	+ '" />';
													break;
												case 'district':
													inputs =
														'<input type="hidden" value="' + 	$form.find('#province_input').val() 	+ '" name="' + 	$form.find('#province_input').data('name') 	+ '" />' +
														'<input type="hidden" value="' + 	$form.find('#district_input').val() 	+ '" name="' + 	$form.find('#district_input').data('name') 	+ '" />';
													break;
												case 'street':
													inputs =
														'<input type="hidden" value="' + 	$form.find('#province_input').val() 	+ '" name="' + 	$form.find('#province_input').data('name') 	+ '" />' +
														'<input type="hidden" value="' + 	$form.find('#district_input').val() 	+ '" name="' + 	$form.find('#district_input').data('name') 	+ '" />' +
														'<input type="hidden" value="' + 	$form.find('#street_input').val() 		+ '" name="' + 	$form.find('#street_input').data('name') 	+ '" />';
													break;
											}

											var $exists = $('#locations_list .item[data-text="' + text + '"]');
											if ($exists.length != 0) {
												$exists.hide().fadeIn();
											}
											else {
												var $inputItem = $(
													'<article class="item" data-text="' + text + '">' +
														inputs +
														'<input type="hidden" value="' + $form.find('#type_input').val() + '" name="' + $form.find('#type_input').data('name') 	+ '" />' +
														'<span class="text">' + text + '</span>' +
														'<a class="remove">&times;</a>' +
													'</article>'
												);
												$inputItem.find('.remove').on('click', function () {
													$inputItem.remove();
												});

												$('#locations_list').append($inputItem);
											}

											$input.val('');
										}
									}
								});
							}
			});
		});
	
	// / Create registration

});