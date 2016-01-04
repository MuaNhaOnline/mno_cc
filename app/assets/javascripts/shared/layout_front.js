var $footer = $('footer');

//region Initialization
$(function () {
  	_getPopupContent();

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
			}).done(function (data) {
				if (data.status == 0) {
					$contactBox.find('.box-body').html('<p>Gửi thành công. Cám ơn bạn, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.</p>');
				}
				else if (data.status == 5) {
					$popup = popupFull({
						html: data.result,
						esc: false
					});
					$popup.find('[aria-click="select"]').on('click', function () {
						$popup.off();
						$.ajax({
							url: '/contact_user_infos/create',
							method: 'POST',
							data: $(form).serialize() + '&force&append=' + $(this).closest('tr').data('value'),
							dataType: 'JSON'
						}).done(function () {
							$contactBox.find('.box-body').html('<p>Gửi thành công. Cám ơn bạn, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.</p>');
						}).fail(function () {
							alert('Rất tiếc, đã có lỗi xảy ra');
						});
					});
					$popup.find('[aria-click="new"]').on('click', function () {
						$popup.off();
						$.ajax({
							url: '/contact_user_infos/create',
							method: 'POST',
							data: $(form).serialize() + '&force',
							dataType: 'JSON'
						}).done(function () {
							$contactBox.find('.box-body').html('<p>Gửi thành công. Cám ơn bạn, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.</p>');
						}).fail(function () {
							alert('Rất tiếc, đã có lỗi xảy ra');
						});
					})
				}
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
	}).attr('tabindex', '0').css('outline', '0');

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

