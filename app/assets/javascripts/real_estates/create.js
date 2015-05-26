//region Initialization

$(function(e){
    var $form = $('#create_real_estate');
    init_BuildYear();
    init_UnitFormat([{
        select: $form.find('#currency_id'),
        input: $form.find('#sell_price, #rent_price')
    }]);
    initImageUpload($form.find('.image-upload input[type="file"]'), 'real_estate');
    init_Preview($form);
    init_SaveDraft($form);
    init_Submit($form);

    getFullProvinceDataAfterChange();
});

//endregion

//region Initialize functions

//region Init building year

function init_BuildYear() {
    var $selectObject = $('#build_year');
    var selectedValue = $selectObject.attr('data-value');

    var htmlYear = '', date = new Date();
    var nowYear = date.getFullYear();
    var minYear = nowYear - 20;
    for (var i = nowYear; i >= minYear; i--) {
        htmlYear += "<option " + (i == selectedValue ? "selected" : "") + " value=" + i + ">" + i + "</option>";
    }
    htmlYear += "<option " + (selectedValue == "20" ? "selected" : "") + " value=\"20\">>20 năm</option>";
    htmlYear += "<option " + (selectedValue == "50" ? "selected" : "") + " value=\"50\">>50 năm</option>";

    $selectObject.html(htmlYear);
}

//endregion

//region Init preview, save draft

function init_Preview($form) {
    init_PopupFull($form.find('[data-function="preview"]'), {
        url: '/real_estates/preview',
        method: 'POST',
        data: function () {
            return $form.serialize();
        }
    }, 'iframe');
}

function init_SaveDraft($form) {
    $form.find('[data-function="save-draft"]').on('click', function () {
        $.ajax({
            url: '/real_estates/create',
            type: 'POST',
            data: $form.serialize() + '&draft',
            dataType: 'JSON'
        }).done(function (data) {
            if (data.status == 1) {

                if ($form.children('input[name="real_estate[id]"]').length == 0) {
                    $form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');
                    $form.find('button[type="submit"]').text('Bổ sung');
                }
                alert('Lưu tạm thành công');
            }
            else {
                alert('Lưu tạm thất bại');
            }
        }).fail(function () {
            alert('Lưu tạm thất bại');
        });
    });
}

//endregion

//region Init submit

function init_Submit($form) {
    init_SubmitForm($form, {
        validate: function () {
            if ($('.image-upload:visible').length) {
                var hasOne = false;
                $('.image-upload input[type="hidden"]').each(function () {
                    if (this.value) {
                        hasOne = true;
                    }
                });

                if (!hasOne) {
                    return {
                        status: 0,
                        result: $($('.image-upload input[type="hidden"]')[0]).parents('.image-upload')
                    };
                }
                return {
                    status: 1
                };
            }
            else {
                return {
                    status: 1
                };
            }
        },
        submit: function () {
            $.ajax({
                url: '/real_estates/create',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON'
            }).done(function (data) {
                if (data.status == 1) {
                    if ($form.find('input[name="real_estate[id]"]').length != 0) {
                        window.location = '/real_estates/' + data.result;
                    }
                    else {
                        promptPopup('Thông tin đã được đăng thành công, bạn có muốn bổ sung thông tin?', [{
                            text: 'Bổ sung',
                            handle: function () {
                                $form.addClass('full');
                                $('html, body').animate(
                                    { scrollTop: $('.until-full:visible').offset().top - 100 }
                                );

                                setDefault_ToggleInputs();
                                $form.prepend('<input type="hidden" name="real_estate[id]" value="' + data.result + '" />');
                                $form.find('button[type="submit"]').text('Bổ sung');
                            },
                            type: 'primary'
                        }, {
                            text: 'Xem kết quả',
                            handle: function () {
                                window.location = '/real_estates/' + data.result;
                            }
                        }]);
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
            }).fail(function () {
                alert('Đăng tin thất bại');
            });
        }
    });
}

//region

//endregion

//region Process

//region Get full province after change

function getFullProvinceDataAfterChange() {
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

//endregion

//endregion
