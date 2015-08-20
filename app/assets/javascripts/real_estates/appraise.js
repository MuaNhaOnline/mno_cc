$(function () {
  var $list = $('#re_list');

  initPagination();
  initAppraisalCompany();

  /*
    Appraisal company
  */

  function initAppraisalCompany() {
    $list.find('[aria-click="edit-appraisal-company"]').on('click', function () {
      var 
        $row = $(this).closest('tr'),
        $html = $('<article style="width: 300px; max-width: 80vw" class="box box-solid box-default"><form class="form box-body"><article class="form-group"><input name="ac" aria-input-type="autocomplete" class="form-control" /></article><article class="text-center"><button class="btn btn-primary btn-flat">ASD</button> <button class="btn btn-default btn-flat">def</button></article></form></article>');

      initForm($html.find('form'), {

      });

      popupFull({
        html: $html
      });
    });
  }

  /*
    Appraisal company
  */

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
        }
      }
    );
  }

  /*
    / Pagination
  */
});