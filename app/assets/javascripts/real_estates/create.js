$(function(e){
	init();
	initExpand();
	generalImage(5);
	initComposing();
});

function init() {
	$('.will-change-select').on('change', function(e) {
		$option = $(this).find('option:selected');

		hideObject = $option.data('hide');
		showObject = $option.data('show');

		$('*[data-controlled*="|' + hideObject + '|"]').hide();
		$('*[data-controlled*="|' + showObject + '|"').show();
	});

	$('.will-change-show-check').on('change', function() {
		var checked = this.checked;

		hideObject = $(this).data('hide');
		showObject = $(this).data('show');

		if (checked) {
			$('*[data-controlled*="|' + hideObject + '|"]').slideUp();
			$('*[data-controlled*="|' + showObject + '|"').slideDown();
		}
		else {
			$('*[data-controlled*="|' + hideObject + '|"]').slideUp();
			$('*[data-controlled*="|' + showObject + '|"').slideDown();
		}
	});

	$('.will-change-available-check').on('change', function() {
		var checked = this.checked;

		enableObject = $(this).data('enable');
		disableObject = $(this).data('disable');

		$('*[data-controlled*="|' + enableObject + '|"]').prop('disabled', !checked);
		$('*[data-controlled*="|' + disableObject + '|"').prop('disabled', checked);
	});
}

function initExpand() {
	$('.expand').on('click', function(e) {
		e.preventDefault();
		
		expandObject = $(this).data('target');
		
		$(expandObject).slideToggle();

		if ($(this).attr('id') == "btn_continue_composing") {
			$(this).parent().hide();
		}
	});
}

function generalImage(limitNumber) {
	$('#btn_add_image').on('click', function(e) {
		e.preventDefault();

		nameObject = $(this).data('add');		
		$currentObject = $(':last-of-type[data-name="' + nameObject + '"]');
		if ($('[data-name="' + nameObject + '"]').length < limitNumber) {
			$newObject = $currentObject.clone();	
			$currentObject.after($newObject);
		}		
	});
}

function initComposing() {
	$('.continue-composing').hide();
}