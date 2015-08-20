$(function () {
  var $list = $('#re_list');

  initPagination();

  /*
    Pagination
  */

  function initPagination() {
    _initSearchablePagination(
      $list,
      $('#search_form'),
      $('#pagination'), 
      {
        url: '/real_estates/_appraise_list',
        afterLoad: function (content) {
          $list.html(content);
          initDelete();
      }
    });
  }

  /*
    / Pagination
  */
});