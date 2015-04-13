$(function () {
    manager_init();
});

function manager_init() {
    $('*[data-function="post"]').on('click', function () {

    });

    $('*[data-function="edit"]').on('click', function () {

    });

    $('*[data-function="delete"]').on('click', function () {
        if (!confirm('Bạn có chắc muốn xóa tin này?')) {
            return;
        }

        $row = $(this).parents('tr');

        $.ajax({
            url: '/real_estates/' + $row.data('value'),
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