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

	// init tab
	
});

//endregion

// start scroll header
function initHeader() {
	var header = $('.header-fixed');
	var logo = $('.logo');

	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		
		if (scroll != 0) {
			$(header).css('height', '46px');
			$(logo).css('width', '180px');		
		}
		else {
			$(header).css('height', '60px');
			$(logo).css('width', '220px');
		}
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