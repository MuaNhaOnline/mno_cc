var _temp = {};

/*
  url(*)
  data
    data pass to url
    {} or function return {}
  list
    list to display
  pagination
    pagination display
  done
    handle after load success
    function(content, note)
  fail
    handle after load empty or fail
    function()
  page(1)
    page display
*/
function _initPagination(params) {
  // Check if have not params or url
  if (typeof params === 'undefined' || typeof params.url === 'undefined') {
    return;
  }

  _temp['is_finding'] = false;

  var lastData = { page: params['page'] || 1 };

  // Find function
  /*
    url
    data
      data pass to find
    note
  */
  var find = function (findParams) {
    if (typeof findParams === 'undefined') {
      findParams = {};
    }

    /*
      Get data
    */

    // data of params
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

    // data of find params

    if ('data' in findParams) {
      data = $.extend(data, findParams['data']);
    }

    lastData = data;

    /*
      / Get data
    */

    if (_temp.isSearching) {
      _temp.isSearching.abort();
    }

    // Get url
    var url = findParams['url'] || params['url'];

    _temp.isSearching = $.ajax({
        url: url,
        data: data,
        dataType: 'JSON'
    }).always(function () {
      _temp.isSearching = false;
    }).done(function (data) {
      if (data.status == 0) {
        // callback afterLoad or replace list
        if ('done' in params) {
          params['done'](data.result.list, findParams.note);
        }
        else {
          if ('list' in params) {
            params['list'].html(data.result.list); 
          }
        }

        // replace pagination
        if ('pagination' in params) {
          params['pagination'].html(data.result.pagination);
          initPagination(); 
        }
      }
      else {
        if ('fail' in params) {
          params['fail'](findParams.note);
        }
        // empty pagination
        if ('pagination' in params) {
          params['pagination'].empty();
        }
      }
    }).fail(function (xhr, status) {
      if (status != 'abort') {
        if ('fail' in params) {
          params['fail'](findParams.note);
        }
        // empty pagination
        if ('pagination' in params) {
          params['pagination'].empty();
        }
      }
    });
  }

  if ('pagination' in params) {
    function initPagination(page) {
      params['pagination'].find('[aria-click="paging"]').on('click', function () {
        lastData['page'] = $(this).data('page');
        find({ data: lastData });
      });

      params['pagination'].find('[aria-click="prev-page"]').on('click', function () {
        lastData['page'] = lastData['page'] - 1;
        find({ data: lastData });
      });

      params['pagination'].find('[aria-click="next-page"]').on('click', function () {
        lastData['page'] = lastData['page'] + 1;
        find({ data: lastData });
      });
    }

    initPagination(params['page'] || 1);
  }

  return find;
}