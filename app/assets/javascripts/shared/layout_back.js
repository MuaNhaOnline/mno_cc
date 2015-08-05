var $body, _temp = {}, _t = {};

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

      $popup.trigger('onEscape');
  };

  return $popup;
}

/*
  tieuDe: Không bắt buộc
    Tiêu đề của thông báo
  thongBao: Không bắt buộc
      Đoạn thông báo
  bieuTuong: Không bắt buộc (chỉ sử dụng được khi có thông báo)
      Biểu tượng trước thông báo
      Gồm: thanh-cong, nguy-hiem, thong-tin, canh-bao, hoi
  nut: Mặc định: Nút thoát
      Danh sách nút xử lý ở thông báo
      Gồm:
          ten: Mặc định: Nút xử lý
              Tên của nút
          loai: Mặc định: chap-nhan
              Loại nút (chap-nhan, thong-tin, can-than,....)
          * Có 2 loại xử lý:
              href: Không bắt buộc
                  Nút đường dẫn
                  Ưu tiên hơn nếu có cả href & xuLy
              xuLy: Mặc định: Tắt popup
                  Xử lý khi nhấn vào nút
                  Trả về false nếu muốn chặn tắt popup
  esc: Mặc định: true
      Cho phép bấm ra ngoài là tắt popup
  id, z-index: Trường hợp muốn trùng
*/
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

  $popup = getPopup(popupParams);

  if ('onEscape' in params) {
    $popup.one('onEscape', function () {
      params.onEscape();
    });
  }

  // Get popup content

  $popupContent = $popup.find('.popup-content');

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

function moneyFormat(number, separate){
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
  return string.indexOf(key) != -1;
}

listString.add = function (key, string) {
  if (listString.has(key, string)) {
    return string;
  }
  
  return string + ' ' + key;
}

listString.remove = function (key, string) {
  return string.replace(new RegExp(key, 'g'), '');
}

/*
  / String
*/