var $body, _temp = {};

$(function () {
	$body = $('body');

  $('#loading_page').remove();
  
  customPrototype();
  customJquery();
});

/*
  Custom property
*/

function customPrototype() {
  String.prototype.format = function(replace) {
    var string = this;
    for (var key in replace) {
      string = string.replace(new RegExp("\\{" + key + "\\}", "g"), replace[key]);
    }
    return string;
  }

  String.prototype.toSentenceCase = function() {
    return this.toLowerCase().replace(/^(.)|\s(.)/g, function(char) { return char.toUpperCase(); });
  }
}

/*
  / Custom property
*/

/*
  Custom jquery
*/

function customJquery() {

}

/*
  / Custom jquery
*/

/*
  Helper
*/

function toggleLoadStatus(on) {
  if (on) {
    $body.addClass('loading');
  }
  else {
    $body.removeClass('loading');
  }
}

function canSee($item) {
  var topW = $body.scrollTop();
  var heightW = window.innerHeight;
  var bottomW = topW + heightW;

  var topI = $item.offset().top;
  var heightI = $item.height()
  var bottomI = topI + heightI;

  if (heightW > heightI) {
    if ((topW < topI && topI < bottomW) ||
      (topW < bottomI && bottomI < bottomW)) {
      return true;
    }
  }
  else if ((topI < bottomW && bottomW < bottomI) ||
    (topI < topW && topW < bottomI)) {
    return true;
  }

  return false;
}

function dataURLToBlob(dataURL, type) {
  var 
    byteString = atob(dataURL.split(",")[1]),
    ab = new ArrayBuffer(byteString.length),
    ia = new Uint8Array(ab),
    i;

  for (i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], {
    type: type
  });
}

/*
  / Helper
*/

/* 
	Popup 
*/

/*
	params:
		id: (popup_full)
			id of popup.
			if wanna show two popup, ids must different
		z-index: (30)
			z-index of popup
		esc: (true)
			allow escape popup with click outside or 'esc' key
*/

function getPopup(params) {
  if (typeof(params) === 'undefined')
  {
    params = {};
  }

  var id = ('id' in params) ? params.id : 'popup_full';
  var zIndex = 'z-index' in params ? params['z-index'] : '30';
  var esc = !('esc' in params) || params.esc

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

  if (esc) {
    $popup.attr('aria-esc', '');
  }
  else {
    $popup.removeAttr('aria-esc');
  }

  $popup.on = function () {
    $popup.addClass('on');
    $(document).on('keydown.turn_off_popup_' + id, function (e) {
      if ($popup.is('[aria-esc]')) {
        if (e.keyCode == 27) {
          $popup.off();
        }
      }
    });
    $body.addClass('no-scroll');
  }

  $popup.off = function () {
    $popup.removeClass('on');
    $(document).off('keydown.turn_off_popup_' + id);
    $body.removeClass('no-scroll');

    // $popup.trigger('onEscape');
    if ($popup.data('onEscape')) {
      $popup.data('onEscape')();
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

  var $popup = getPopup(popupParams);

  $popup.data('onEscape', params.onEscape);

  var $popupContent = $popup.find('.popup-content');

  if ('html' in params) {
    $popupContent.html(params.html);

    // Turn on popup    
    $popup.on();

    return $popup
  }
  else {
    // URL
  }
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

  var popupParams = {};
  popupParams.esc = !('esc' in params) || params.esc;
  popupParams.id = 'id' in params ? params.id : 'popup_prompt';
  popupParams['z-index'] = 'z-index' in params ? params['z-index'] : '31';

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

    	var $button = $('<button class="btn btn-' + type + ' margin-5">' + text + '</button>');

      $button.on('click', function () {
        if (handle) {
          if (handle() == false) {
            return;
          }
        }
        $popup.off();
      });

    	$buttonContainter.append($button);
  	});
  }
  else {
    var $button = $('<button type="button" class="btn btn-default margin-5">Close</button>');

    $button.on('click', function () {
      $popup.off();
    });

    $buttonContainter.append($button);
  }

  // Turn on popup    
  $popup.on();
}

/* 
	/ Popup 
*/

/*
  Format
*/

function moneyFormat(number, separate) {
  if (typeof separate === 'undefined') {
    separate = ',';
  }

  return insertSeparate(number, separate);
}

function insertSeparate(number, separate) {
  if (number.length > 3) {
    return insertSeparate(number.slice(0, number.length - 3), separate) + separate + number.slice(number.length - 3);
  }
  return number;
}

function intFormat(string) {
  return string.replace(/\D/g, '');
}

/*
  / Format
*/

/*
  String
*/

var listString = {};

listString.has = function (key, string) {
  if (string) {
    return string.split(' ').indexOf(key) != -1; 
  }
  else {
    return false;
  }
}

listString.add = function (key, string) {
  if (!string) {
    return key;
  }

  if (listString.has(key, string)) {
    return string;
  }
  
  return string + ' ' + key;
}

listString.remove = function (key, string) {
  if (string) {
    return string.replace(new RegExp(key, 'g'), ''); 
  }
  else {
    return '';
  }
}

/*
  / String
*/

/*
  Pagination
*/

