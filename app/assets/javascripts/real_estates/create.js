$(function(e){
	//Khởi tạo sự kiện select của <select>, <checkbox>, <radiobutton>
	init();
	//Khởi tạo supporter
	init_support();
	//Khởi tạo năm xây dựng
	initNamXayDung();
	//Khởi tạo Validation
    validation("create_real_estate");
	//Ẩn đối tượng mặc định
	hideObjectDefault();
    //Ajax lấy dữ liệu địa chỉ
    getFullProvinceData_AfterChange();
    //Init image upload
    initImageUpload();
});

function init() {
	$('[data-feature~="will-change-select"]').on('change', function(e) {
		e = e || window.event();

		$option = $(this).find('option:selected');

		hideObject = $option.data('hide');
		showObject = $option.data('show');

		$('[data-controlled~="' + hideObject + '"]').hide();
		$('[data-controlled~="' + showObject + '"]').show();
	});

	$('[data-feature~="will-change-show-check"]').on('change', function(e) {
		e = e || window.event();

		var checked = this.checked;

		hideObject = $(this).data('hide');
		showObject = $(this).data('show');

		if (checked) {
			$('[data-controlled~="' + hideObject + '"]').slideUp();
			$('[data-controlled~="' + showObject + '"]').slideDown();
		}
		else {
			$('[data-controlled~="' + hideObject + '"]').slideDown();
			$('[data-controlled~="' + showObject + '"]').slideUp();
		}
	});

	$('[data-feature~="will-change-available-check"]').on('change', function(e) {
		e = e || window.event();

		var checked = this.checked;

		enableObject = $(this).data('enable');
		disableObject = $(this).data('disable');

		$('[data-controlled~="' + enableObject + '"]').prop('disabled', !checked);
		$('[data-controlled~="' + disableObject + '"]').prop({
			'disabled': checked,
			'value': null
		});
	});
}
function hideObjectDefault() {
	$('*[hidden]').hide();
}
function initExpand() {
	$('.expand').on('click', function(e) {
		e = e || window.event();

		e.preventDefault();
		
		expandObject = $(this).data('target');
		
		$(expandObject).slideToggle();

		if ($(this).attr('id') == "btn_continue_composing") {
			$(this).parent().hide();
		}
	});
}

/* #start supporter */
function init_support() {
	$('.support-button').on('click', function(e) {
		e = e || window.event();

		e.preventDefault();
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

    var selectedValue = $('#build_year').attr('data-value');

	for (var i = $nowYear; i >= $nowYear - 20; i--) {
		$year += "<option " + (i == selectedValue ? "selected" : "") + " value=" + i + ">" + i + "</option>";
	}	
	$year += "<option " + (selectedValue == "20" ? "selected" : "") + " value=\"20\">>20 năm</option>";
	$year += "<option " + (selectedValue == "50" ? "selected" : "") + " value=\"50\">>50 năm</option>";

	$('#build_year').html($year);
}
/* #end Khởi tạo năm xây dựng */
/* #start validation */
function validation(idForm) {
	$form = $('#' + idForm);
	$form.submit(function(e) {
		//redefine event
		e = e || window.event;
        e.preventDefault();

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
		}
        else {
            $.ajax({
                url: '/real_estates/create',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON'
            }).done(function(data) {
                if (data.status == 1) {
                    if ($form.find('input[name="real_estate[id]"]').length != 0) {
                        window.location = '/real_estates/' + data.result;
                    }
                    else {
                        promptPopup('Thông tin đã được đăng thành công, bạn có muốn bổ sung thông tin?', [
                            {
                                text: 'Bổ sung',
                                handle: function () {
                                    $('.continue-composing').slideDown();

                                    $('html, body').animate(
                                        { scrollTop: $('.continue-composing').offset().top - 100 }
                                    );
                                    $form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');
                                    $form.find('button[type="submit"]').text('Bổ sung');
                                },
                                type: 'primary'
                            },
                            {
                                text: 'Xem kết quả',
                                handle: function () {
                                    window.location = '/real_estates/' + data.result;
                                }
                            }
                        ]);
                    }
                }
                else {
                    var result = data.result;
                    var errors = '';
                    for (var i = 0; i < result.length; i++) {
                        errors += result[i] + '<br />';
                    }
                    $('#errors').html(errors);
                }
            }).fail(function() {
                alert('Đăng tin thất bại');
            })
        }
	});

    initPopupFull($form.find('[data-feature="preview"]'), {
        condition: function () {
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
            }
            return isValid;
        },
        url: '/real_estates/preview',
        method: 'POST',
        data: function () {
            return $form.serialize();
        }
    }, 'iframe');

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

/* #start Get province data */
function getFullProvinceData_AfterChange() {
    $('#province').on('change', function() {
        $.ajax({
            url: '/provinces/get_full_data/' + $(this).find(':selected').val() + '.json'
        }).done(function(data) {
            $('#district').html(data[0]);
            $('#ward').html(data[1]);
            $('#street').html(data[2]);
        }).fail(function() {
            alert('Lấy dữ liệu tỉnh/thành thất bại.')
        });
    })
}
/* #end Get province data */

/* #start Image upload */
function initImageUpload() {
    $('.image-upload input[type="file"]').on('change', function() {
        //Check file exist
        if (this.files.length == 0) {
            return;
        }

        //Get container
        $fileUploadContainer = $(this).parents('.image-upload');
        //Get & reset progress bar
        var progressBar = $fileUploadContainer.children('u')[0];
        progressBar.style.width = '0%';

        //Collect data
        var data = new FormData();
        data.append('file', this.files[0]);
        data.append('type', 'real_estate');

        //post request
        $.ajax({
            url: '/images/upload',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'JSON',
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if(xhr.upload){ //Check if upload property exists
                    xhr.upload.addEventListener('progress', function(e) {
                        if(e.lengthComputable){
                            progressBar.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
                        }
                    }, false); //For handling the progress of the upload
                }
                return xhr;
            }
        }).done(function(data) {
            if (data.status == 1) {
                $fileUploadContainer.addClass('has-file');
                $fileUploadContainer.find('img').attr('src', '/images/' + data.result);
                $fileUploadContainer.children('input[type="hidden"]').val(data.result);
            }
            else {
                alert('Thêm file thất bại')
            }
        }).fail(function() {
            alert('Thêm file thất bại')
        }).always(function() {
            progressBar.style.width = '0%';
        });
    });

    $('.image-upload i').on('click', function() {
        if (!confirm('Bạn có chắc muốn xóa hình này?')) {
            return;
        }

        //Get container
        $fileUploadContainer = $(this).parents('.image-upload');

        $fileUploadContainer.removeClass('has-file');
        $fileUploadContainer.children('input[type="hidden"]').val('');
    });
}
/* #end Image upload */
