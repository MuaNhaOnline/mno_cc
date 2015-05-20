//region Initialization

$(function () {
    init_DeleteButton($('[data-function="delete"]'));
    init_ChangeShowStatusButton($('[data-function="change_show_status"]'));
});

//endregion

//region Initialize functión

//region Init delete button

function init_DeleteButton($button) {
    $button.on('click', function () {
        if (!confirm('Bạn có chắc muốn xóa tin này?')) {
            return;
        }

        $row = $(this).parents('tr');

        $.ajax({
            url: '/projects/' + $row.attr('data-value'),
            type: 'DELETE',
            contentType: 'JSON'
        }).done(function (data) {
            if (data.status == 1) {
                $row.remove();
            }
            else {
                alert('Xóa tin thất bại')
            }
        }).fail(function () {
            alert('Xóa tin thất bại')
        });
    });
}

//endregion

//region Init change show status button

function init_ChangeShowStatusButton($button) {
    $button.on('click', function () {
        var status = $button.attr('data-value');
        var $row = $(this).closest('tr');
        var project_id = $row.attr('data-value');

        $.ajax({
            url: '/projects/change_show_status/' + project_id + '/' + status,
            type: 'PUT',
            contentType: 'JSON'
        }).done(function (data) {
            if (data.status == 1) {
                if (status == 1) {
                    $button.attr('data-value', '0');
                    $button.text('Ẩn');
                    $row.find('[data-object="status"]').text('Đang hiển thị');
                }
                else {
                    $button.attr('data-value', '1');
                    $button.text('Hiện');
                    $row.find('[data-object="status"]').text('Đang ẩn');
                }
            }
            else {
                alert('Hiển thị tin thất bại')
            }
        }).fail(function () {
            alert('Hiển thị tin thất bại')
        });
    });
}

//endregion

//endregion