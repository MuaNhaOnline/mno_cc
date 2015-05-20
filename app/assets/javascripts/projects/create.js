$(function () {
    var $form = $('#create_project_form');
    init_DatePicker($form.find('[data-type="date"]'));
    init_UnitFormat([{
        select: $form.find('#currency_id'),
        input: $form.find('#price')
    }]);
    initImageUpload($form.find('.image-upload input[type="file"]'), 'project');
    init_SaveDraft($form);
    init_Submit($form);
});

function init_SaveDraft($form) {
    $form.find('[data-function="save-draft"]').on('click', function () {
        $.ajax({
            url: '/projects/create',
            type: 'POST',
            data: $form.serialize() + '&draft',
            dataType: 'JSON'
        }).done(function (data) {
            if (data.status == 1) {

                if ($form.children('input[name="real_estate[id]"]').length == 0) {
                    $form.prepend('<input type="hidden" name="project[id]" value="' + data.result + '" />');
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

function init_Submit($form) {
    init_SubmitForm($form, {
        validate: function () {
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
            }
        },
        submit: function () {
            $.ajax({
                url: '/projects/create',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON'
            }).done(function (data) {
                if (data.status == 1) {
                    window.location = '/projects/' + data.result.id;
                }
                else {
                    alert('Thất bại');   
                }
            }).fail(function () {
                alert('Thất bại');
            });
        }
    })
}