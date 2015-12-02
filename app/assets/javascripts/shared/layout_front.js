var $footer = $('footer');

//region Initialization
$(function () {
	//init Header	
	initHeader();

	// init tooltip
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

	//init search-box
	initMore();

	//init datepicker
	$('.datepicker').datepicker();

	//init toggle object
	initToggleElement($('[data-toggle-object]'), false);

	// init item list
	_initItemList();
	
	//Set purpose
	setPurpose();

	// init MiniMenu
	// initMiniMenu();
	initMiniMenu($('#mini_menu'), $('#content_mini_menu'));

	// Contact box
	(function () {
		var $contactBox = $('.contact-box-container .contact-box');
		$contactBox.find('.box-header').on({
			'click': function () {
				if ($contactBox.find('.box-body').slideToggle(200).is(':visible')){
					$contactBox.find(':input:eq(0)').focus();
					$document.on({
						'click.close_contact_form': function () {
							$contactBox.find('.box-body').slideUp(200);
							$document.off('.close_contact_form');
						},
						'keydown.close_contact_form': function (e) {
							if (e.keyCode == 27) {
								$contactBox.find('.box-body').slideUp(200);
								$document.off('.close_contact_form');	
							}
						}
					});
				}
			}
		});
		// For click inside when open (click outside to close event)
		$contactBox.on('click', function (e) {
			e.stopPropagation();
		});

		$contactBox.find('.box-body').hide();

		$contactBox.find('#contact_form').on('submit', function (e) {
			e.preventDefault();
			var form = this;

			if (!form['contact[name]'].value) {
				alert('Vui lòng nhập tên');
				return;
			}

			if (!form['contact[phone_number]'].value) {
				alert('Vui lòng nhập số điện thoại');
				return;
			}

			if (/\D/.test(form['contact[phone_number]'].value) || form['contact[phone_number]'].value.length > 11 || form['contact[phone_number]'].value.length < 10) {
				alert('Số điện thoại không hợp lệ');
				return;
			}

			if (!form['contact[email]'].value) {
				alert('Vui lòng nhập email');
				return;
			}

			if (!/^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i.test(form['contact[email]'].value)) {
				alert('Email không hợp lệ');
				return;
			}

			$.ajax({
				url: '/contact_user_infos/create',
				method: 'POST',
				data: $(form).serialize(),
				dataType: 'JSON'
			}).done(function () {
				$contactBox.find('.box-body').html('<p>Gửi thành công. Cám ơn bạn, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.</p>');
			}).fail(function () {
				alert('Rất tiếc, đã có lỗi xảy ra');
			});
		});
	})();
});

//endregion

