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

	// init show Popup
	showPopup();
	
	//Set purpose
	setPurpose();

	// init MiniMenu
	initMiniMenu();
});

//endregion

// start popup
function showPopup() {	
	// Popup alert
	var $comingSoonPopup = $('[data-popup="coming-soon"]');
	$comingSoonPopup.on('click', function() {
		$('#coming_soon_popup').modal('show');
	});
	
	//Popup picture	
	var $picturePopup = $('#picture_popup');
	$('[data-popup="show-image"]').on('click', function() {
		var link = $(this).attr('data-src');

		$picturePopup.on('show.bs.modal', function() {
			var $img = $(this).find('img');
			$img.attr('src', link);			
		});
		$picturePopup.modal('show');
	});

}
// end

// start header
function initHeader() {
	$header = $('.header-fixed');
	var $coverWall = $('.cover-wall');
	
	var scroll = $window.scrollTop();
	$window.on('scroll', function(e) {		
		var currentScroll = $window.scrollTop();
		
		if (currentScroll != 0) {
			$header.addClass('fixed');
		} else {
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

// start initMiniMenu
function initMiniMenu() {
	$coverWall = $('.cover-wall');
	$window.on('click', function() {
		if ($coverWall.is(':visible')) {
			lockScrollBody(true);
		} else {
			lockScrollBody(false);
		}

		$coverWall.on('click', function(e) {		
			$(this).hide();
			lockScrollBody(false);
		});
		$('.cover-wall .mini-menu-content').on('click', function(e) {
			e.stopPropagation();
		});
	});	
}
// end

//start search-box
function initMore() {
	$('[data-function="show-search-plus"]').on('click', function () {
		var searchPlus = $('#more_search');
		searchPlus.fadeToggle(500);

		$('.btn-search-plus').fadeToggle();
	});
}
//end

// start ToggleElement
function initToggleElement($listObject, isFunction) {
	$listObject.off('click.on_off').on('click.on_off', function (e) {
		console.log(123);
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