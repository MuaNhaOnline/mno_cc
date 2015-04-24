//region Initialization

$(function () {
    init_DeleteButton($('[data-function="delete"]'));
    init_ShowButton($('[data-function="show"]'));
    init_HideButton($('[data-function="hide"]'));
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
            url: '/real_estates/' + $row.attr('data-value'),
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

//region Init show button

function init_ShowButton($button) {
    $button.on('click', function () {

        $row = $(this).parents('tr');

        $.ajax({
            url: '/real_estates/change_show_status/' + $row.attr('data-value') + '/1',
            type: 'PUT',
            contentType: 'JSON'
        }).done(function (data) {
            if (data.status == 1) {
                alert('Hiển thị tin thành công')
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

//region Init hide button

function init_HideButton($button) {
    $button.on('click', function () {

        $row = $(this).parents('tr');

        $.ajax({
            url: '/real_estates/change_show_status/' + $row.attr('data-value') + '/0',
            type: 'PUT',
            contentType: 'JSON'
        }).done(function (data) {
            if (data.status == 1) {
                alert('Ẩn tin thành công')
            }
            else {
                alert('Ẩn tin thất bại')
            }
        }).fail(function () {
            alert('Ẩn tin thất bại')
        });
    });
}

//endregion

//endregion