// start popup
function _initItemList($container) {
	// Popup alert
	(typeof($container) == 'undefined' ? $('[data-popup="coming-soon"]') : $container.find('[data-popup="coming-soon"]')).on('click', function(e) {
		e.preventDefault();
		if ($body.is('[data-signed]')) {
			$('#coming_soon_popup').modal('show');
		}
		else {
			$('[data-toggle="modal"][data-target="#signin"]').click();
		}
	});

	// Tooltip
	(typeof($container) == 'undefined' ? $('.item-sm [data-toggle="tooltip"], .item-lg [data-toggle="tooltip"]') : $container.find('[data-toggle="tooltip"]')).tooltip();
	
	// Gallery
	(typeof($container) == 'undefined' ? $('.item-sm [aria-gallery], .item-lg [aria-gallery]') : $container.find('[aria-gallery]')).on('click', function() {
		var $button = $(this);

		var $html = $(
			'<div class="gallery-popup">' +
				'<div class="gallery-container">' +
					'<section class="close-button">' +
						'<button type="button" class="close" aria-click="close"><span aria-hidden="true">&times;</span></button>' +
					'</section>' +
					'<section class="image-view-panel">' +
						'<span class="fa fa-spin fa-spinner" aria-name="spinner"></span>' +
						'<img aria-name="image" class="image" src="#" />' +
					'</section>' +
					'<section class="image-description-panel">' +
						'<div class="text-center small" aria-name="description"></div>' +
					'</section>' +
					'<section class="image-list-panel">' +
						'<ul class="item-list">' +
						'</ul>' +
					'</section>' +
				'</div>' +
			'</div>'
		);

		$body.append($html);

		/*
			Init values
		*/

		// Get images
		var $itemList = $html.find('.item-list');

		$html.find('[aria-name="spinner"]').show();
		$html.find('[aria-name="image"]').hide();
		$.ajax({
			url: '/' + $button.attr('aria-gallery') + 's/get_gallery/' + $button.data('value'),
			dataType: 'JSON'
		}).always(function () {
			$html.find('[aria-name="spinner"]').hide();
			$html.find('[aria-name="image"]').show();
		}).done(function(data) {
			if (data.status == 0) {
				$(data.result).each(function() {
					$itemList.append('<li class="item" data-description="' + this.description + '"><img src="' + this.small + '" data-src="' + this.original + '" /></li>');	
					if (this.id == $button.data('id')) {
						showImage($itemList.children(':last-child'));
					}
				});					

				initChangeImage();
			}
			else {
				turn_off_popup_gallery();
			}
		}).fail(function() {
			turn_off_popup_gallery();
		});

		/*
			/ Init values
		*/

		/*
			Events
		*/

		function initChangeImage() {
			$itemList.find('.item').on('click', function () {
				showImage($(this));
			});

			$(document).on('keydown.popup_gallery', function (e) {
				switch (e.keyCode) {
					case 37:
					case 40:
						e.preventDefault();
						prevImage();
						break;
					case 38:
					case 39:
						e.preventDefault();
						nextImage();
						break;
				}
	    });

			if (isMobile()) {
				$html.find('.image-view-panel').on({
					swipeleft: function () {
						prevImage();
					},
					swiperight: function () {
						nextImage();
					}
				});
			}

			$html.find('.image-view-panel').on('click', function () {
				nextImage();
			});

			function prevImage() {
				var $selected = $itemList.find('.selected');

				if ($selected.is(':first-child')) {
					showImage($itemList.find('.item:last-child'));
				}
				else {
					showImage($selected.prev());
				}
			}

			function nextImage() {
				var $selected = $itemList.find('.selected');

				if ($selected.is(':last-child')) {
					showImage($itemList.find('.item:first-child'));
				}
				else {
					showImage($selected.next());
				}
			}
		}

		function showImage($item) {
			if ($item.hasClass('selected')) {
				return;
			}

			var src = $item.find('img').data('src');

			$item.siblings('.selected').removeClass('selected');
			$item.addClass('selected');

			// Set description
			$html.find('[aria-name="description"]').text($item.data('description'));

			// Set max height
			$html.find('[aria-name="image"]').css('max-height', $html.find('.image-view-panel')[0].getBoundingClientRect().height - 10 + 'px');

			
			$html.find('[aria-name="image"]').hide();
			$html.find('[aria-name="spinner"]').show();	
			var downloadingImage = new Image();
			downloadingImage.onload = function(){
				$html.find('[aria-name="image"]').attr('src', src);

				$html.find('[aria-name="spinner"]').hide();
				$html.find('[aria-name="image"]').show();
			};
			downloadingImage.src = src;
		}

		/*
			/ Events
		*/

		/*
			Scroll list item
		*/

			_initHorizontalListScroll($html.find('.image-list-panel'));

		/*
			/ Scroll list item
		*/

		/*
			Turn off
		*/

		$(document).on('keydown.popup_gallery', function (e) {
      if (e.keyCode == 27) {
				e.preventDefault();
        turn_off_popup_gallery();
      }
    });

    $html.on('click', function () {
    	turn_off_popup_gallery();
    });

    $html.find('[aria-click="close"]').on('click', function () {
    	turn_off_popup_gallery();
    });

    $html.children().on('click', function (e) {
    	e.stopPropagation();
    });

    function turn_off_popup_gallery() {
	    $(document).off('keydown.popup_gallery');

	    $html.remove();
	  };

		/*
			/ Turn off
		*/
	});

	/*
		User favorite
	*/

	(typeof($container) == 'undefined' ? $('.item-sm [aria-click="user_favorite"], .item-lg [aria-click="user_favorite"]') : $container.find('[aria-click="user_favorite"]')).on('click', function () {
		if (!$body.is('[data-signed]')) {
			$('[data-toggle="modal"][data-target="#signin"]').click();
			return;
		}
		
		var 
			$button = $(this),
			is_add = !$button.is('.active');

		$.ajax({
			url: '/' + $button.data('type') + 's/user_favorite/' + ($button.closest('.item-sm, .item-lg, .item-info').data('value')) + '/' + (is_add ? '1' : '0'),
			method: 'POST',
			dataType: 'JSON'
		}).done(function (data) {
			if (data.status == 0) {
				if (is_add) {
					$button.addClass('active').attr('title', 'Xóa khỏi danh sách yêu thích').tooltip('fixTitle');
				}
				else {
					$button.removeClass('active').attr('title', 'Lưu vào danh sách yêu thích').tooltip('fixTitle');
				}
			}
		})
	}).each(function () {
		var $button = $(this);
		if ($button.hasClass('active')) {
			$button.attr('title', 'Xóa khỏi danh sách yêu thích');
		}
		else {
			$button.attr('title', 'Lưu vào danh sách yêu thích');
		}
		$button.tooltip();
	});

	/*
		/ User favorite
	*/

	/*
		Toggle object
	*/

		initToggleElement(typeof($container) == 'undefined' ? $('.item-xs[data-toggle-object]') : $container.find('[data-toggle-object]'), false);

	/*
		/ Toggle object
	*/

	/*
		Time
	*/

		initReadTime($container);

	/*
		/ Time
	*/
}
// end

