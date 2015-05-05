$(function () {
    var $form = $('#create_project_form');
    init_UnitFormat([{
        select: $form.find('#currency_id'),
        input: $form.find('#price')
    }]);
    initImageUpload($form.find('.image-upload input[type="file"]'), 'project');
    init_Submit($form);
});

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
                data: $form.serialize()
            });
        }
    })
}