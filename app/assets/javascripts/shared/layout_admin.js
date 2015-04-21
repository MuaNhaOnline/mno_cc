// #start start
$(function () {			
	//init Aside
	initAside();		

	//process toggle button
	$('.button-mini-userbox').on('click', function () {
		initial_toggle_button(this);
	});
	$('.button-mini-sitemap').on('click', function () {
		initial_toggle_button(this);
	});
	$('.button-mini-function').on('click', function() {
		initial_toggle_button(this);
	});

	//username click
	$('.userbox').on('click', function(e) {
		initial_toggle_button(this);
	});
});
// #end start

// #start toggle_button
	// #start toggle
		// toggle object
		function toggle(object) {
			//get $object
			object = $(object);

			//toggle
			object.toggle();
		}
	// #end toggle
	function initial_toggle_button (sender) {
		toggle(sender.getAttribute('data-toggle-target'));
	}
// #end toggle_button

//initialize Aside
function initAside() {
	//left-aside
	var $selectElement = $('.left-aside > ul > li > .title');
	
	$selectElement.on('click', function(e) {
		//redefine event
		e = e || window.event;

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');	
			$(this).siblings('ul').slideUp('fast');
		}
		else {
			$(this).addClass('active');	
			$(this).siblings('ul').slideDown('fast');			
		}
	});

	//collapse-aside
	var $selectElement = $('.collapse-aside > ul > li > .title');
	
	$selectElement.on('click', function(e) {
		//redefine event
		e = e || window.event;

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');	
			$(this).siblings('ul').slideUp('fast');
		}
		else {
			$(this).addClass('active');	
			$(this).siblings('ul').slideDown('fast');			
		}
	});
}
//#end Aside

/*
    #start Popup
*/
//Popup full
function getPopupFull() {
    $popupFull = $('#popup_full');

    if ($popupFull.length == 0) {
        $popupFull = $(
            '<section id="popup_full" class="popup-full" style="display: none;">\
                <section class="close-frame"></section>\
                <section id="popup_content" class="content-frame">\
                </section>\
            </section>'
        );

        $popupFull.find('.close-frame').on('click', function () {
            $popupFull.trigger('close');
        });

        $popupFull.on('open', function () {
            $popupFull.show();
            $(document).on('keydown.close_popup', function (e) {
                e = e || window.event;
                if (e.keyCode == 27) {
                    $popupFull.trigger('close');
                }
            });
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
function initPopupFull($element, params, type) {
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
                $popup = getPopupFull();

                $popup.trigger('open');

                $popupContent = $popup.find('#popup_content');

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

/*
    Prompt popup
 */
function promptPopup(title, params) {
    if (typeof params === 'undefined') {
        params = {};
    }

    $popup = getPopupFull();

    $popupContent = $popup.find('#popup_content');
    $popupContent.addClass('prompt');

    $popupContent.html('\
        <section class="title">' + title + ' </section>\
        <section class="button"></section>\
    ');

    $buttons = $popupContent.find('.button');

    $(params).each(function (index, object) {
        $buttons.append($('<button class="btn btn-' + (object.type || 'default') + '">' + object.text + '</button>').on('click', function() {
            $popup.trigger('close');
            object.handle();
        }))
    });
    $popup.trigger('open');
}

/*
    #end Popup
 */