/* 
	Popup 
*/

  function _getPopupContent() {
    $('[aria-popupcontent]').each(function () {
      _popupContent[this.getAttribute('aria-popupcontent')] = this.outerHTML;
      this.remove();
    });
  }

  /*
  	params:
  		id: (popup_full)
  			id of popup.
  			if wanna show two popup, ids must different
  		z-index: (30)
  			z-index of popup
      overlay:
        transparent
        gray
      width: (none)
        small, medium, large, maximum
  		esc: (true)
  			allow escape popup with click outside or 'esc' key
  */

  function getPopup(params) {
    if (typeof(params) === 'undefined')
    {
      params = {};
    }

    var 
      id = ('id' in params) ? params.id : 'popup_full',
      zIndex = 'z-index' in params ? params['z-index'] : '30',
      esc = !('esc' in params) || params.esc,
      overlay = 'overlay' in params ? params['overlay'] : 'transparent',
      width = 'width' in params ? params['width'] : '';

    var $popup = $('#' + id);

    if ($popup.length == 0) {
      $popup = $('<article id="' + id + '" style="z-index: ' + zIndex + ';" class="popup-full-container"><section class="popup-close"></section><section class="popup-full"><article class="popup-content"></article></section></article>');

      $popup.find('.popup-close').on('click', function () {
        if ($popup.is('[aria-esc]')) {
          $popup.off();
        }
      });

      $body.append($popup);
    }

    $popup.attr('aria-width', width);

    if (esc) {
      $popup.attr('aria-esc', '');
    }
    else {
      $popup.removeAttr('aria-esc');
    }

    if (overlay == 'gray') {
        $popup.addClass('gray');
    }
    else {
        $popup.removeClass('gray');
    }

    $popup.on = function () {
      $popup.addClass('on');
      $(document).on('keydown.turn_off_popup_' + id, function (e) {
        if ($popup.is('[aria-esc]')) {
          if (e.keyCode == 27) {
            e.preventDefault();
            $popup.off();
          }
        }
        if ('enterKey' in params) {
          if (e.keyCode == 13) {
            e.preventDefault();
            $popup.find('[data-type="primary_button"]').click();
          }
        }
      });
      $body.addClass('no-scroll');
    }

    $popup.off = function (isButtonClick) {
      $popup.removeClass('on');
      $(document).off('keydown.turn_off_popup_' + id);
      $body.removeClass('no-scroll');

      // $popup.trigger('onEscape');
      if ($popup.data('onEscape')) {
        $popup.data('onEscape')(isButtonClick);
      }
    };

    return $popup;
  }

  /*
    *
      html: (* or url)
        popup content
    OR
      url: (* or html)
        url to load popup content
      success:
      always:
      fail:

    esc: (true)
      allow escape popup with click outside or 'esc' key
    id: (popup_full)
      id of popup.
      if wanna show two popup, ids must different
    z-index: (30)
      z-index of popup
    overlay: (transparent) 
      transparent, gray
    width: (none)
      small, medium, large, maximum
    onEscape:
      handle on popup escape
  */
  function popupFull(params) {
    if (typeof params === 'undefined' || !('url' in params || 'html' in params)) {
      return;
    }

    // Get popup
    var popupParams = {};
    popupParams.esc = !('esc' in params) || params.esc;
    popupParams.id = 'id' in params ? params.id : 'popup_full';
    popupParams['z-index'] = 'z-index' in params ? params['z-index'] : '30';
    popupParams['overlay'] = 'overlay' in params ? params['overlay'] : 'transparent';
    popupParams['width'] = 'width' in params ? params['width'] : '';

    var $popup = getPopup(popupParams);

    $popup.data('onEscape', params.onEscape);

    var $popupContent = $popup.find('.popup-content');

    if ('html' in params) {
      $popupContent.html(params.html);

      // Turn on popup    
      $popup.on();

      // Turn off popup
      $popup.find('[aria-click="close-popup"]').on('click', function () {
        $popup.off();
      });
    }
    else {
      // Url
      $.ajax({
        url: params.url,
        dataType: 'JSON'
      }).always(function () {
        if ('always' in params) {
          params['always']();
        }
      }).done(function (data) {
        if (data.status == 0) {
          $popupContent.html(data.result);

          // Turn on popup    
          $popup.on();

          // Turn off popup
          $popup.find('[aria-click="close-popup"]').on('click', function () {
            $popup.off();
          });

          if ('success' in params) {
            params['success']($popup);
          }
        }
        else {
          $popup.remove();

          if ('fail' in params) {
            params['fail']();
          }
        }
      }).fail(function () {
        $popup.remove();

        if ('fail' in params) {
          params['fail']();
        }
      });
    }

    return $popup;
  }

  /*
  	title:
  		title of popup
  	content:
  		content of popup
  	type: (default)
  		type of popup
  	buttons: (escape button - default - Close)
  		array of button
  			text: (Button)
  				text of button
  			type: (default)
  				type of button
  			handle: (close popup)
  				handle on click button
  				return false if want prevent close
  	esc: (true)
  		allow escape popup with click outside or 'esc' key
    overlay: (transparent)
      transparent, gray
  	id: (popup_prompt)
  		id of popup.
  		if wanna show two popup, ids must different
  	z-index: (31)
  		z-index of popup
  	onEscape:
  		handle on popup escape

  */
  function popupPrompt(params) {
    if (typeof params === 'undefined') {
      params = {};
    }

    // Get popup

    var popupParams = { enterKey: true };
    popupParams.esc = !('esc' in params) || params.esc;
    popupParams.id = 'id' in params ? params.id : 'popup_prompt';
    popupParams['z-index'] = 'z-index' in params ? params['z-index'] : '31';
    popupParams['overlay'] = 'overlay' in params ? params['overlay'] : 'transparent';

    var $popup = getPopup(popupParams);

    $popup.data('onEscape', params.onEscape);

    // Get popup content

    var $popupContent = $popup.find('.popup-content');

    $popupContent.css({
        width: 'auto',
        height: 'auto'
    });

    var 
    	type = 'type' in params ? params.type : 'default',
    	title = 'title' in params ? params.title : null,
    	content = 'content' in params ? params.content : null,
    	buttons = 'buttons' in params ? params.buttons : null;

    var $box = $('<article class="box box-' + type + ' margin-0"></article>');

    $popupContent.html($box);

    // Popup title
    if (title) {
    	$box.append('<section class="box-header with-border"><h2 class="box-title">' + title + '</h2></section>');
    }

    // Popup content
    if (content) {
    	$box.append('<section class="box-body">' + content + '</section>');
    }

    // Popup buttons

    var $buttonContainter = $('<section class="box-footer text-center"></section>');
    $box.append($buttonContainter);

    if (buttons) {
    	$(buttons).each(function () {
    		var 
    			button = this,
    			text = 'text' in button ? button.text : 'Button',
    			type = 'type' in button ? button.type : 'default',
    			handle = 'handle' in button ? button.handle : null;

      	var $button = $('<button class="btn btn-flat btn-' + type + ' margin-5" ' + (button.primaryButton ? 'data-type="primary_button"' : '') + '>' + text + '</button>');

        $button.on('click', function () {
          if (handle) {
            if (handle() == false) {
              return;
            }
          }
          $popup.off($(this));
        });

      	$buttonContainter.append($button);
    	});
    }
    else {
      var $button = $('<button type="button" class="btn btn-flat btn-default margin-5">' + _t.form.close + '</button>');

      $button.on('click', function () {
        $popup.off($(this));
      });

      $buttonContainter.append($button);
    }

    // Turn on popup    
    $popup.on();

    // Turn off popup
    $popup.find('[aria-click="close-popup"]').on('click', function () {
      $popup.off();
    });
  }

  function errorPopup() {
    popupPrompt({
      title: _t.form.error_title,
      type: 'danger',
      content: _t.form.error_content
    });
  }

/* 
	/ Popup 
*/