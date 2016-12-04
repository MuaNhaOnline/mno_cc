$(function () {

    // Init items list

        function setShowStatus($item) {
            $item.find('.feature .hide-status').remove();

            $item.find('[data-action="toggle_show_status"]').attr('data-original-title', 'Nhấn đề <b>ẩn</b> bất động sản này<br /><small>Người khác sẽ không xem được</small>');
            $item.find('[data-action="toggle_show_status"] .icon').addClass('ico-eye-blocked').removeClass('ico-eye');

            $item.attr('data-is-show', 'true');
        }

        function setHideStatus($item) {
            var $featureItem = $(
                '<span class="hide-status has-bg">' +
                    '<span class="text">' +
                        'Đang ẩn' +
                    '</span>' +
                '</span>'
            );
            $item.find('.feature').prepend($featureItem);

            $item.find('[data-action="toggle_show_status"]').attr('data-original-title', 'Nhấn đề <b>hiển thị</b> bất động sản này<br /><small>Mọi người đều có thể xem được</small>');
            $item.find('[data-action="toggle_show_status"] .icon').addClass('ico-eye').removeClass('ico-eye-blocked');
            
            $item.attr('data-is-show', 'false');
        }

        function initShowStatus() {
            $('#res_list .item').each(function () {
                var $item = $(this);

                if ($item.attr('data-is-show') == 'true') {
                    setShowStatus($item);
                }
                else {
                    setHideStatus($item);
                }
            });

            $('#res_list [data-action="toggle_show_status"]').on('click', function () {
                var 
                    $button = $(this),
                    $item = $button.closest('.item'),
                    isShow = $item.attr('data-is-show') == 'true';

                $button.startLoadingStatus();
                $.ajax({
                    url: '/real_estates/change_show_status/' + $item.data('value') + '/' + (isShow ? 0 : 1),
                    method: 'POST',
                    dataType: 'JSON'
                }).always(function () {
                    $button.endLoadingStatus();
                }).done(function (data) {
                    if (data.status == 0) {
                        isShow = !isShow;
                        if (isShow) {
                            setShowStatus($item);
                        }
                        else {
                            setHideStatus($item);
                        }
                    }
                    else {
                        _errorPopup();
                    }
                }).fail(function () {
                    _errorPopup();
                })
            });
        }

        function initDelete() {
            $('#res_list [data-action="delete"]').on('click', function () {
                var
                    $button = $(this),
                    $item = $button.closest('.item');

                popupPrompt({
                    title: _t.form.confirm_title,
                    content: _t.real_estate.view.my.delete_confirm,
                    type: 'warning',
                    buttons: [
                        {
                            text: _t.form.yes,
                            type: 'warning',
                            primaryButton: true,
                            handle: function () {
                                $button.startLoadingStatus();
                                $.ajax({
                                    url: '/real_estates/delete/' + $item.data('value'),
                                    method: 'POST'
                                }).done(function (data) {
                                    if (data.status == 0) {
                                        $item.parent().remove();
                                    }
                                    else {
                                        _errorPopup();
                                    }
                                }).fail(function () {
                                    _errorPopup();
                                }).always(function () {
                                    $button.endLoadingStatus();
                                });
                            }
                        },
                        {
                            text: _t.form.no
                        }
                    ]
                })
            });
        }
    
        function initItemList() {
            _initMediumItemsList($('#res_list'));
            initShowStatus();
            initDelete();
        }

        initItemList();
    
    // / Init items list

    // Pagination
    
        _initPagination3({
            url:            '',
            list:           $('#res_list'),
            paginator:      $('#res_paginator'),
            replaceState:   true,
            done:           function () {
                                initItemList();
                            }
        });
    
    // / Pagination

});