// start header
function initHeader() {
	var $header = $('.header-fixed');
	var $coverWall = $('.cover-wall');
	
	var scroll = $window.scrollTop();
	$window.on('scroll', function(e) {		
		var currentScroll = $window.scrollTop();
		
		if (currentScroll != 0) {
			$header.addClass('fixed');
			$('header').css('height','0');
		} else {
			$('header').css('height', '60px');
			$header.removeClass('fixed');
		}		

		if (scroll < currentScroll) {
			//Window is scroll down
			$header.slideUp('fast');
		}
		else {
			// Window is scroll up
			$header.fadeIn();
			if (currentScroll == 0) {			
				$header.css({
					'height': '60px'
				});
				$coverWall.css({
					'top': '98px'
				});
			} else {
				$header.css({
					'height': '46px',
					'top': '0'
				});
				$coverWall.css({
					'top': '46px'
				});
			}
		}
		scroll = currentScroll;
	});
}
// end

// start mini menu
function initMiniMenu(objBtnPress, objContent) {
    var $btnMenu = $(objBtnPress);
    var $contentMenu = $(objContent);

    $contentMenu.on('Off', function(e) {
        e = e || window.event;

        $contentMenu.hide();
        $body.css('overflow-y', 'auto');

        $document.off('keydown.btn-close');
    });

    $contentMenu.on('On', function(e) {
        $contentMenu.show();
        $body.css('overflow-y','hidden');

        $contentMenu.find('.popup-out').one('click', function() {
            $contentMenu.trigger('Off');
        });

        $document.on('keydown.btn-close', function(e) {
            e = e || window.event;

            if (e.keyCode == 27) {
                $contentMenu.trigger('Off');
            } else {
                console.log('Key is press down! But not Esc key.');
            }
        });
    });

    $btnMenu.on('click', function(e) {
        e = e || window.event;

        if ($contentMenu.is(':visible')) {
        	$contentMenu.trigger('Off');        	
        } else {
        	$contentMenu.trigger('On');        	
        }
    });
}

// start initMiniMenu
// function initMiniMenu() {
// 	$coverWall = $('.cover-wall');
// 	$window.on('click', function() {
// 		if ($coverWall.is(':visible')) {
// 			lockScrollBody(true);
// 		} else {
// 			lockScrollBody(false);
// 		}

// 		$coverWall.on('click', function(e) {		
// 			$(this).hide();
// 			lockScrollBody(false);
// 		});
// 		$('.cover-wall .mini-menu-content').on('click', function(e) {
// 			e.stopPropagation();
// 		});
// 	});	
// }
// end

