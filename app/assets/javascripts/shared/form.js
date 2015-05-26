//region Initialization

$(function(e){
    var $form = $('.create-form');
    setDefault_ToggleInputs();
    init_ToggleInputs();
    init_Constraint($form);
});

//endregion

//region Initialize functions

//region Init show/hide inputs

//Set default
function setDefault_ToggleInputs() {
    $('[data-toggle-input~="select-show"]:visible').each(function() {
        console.log(this.name);
        var $option = $(this).find('option:selected');

        var hideObject = $option.attr('data-hide');
        var showObject = $option.attr('data-show');

        $('[data-toggle-input-object~="' + hideObject + '"]').hide().prop('disabled', true);
        $('[data-toggle-input-object~="' + showObject + '"]').show().prop('disabled', false);
    });

    $('[data-toggle-input~="check-show"]:visible').each(function() {
        var checked = this.checked;

        var $obj = $(this);
        var hideObject = $obj.data('hide');
        var showObject = $obj.data('show');

        if (checked) {
            $('[data-toggle-input-object~="' + hideObject + '"]').hide().prop('disabled', true);
            $('[data-toggle-input-object~="' + showObject + '"]').show().prop('disabled', false);
        }
        else {
            $('[data-toggle-input-object~="' + hideObject + '"]').show().prop('disabled', false);
            $('[data-toggle-input-object~="' + showObject + '"]').hide().prop('disabled', true);
        }
    });

    $('[data-toggle-input~="check-disable"]:visible').each(function() {
        var checked = this.checked;

        var $obj = $(this);
        var enabledObject = $(this).data('enable');
        var disabledObject = $(this).data('disable');

        $('[data-toggle-input-object~="' + enabledObject + '"]').prop('disabled', !checked);
        $('[data-toggle-input-object~="' + disabledObject + '"]').prop('disabled', checked);
    });
}

//Set event
function init_ToggleInputs() {
    $('[data-toggle-input="select-show"]').on('change', function() {
        var $option = $(this).find('option:selected');

        var hideObject = $option.attr('data-hide');
        var showObject = $option.attr('data-show');

        $('[data-toggle-input-object~="' + hideObject + '"]').hide().prop('disabled', true);
        $('[data-toggle-input-object~="' + showObject + '"]').show().prop('disabled', false);
    });

    $('[data-toggle-input="check-show"]').on('change', function() {
        var checked = this.checked;

        var $obj = $(this);
        var hideObject = $obj.data('hide');
        var showObject = $obj.data('show');

        if (checked) {
            $('[data-toggle-input-object~="' + hideObject + '"]').hide().prop('disabled', true);;
            $('[data-toggle-input-object~="' + showObject + '"]').show().prop('disabled', false);;
        }
        else {
            $('[data-toggle-input-object~="' + hideObject + '"]').show().prop('disabled', false);;
            $('[data-toggle-input-object~="' + showObject + '"]').hide().prop('disabled', true);;
        }
    });

    $('[data-toggle-input="check-disable"]').on('change', function() {
        var checked = this.checked;

        var $obj = $(this);
        var enabledObject = $(this).data('enable');
        var disabledObject = $(this).data('disable');

        $('[data-toggle-input-object~="' + enabledObject + '"]').prop('disabled', !checked);
        $('[data-toggle-input-object~="' + disabledObject + '"]').prop('disabled', checked);
    });
}

//endregion

//region Init datepicker

function init_DatePicker($input) {
    $input.datepicker({
        format: 'dd/mm/yyyy'
    });
}

//endregion

//region Init constraint

function init_Constraint($form) {
    //init integer
    $('[data-constraint~="only-number"]').on('keydown', function (e) {
        e = e || window.event;

        if (//number
        (!e.shiftKey &&
        ((48 <= e.keyCode && e.keyCode <= 57) ||
        (96 <= e.keyCode && e.keyCode <= 105))) ||
            //., backspace, delete, tab, enter
        $.inArray(e.keyCode, [190, 8, 46, 9, 13]) !== -1 ||
            //home, end, left, right, down, up
        (35 <= e.keyCode && e.keyCode <= 40) ||
            //ctrl A
        (e.keyCode == 65 && e.ctrlKey)) {
            return;
        }

        e.preventDefault();
    });
}

//endregion

//region Init image upload

function initImageUpload($objs, type) {
    $objs.on('change', function() {
        //Check file exist
        if (this.files.length == 0) {
            return;
        }

        //Get container
        var $fileUploadContainer = $(this).parents('.image-upload');
        //Get & reset progress bar
        var progressBar = $fileUploadContainer.children('u')[0];
        progressBar.style.width = '0%';

        //Collect data
        var data = new FormData();
        data.append('file', this.files[0]);
        data.append('type', type);

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
        var $fileUploadContainer = $(this).parents('.image-upload');

        $fileUploadContainer.removeClass('has-file');
        $fileUploadContainer.children('input[type="hidden"]').val('');
    });
}

//endregion

//region Init unit format

function init_UnitFormat(objects) {
    var count = objects.length;
    for (var i = 0; i < count; i++) {
        var $select = objects[i].select;
        var $inputs = objects[i].input;
        $select.on('change', function () {
            if ($select.find('option:selected').attr('data-value') == 'USD') {
                $inputs.each(function () {
                    var $input = $(this);
                    $input.attr('data-separate', ',');
                    var reg = new RegExp('[.]', "g");
                    $input.val($input.val().replace(reg, ','));  
                });
            }
            else {
                $inputs.each(function () {
                    var $input = $(this);
                    $input.attr('data-separate', '.');
                    var reg = new RegExp('[,]', "g");
                    $input.val($input.val().replace(reg, '.'));  
                })
            }
        });

        $inputs.on('keyup', function() {
            var $input = $(this);
            var separate = $input.attr('data-separate');

            $input.val(numbericFormat($input.val(), separate));
        });
    }
}

function numbericFormat(value, separate){
    var reg = new RegExp('[' + separate + ']', "g");
    value = value.replace(reg, '');

    return insertSeparate(value, separate);
}

function insertSeparate(str, separate) {
    if (str.length > 3) {
        return insertSeparate(str.slice(0, str.length - 3), separate) + separate + str.slice(str.length - 3);
    }
    return str;
}

//endregion

//region Init submit form

/*

    validate
    submit
    scroller (for scroll during error)

 */
function init_SubmitForm($form, options) {
    $form.on('submit', function (e) {
        e = e || window.event;
        e.preventDefault();

        var isValid = true;

        $('[data-validate~="required"]:visible').each(function () {
            var $input = $(this);
            if ($input.val() == "") {
                $input.addClass('is-error');
                isValid = false;
            }
            else {
                $input.removeClass('is-error');
            }
        });

        if ('validate' in options) {
            var result = options.validate();

            if (result.status != 1) {
                result.result.addClass('is-error');
                isValid = false;
            }
        }

        if (!isValid) {
            var $scroller = 'scroller' in options ? options['scroller'] : $('html, body');
            $scroller.animate(
                { scrollTop: $('.is-error').offset().top - 100 }
            );
        }
        else {
            if ('submit' in options) {
                options.submit();
            }
        }
    });
}

//endregion

//endregion