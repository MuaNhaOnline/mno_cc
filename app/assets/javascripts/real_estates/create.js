$(function(e){
	//Khởi tạo sự kiện select của <select>, <checkbox>, <radiobutton>
	init();
	//Khởi tạo sự kiện Expand và Collapse cho button
	initExpand();
	//Khởi tạo nút Thêm hình ảnh - giới hạn 5 ảnh
	generalImage(5);
	//Khởi tạo ẩn hiện nội dung đầy đủ
	initComposing();
	//Khởi tạo supporter
	init_support();
	//Khởi tạo năm xây dựng
	initNamXayDung();
	//Khởi tạo Validation
    validation("create_real_estate");
	//Ẩn đối tượng mặc định
	hideObjectDefault();
});

function init() {
	$('*[data-feature~="will-change-select"]').on('change', function(e) {
		$option = $(this).find('option:selected');

		hideObject = $option.data('hide');
		showObject = $option.data('show');

		$('*[data-controlled~="' + hideObject + '"]').hide();
		$('*[data-controlled~="' + showObject + '"').show();
	});

	$('*[data-feature~="will-change-show-check"]').on('change', function() {
		var checked = this.checked;

		hideObject = $(this).data('hide');
		showObject = $(this).data('show');

		if (checked) {
			$('*[data-controlled~="' + hideObject + '"]').slideUp();
			$('*[data-controlled~="' + showObject + '"').slideDown();
		}
		else {
			$('*[data-controlled~="' + hideObject + '"]').slideDown();
			$('*[data-controlled~="' + showObject + '"').slideUp();
		}
	});

	$('*[data-feature~="will-change-available-check"]').on('change', function() {
		var checked = this.checked;

		enableObject = $(this).data('enable');
		disableObject = $(this).data('disable');

		$('*[data-controlled~="' + enableObject + '"]').prop('disabled', !checked);
		$('*[data-controlled~="' + disableObject + '"').prop('disabled', checked);
	});
}
function hideObjectDefault() {
	$('*[hidden]').hide();
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

/* #start supporter */
function init_support() {
	$('.support-button').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */		
		var dataType = $(this).attr('data-value');
		show_supporter(dataType);
	});
}
function show_supporter(object) {
	//get object	
	var obj = $(object);	
	//toggle supporter
	obj.slideToggle('fast');
	//Click out supporter to slideUp
	$('body').click(function(event) {
		/* Act on the event */
		if (!$(event.target).closest($('.support-button')).length) {
			$(obj).slideUp('fast');
		}
	});
}
/* #end supporter */
/* #start Khởi tạo năm xây dựng */
function initNamXayDung() {
	$year = "";	
	$tempDate = new Date();
	$nowYear = $tempDate.getYear() + 1900;
	for (var i = $nowYear; i >= $nowYear - 20; i--) {
		$year += "<option value=" + i + ">" + i + "</option>";
	}	
	$year += "<option value=\"tren20nam\">>20 năm</option>" ;
	$year += "<option value=\"tren50nam\">>50 năm</option>" ;
	$('#build_year').html($year);
}
/* #end Khởi tạo năm xây dựng */
/* #start validation */
function validation(idForm) {
	idForm = "#" + idForm;
	$(idForm).submit(function(e) {
		//redefine event
		e = e || window.event;

		//Variable valid
		var isValid = true;		

		$('.required:visible').each(function(index, el) {
			el = $(el);
			if (el.val() == "") {				
				//$(this).css('border-color', 'red');				
				el.addClass('is-error');
				isValid = false;				
			}
			else {
				//$obj.css('border-color', '#ccc');				
				el.removeClass('is-error');
			}
			el.on('focusin', function() {				
				//$obj.css('border-color', '#ccc');				
				el.removeClass('is-error');
			});				
		});
		if (!isValid) {
			$('html, body').animate(
				{ scrollTop: $('.is-error').offset().top - 100 }
			);
			$('.is-error')[0].focus();
			e.preventDefault();
		}		
	});	

	/* prevent key non-number */
	$('.only-number').on('keypress', function(event) {		
		event = event || window.event;

		if (event.keyCode < 48 || event.keyCode > 57) {
			event.preventDefault();		
		}					
	});
	
	/* #start Progress DonViTienTe*/
	$('#currency_id').on('change', function(event) {
		$obj = $('#price');
		if ($(this).find('option:selected').attr('data-value') == "USD") {
			$obj.attr('data-separate', ',');
			var reg = new RegExp('[.]', "g");
			$obj.val($obj.val().replace(reg, ','));
		} else {
			$obj.attr('data-separate', '.');
			var reg = new RegExp('[,]', "g");
			$obj.val($obj.val().replace(reg, '.'));
		}
	});
		/*Numberic format*/
		function insertSeparate(str, separate) {
			if (str.length > 3) {
				return insertSeparate(str.slice(0, str.length - 3), separate) + separate + str.slice(str.length - 3);
			}
			return str;
		}
		function numbericFormat(value, separate){
			var reg = new RegExp('[' + separate + ']', "g");
			var value = value.replace(reg, '');

			return insertSeparate(value, separate);
		}
		$('#price').on('keyup', function(event) {	
			$obj = $(this);
			var separate = $obj.attr('data-separate');
			
			$obj.val(numbericFormat($obj.val(), separate));
		});
	/* #end Progress DonViTienTe*/
}
/* #end Validation */