//start search-box
function initMore() {
	$('[data-function="show-search-plus"]').on('click', function () {
		var searchPlus = $('#more_search');
		searchPlus.fadeToggle(500, function () {
			searchPlus.find(':input').prop('disabled', !searchPlus.is(':visible'));
		});

		$('.btn-search-plus').fadeToggle();
	}).click();

	$('[aria-input-type="dropdownselect"]').each(function () {
		var $input = $(this);

		$input.find('~ ul a').on('click', function () {
			$input.find('~ button span').html($(this).html());
			$input.val($(this).data('value'));
		}).filter('[data-selected]:eq(0)').click();
	});

	$('[name="purpose"]').on('change', function () {
		if (this.value == 'r') {
			$('[data-for="sell"]').hide();
			$('[data-for="rent"]').show().first().find('[data-selected]').click();
		}
		else {
			$('[data-for="rent"]').hide();
			$('[data-for="sell"]').show().first().find('[data-selected]').click();
		}
	}).filter(':checked').change();
}
//end

// start ToggleElement
function initToggleElement($listObject, isFunction) {
	$listObject.off('click.on_off').on('click.on_off', function (e) {
		//Lấy đối tượng 
		// $btn: nút nhấn
		// $object: đối tượng popup sẽ được hiển thị
		var $btn = $(this);
		var $object = $('[data-object="' + $btn.attr('data-toggle-object') + '"]');
		
		var $style = $btn.attr('data-toggle-style');

		switch($style) {
			case "fade": {
				//Xử lý sự kiện click của nút nhấn
				if ($object.is(':visible')) {
					$object.slideUp('fast');
					return;
				}
				$object.fadeIn('fast');
				if (isFunction !== true) {
					$object.on('click', function (e) {
						if ($object.is(':visible')) {
							e.stopPropagation();												
						}
					});
				}
				//Xử lý sự kiện nhấn chuột ra ngoài đối tượng
				setTimeout(function () {
					$(document).one('click', function (e) {
						$object.slideUp('fast');
					})
				});			
			}; break;
			default: {
				//Xử lý sự kiện click của nút nhấn
				if ($object.is(':visible')) {
					$object.hide();
					return;
				}
				$object.show();
				if (isFunction !== true) {
					$object.on('click', function (e) {
						e.stopPropagation();												
					});
				}
				//Xử lý sự kiện nhấn chuột ra ngoài đối tượng
				setTimeout(function () {
					$(document).one('click', function (e) {
						$object.hide();
					})
				});
			}
		}

		$('.dropdown-toggle').dropdown();
	});
}
// end

/*
	Map (Chiêu)
*/

/*
	params:
		id(*)
		params:
			zoom: 17
			center: {}
				lat: first_market || 10.771528380460218
				long: first_market || 106.69838659487618
			markers: [{}]
				lat: ...
				long: ...
*/
function initMap(id, params) {
	if (typeof params === 'undefined') {
		params = {}
	}

	var options = {
		scrollwheel: false
	};

	options.zoom = params.zoom || 17

	if ('center' in params ) {
		options.center = params.center
	}
	else if ('markers' in params && params.markers.length > 0) {
		options.center = { lat: params.markers[0].latLng.lat, lng: params.markers[0].latLng.lng }
	}
	else {
		options.center = { lat: 10.771528380460218, lng: 106.69838659487618 }; 
	}

	var map = new google.maps.Map(document.getElementById(id), options);

	$(params.markers).each(function () {
		new google.maps.Marker({
			position: this.latLng,
			map: map,
			title: this.title || '...'
		});
	})

	$('#' + id).on({
		'focus, click': function () {
			map.setOptions({'scrollwheel': true});
		},
		focusout: function () {
			map.setOptions({'scrollwheel': false});
		}
	});

	return map;
}

/*
	/ Map
*/

/*
	Set purpose
*/

	function setPurpose() {
		switch ($.cookie('purpose')) {
			case 'r':
				$body.attr('data-purpose', 'rent');
				break;
			default:
				$body.attr('data-purpose', 'sell');
				break;
		}
	}

/*
	/ Set purpose
*/

/*--------------------------------------------------------*/
/*Support function*/
/*--------------------------------------------------------*/

// lock scrollable body
function lockScrollBody(status) {
	if (status) {
		$body.css({
			'overflow': 'hidden'
		});
	} else {
		$body.css({
			'overflow': 'auto'
		});
	}
}