/*
  $list: List content
  $pagination: Pagination
  params:
    url: *required*
      Url action get content
      With page param
    data: 
    Data will be pass to url
      {} or func return {}
    afterLoad:
      init after fill new page
      param: result
    page: 1
      default page
*/
function _initPagination($list, $pagination, params) {
  if (typeof params === 'undefined' || typeof params.url === 'undefined') {
    return;
  }

  $pagination.find('[data-page="' + (params.page || 1) + '"]').parent().addClass('active');

  $pagination.find('[aria-click="paging"]').on('click', function () {
    var 
      $button = $(this),
      $parent = $button.parent();

    if ($parent.hasClass('active')) {
      return;
    }

    var data;
    if ('data' in params) {
      if (typeof params.data === 'function') {
        data = params.data();
      }
      else {
        data = params.data;
      }
    }

    if (typeof (data) !== 'object') {
      data = {}
    }

    data.page = $button.data('page');

    toggleLoadStatus(true);
    $.ajax({
      url: params.url,
      data: data,
      dataType: 'JSON'
    }).always(function () {
      toggleLoadStatus(false);
    }).done(function (data) {
      if (data.status == 0) {
        if ('afterLoad' in params) {
          var result = params.afterLoad(data.result);

          if (result) {
            $list.html(result);
          }
        }
        else {
          $list.html(data.result);
        }

        $parent.siblings('.active').removeClass('active');
        $parent.addClass('active');
      }
      else {
        popupPrompt({
          title: _t.form.error_title,
          type: 'danger',
          content: _t.form.error_content
        })
      }
    }).fail(function () {
      popupPrompt({
        title: _t.form.error_title,
        type: 'danger',
        content: _t.form.error_content
      })
    });
  });
}

/*
  / Pagination
*/

/*
  Search & pagination
*/

/*
  $list: List content
  $search: Search form
  $pagination: Pagination
  params:
    url: *required*
      Url action get content
      With page param
    data: 
      Data will be pass to url
      {} or func return {}
    afterLoad: func (result list, note)
      init after fill new page
      param: result
    ifEmpty: func (params(note))
      function will be execute
      return false if want to keep defaults
    page: 1
      default page
*/
function _initSearchablePagination($list, $search, $pagination, params) {
  if (typeof params === 'undefined' || typeof params.url === 'undefined') {
    return;
  }

  var
    keyword = '',
    currentPage = params.page || 1;

  _temp.isSearching = false;

  $pagination.find('[data-page="' + currentPage + '"]').parent().addClass('active');

  /*
    searchParams:
      page
      keyword
      note
  */
  $search.search = function (searchParams) {
    if (typeof searchParams === 'undefined') {
      searchParams = {}
    }

    var data;
    if ('data' in params) {
      if (typeof params.data === 'function') {
        data = params.data();
      }
      else {
        data = params.data;
      }
    }

    if (typeof data !== 'object') {
      data = {}
    }

    page = searchParams.page || 1

    if ('keyword' in searchParams) {
      data.keyword = searchParams.keyword;
    }
    else {
      data.keyword = keyword;
    }
    data.page = page;

    if (_temp.isSearching) {
      _temp.isSearching.abort();
    }

    _temp.isSearching = $.ajax({
        url: params.url,
        data: data,
        dataType: 'JSON'
    }).always(function () {
      _temp.isSearching = false;
    }).done(function (data) {
      if (data.status == 0) {
        currentPage = page;
        console.log(data);

        if ('afterLoad' in params) {
          var result = params.afterLoad(data.result.list, searchParams.note);

          if (result) {
            $list.html(result);
          }
        }
        else {
          $list.html(data.result.list);
        }

        $pagination.html(data.result.pagination);
        initPagination();

        search_no_result(true);
      }
      else {
        if ('ifEmpty' in params) {
          if (params.ifEmpty(searchParams.note) === false) {
            search_no_result();
          }
        }
        else {
          search_no_result();
        }
        $pagination.empty();
      }
    }).fail(function (xhr, status) {
      if (status !== 'abort') {
        if ('ifEmpty' in params) {
          params.ifEmpty(searchParams.note);
        }
        else {
          search_no_result();
        }
        $pagination.empty();
      }
    });

    function search_no_result(off) {
      if (off) {
        if ($list.is('tbody')) {
          $list.closest('table').next().text('');
        }
      }
      else {
        if ($list.is('tbody')) {
          $list.html('');
          $list.closest('table').next().text(_t.form.search_no_result);
        }
        else {
          $list.html('<section class="callout callout-default no-margin">' + _t.form.search_no_result + '</section>');  
        } 
      }
    }
  }

  $pagination.update = function () {
    $pagination.find('.active').removeClass('active');
    $pagination.find('[data-page="' + currentPage + '"]').parent().addClass('active');
  }

  initForm($search, {
    submit: function () {
      keyword = $search.find('[name="keyword"]').val();
      $search.search();
    }
  });

  function initPagination() {
    $pagination.update();

    $pagination.find('[aria-click="paging"]').on('click', function () {
      $search.search({
        page: $(this).data('page')
      });
    });    
  }

  initPagination();
}

/*
  / Search & pagination
*/