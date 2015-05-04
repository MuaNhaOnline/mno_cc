//region Initialization

$(function () {
    init_ToggleTarget($('[data-toggle-target]'));
});

//endregion

//region Initialize functions

//region Init toggle object

function init_ToggleTarget($buttons) {
    //convention: $button: objects have class [data-toggle-target="example"]

    $buttons.on('click', function (e) {
        //get objects
        //$obj: clicked element
        //$target: element is effected
        $obj = $(this);
        var toggleObject = $obj.attr('data-toggle-target');
        $target = $('[data-toggle-object="' + toggleObject + '"');

        //Check show/hide
        if ($target.is(':visible')) {
            $target.hide();
            $(document).off('click.' + toggleObject);
        } else {
            $target.show();

            //Hide if click outside
            $(document).on('click.' + toggleObject, function (e) {
                e = e || window.event;

                if ($target.has($(e.target)).length == 0 && !$(e.target).is($obj) && !$(e.target).is($target) && $obj.has($(e.target)).length == 0) {
                    $target.hide();
                    $(document).off('click.' + toggleObject);
                }
            });
        }
    });
}

//endregion

//region Init show popup

function getPopupFull() {
    var $popupFull = $('#popup_full');

    if ($popupFull.length == 0) {
        $popupFull = $(
            '<section id="popup_full" class="popup-full" style="display: none;">\
                <section class="close-frame"></section>\
                <section id="popup_content" class="content-frame">\
                </section>\
            </section>'
        );

        $popupFull.find('.close-frame').on('click', function () {
            if ($popupFull.is('[data-esc]')) {
                $popupFull.trigger('close');
            }
        });

        $popupFull.on('open', function (e, data) {
            if (typeof data === 'undefined') {
                data = {};
            }

            $popupFull.show();

            if ('esc' in data && !data.esc) {
                $popupFull.removeAttr('data-esc');
            }
            else {
                $popupFull.attr('data-esc', '');

                $(document).on('keydown.close_popup', function (e) {
                    e = e || window.event;
                    if (e.keyCode == 27) {
                        $popupFull.trigger('close');
                    }
                });
            }

            $('body').addClass('prevent-scroll');
        });

        $popupFull.on('close', function () {
            $popupFull.hide();
            $(document).off('keydown.close_popup');
            $('body').removeClass('prevent-scroll');
        });

        $('body').prepend($popupFull);
    }

    return $popupFull;
}

//region Popup full

/*
 Tham số gồm:
 condition (function (), trả về false nếu muốn dừng ajax),
 url hoặc href của phần tử (bắt buộc),
 width, height,
 data (mảng {} hoặc function),
 done (function (data: nội dung popup)),
 fail (function ()),
 always (function ())
 */
function init_PopupFull($element, params, type) {
    if (typeof params === 'undefined') {
        params = {};
    }

    $element.on('click', function () {
        if ('condition' in params) {
            if (params.condition() === false) {
                return;
            }
        }

        $.ajax({
            type: 'method' in params ? params.method : 'GET',
            url: 'url' in params ? params.url : $element.attr('href'),
            data: 'data' in params ? (typeof params.data == 'function' ? params.data() : params.data) : {},
            dataType: 'JSON'
        }).done(function (data) {
            if (data.status == 1    ) {
                var $popup = getPopupFull();

                $popup.trigger('open');

                var $popupContent = $popup.find('#popup_content');

                if (type == 'iframe') {
                    $popupContent.addClass('iframe').html('<iframe></iframe>');
                    $popupContent = $popupContent.find('iframe').css({
                        padding: '10px',
                        width: 'width' in params ? params.width : '90vw',
                        height: 'height' in params ? params.height : '80vh',
                        border: '0'
                    }).contents().find('body');
                }
                else {
                    $popupContent.removeClass('iframe').css({
                        width: 'width' in params ? params.width : 'auto',
                        height: 'height' in params ? params.height : 'auto'
                    });
                }

                $popupContent.html(data.result);

                if ('done' in params) {
                    params.done($popupContent);
                }
            }
            else {
                if ('fail' in params) {
                    params.fail();
                }
                else {
                    alert('Thất bại');
                }
            }
        }).fail(function () {
            if ('fail' in params) {
                params.fail();
            }
            else {
                alert('Thất bại');
            }
        }).always(function () {
            if ('always' in params) {
                params.always();
            }
        });
    });
}

//end region

//region Prompt popup

function promptPopup(title, params) {
    if (typeof params === 'undefined') {
        params = {};
    }

    var $popup = getPopupFull();

    var $popupContent = $popup.find('#popup_content');
    $popupContent.addClass('prompt');

    $popupContent.html('\
        <section class="title">' + title + ' </section>\
        <section class="button"></section>\
    ');

    var $buttons = $popupContent.find('.button');

    $(params).each(function (index, object) {
        $buttons.append($('<button class="btn btn-' + (object.type || 'default') + '">' + object.text + '</button>').on('click', function() {
            $popup.trigger('close');
            object.handle();
        }))
    });
    $popup.trigger('open', {
        esc: false
    });
}

//endregion

//endregion

//endregion