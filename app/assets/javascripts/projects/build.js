/* global init_PopupFull */
/* global $ */

var $draggingItem = null;
var $startFloor = null;
var startIndex;
var isCancel;
var isDuplicate;

var
  $blocksList,
  $blockBuildConTainer,
  $building,
  $itemGroupsList,
  $buildForm;

var
  currentBlock;


$(function () {
  $blocksList = $('#blocks_list');
  $blockBuildConTainer = $('#block_building_container');

  init_CreateBlockButton($blocksList.find('[data-function="create-block"]'));
  init_BuildBlockButton($blocksList.find('[data-function="build-block"]'));
});

function init_Floor($floorContainers) {
  //Set sum item's width of floor
  $floorContainers.find('.floor').each(function () {
    var width = 0;
    var $floor = $(this);
    $floor.find('.item').each(function () {
        width +=  parseFloat(this.getAttribute('data-width'));
    });
    $floor.attr('data-width', width);

    setWidthItemsInFloor($floor);
  });

  //Init copy button
  $floorContainers.find('[data-function="copy"]').on('click', function () {
    var copyNumber = parseInt(prompt('Bạn muốn sao chép bao nhiêu tầng?'));

    var $floor = $(this).parents('.floor-container');
    for (var i = 0; i < copyNumber; i++) {
        $floor.before($floor.clone(true));
    }

    setFloorNumber();
  });

  $floorContainers.find('[data-function="delete"]').on('click', function () {
    if (!confirm('Bạn có chắc muốn xóa tầng này?')) {
      return;
    }
    $(this).parents('.floor-container').remove(); 
  })

  //Init items
  init_Item($floorContainers.find('.item'));

  //Set floor number
  setFloorNumber();
}

function setFloorNumber() {
  var $floorContainers = $building.children();

  var index = $floorContainers.length;
  $floorContainers.each(function () {
    this.setAttribute('data-floor-number', index--);
  });
}

function init_Item($item) {
    $item.prop('draggable', true).on({
        'dragstart.build_item': function (e) {
            e = e.originalEvent;

            isDuplicate = e.shiftKey || $(this).is('.groups .item');

            if (isDuplicate) {
                $draggingItem = $(this).clone(true).removeAttr('data-value');
            }
            else {
                $draggingItem = $(this);
                $startFloor = $draggingItem.parent();
                startIndex = $draggingItem.index();
            }

            isCancel = true;

            $draggingItem.addClass('dragging');

            e.dataTransfer.setDragImage($('<span></span>')[0], 0, 0);

            $('.floor').on({
                'dragover.build_item': function (e) {
                    e = e.originalEvent;
                    e.preventDefault();

                    var
                        $floor = $(this),
                        $last_floor = $draggingItem.parent(),
                        otherItemsInFloor = $floor.find('.item').not($draggingItem);

                    if (otherItemsInFloor.length == 0) {
                        $floor.append($draggingItem);

                        if (!$floor.is($last_floor)) {
                            var draggingItemWidth = parseFloat($draggingItem.attr('data-width'));

                            $last_floor.attr('data-width', parseFloat($last_floor.attr('data-width')) - draggingItemWidth);
                            setWidthItemsInFloor($last_floor);
                            $floor.attr('data-width', parseFloat($floor.attr('data-width')) + draggingItemWidth);
                            setWidthItemsInFloor($floor);
                        }
                    }

                    otherItemsInFloor.each(function() {
                        var xPosition = $(this).offset().left;

                        if (xPosition <= e.clientX && e.clientX <= xPosition + this.offsetWidth) {
                            if (e.clientX < xPosition + this.offsetWidth / 2) {
                                $(this).before($draggingItem);
                            }
                            else {
                                $(this).after($draggingItem);
                            }

                            if (!$floor.is($last_floor)) {
                                var draggingItemWidth = parseFloat($draggingItem.attr('data-width'));

                                $last_floor.attr('data-width', parseFloat($last_floor.attr('data-width')) - draggingItemWidth);
                                setWidthItemsInFloor($last_floor);
                                $floor.attr('data-width', parseFloat($floor.attr('data-width')) + draggingItemWidth);
                                setWidthItemsInFloor($floor);
                            }

                            return false;
                        }
                    });
                },
                'drop.build_item': function () {
                    isCancel = false;
                }
            });

            $('.groups').on({
                'dragover.build_item': function (e) {
                    e.preventDefault();

                    var $currentFloor = $draggingItem.parent();
                    $currentFloor.attr('data-width', parseFloat($currentFloor.attr('data-width')) - parseFloat($draggingItem.attr('data-width')));
                    setWidthItemsInFloor($currentFloor);

                    $draggingItem.appendTo('<span></span>');
                },
                'drop.build_item': function () {
                    $draggingItem.remove();
                }
            });
        },
        'dragend.build_item': function () {
            if (isCancel) {
                var $currentFloor = $draggingItem.parent();

                if (isDuplicate) {
                    var draggingItemWidth = parseFloat($draggingItem.attr('data-width'));
                    $currentFloor.attr('data-width', parseFloat($currentFloor.attr('data-width')) - draggingItemWidth);

                    $draggingItem.remove();

                    setWidthItemsInFloor($currentFloor);
                }
                else {
                    if ($startFloor.is($currentFloor)) {
                        var currentIndex = $draggingItem.index();

                        if (currentIndex < startIndex) {
                            $startFloor.find('.item:nth-child(' + (startIndex + 1) + ')').after($draggingItem);
                        }
                        else if (currentIndex > startIndex) {
                            $startFloor.find('.item:nth-child(' + (startIndex + 1) + ')').before($draggingItem);
                        }
                    }
                    else {
                        draggingItemWidth = parseFloat($draggingItem.attr('data-width'));
                        $currentFloor.attr('data-width', parseFloat($currentFloor.attr('data-width')) - draggingItemWidth);
                        $startFloor.attr('data-width', parseFloat($startFloor.attr('data-width')) + draggingItemWidth);

                        if (startIndex == 0) {
                            $startFloor.prepend($draggingItem);
                        }
                        else {
                            $startFloor.find('.item:nth-child(' + startIndex + ')').after($draggingItem);
                        }

                        setWidthItemsInFloor($currentFloor);
                        setWidthItemsInFloor($startFloor);
                    }
                }
            }

            $draggingItem.removeClass('dragging');
            $draggingItem = null;

            $('.floor').off('.build_item');
        }
    });
}

function setWidthItemsInFloor($floor) {
    var width = parseFloat($floor.attr('data-width'));

    $floor.find('.item').each(function () {
        this.style.width = parseFloat(this.getAttribute('data-width')) / width * 100 + '%';
    });
}

function init_CreateFloorButton($button) {
  $button.on('click', function() {
    var $new_floor = $('\
      <li class="floor-container">\
        <ul class="floor" data-width="0">\
        </ul>\
        <a class="open-functions-button">\
        </a>\
        <ul class="functions-container">\
          <li>\
            <a data-function="copy" href="javascript:void(0)">Sao chép</a>\
          </li>\
          <li>\
            <a data-function="delete" href="javascript:void(0)">Xóa</a>\
          </li>\
        </ul>\
   	  </li>\
    ');

    $building.prepend($new_floor);

    init_Floor($new_floor);
  });
}

function init_SaveBuildingButton($button) {
  $button.on('click', function () {
    var $floorContainers = $building.children()
    var floorCount = $floorContainers.length;

    var 
      itemsList = [],
      itemList_Existed = {};


    $floorContainers.each(function (index) {
      var floorNumber = index + 1;
      var $floor = $(this).find('.floor');

      $floor.children().each(function (position) {
        var $item = $(this);

        if (this.hasAttribute('data-value')) {
          console.log(1);
          itemList_Existed[$item.attr('data-value')] = {
            item_group_id: $item.attr('data-group'),
            block_id: currentBlock,
            floor_number: floorNumber,
            position: position
          }
        }
        else {
          itemsList.push({
            item_group_id: $item.attr('data-group'),
            block_id: currentBlock,
            floor_number: floorNumber,
            position: position
          }) 
        }
      });
    });

    $.ajax({
      url: '/blocks/build/' + currentBlock,
      method: 'PUT',
      data: {
        floor_number: floorCount,
        items_list: JSON.stringify(itemsList),
        items_list_existed: JSON.stringify(itemList_Existed)
      },
      dataType: 'JSON'
    }).done(function (data) {
      console.log(data);
    }).fail(function () {
      console.log(123)
    });
  })
}

function init_CreateBlockButton($button) {
  init_PopupFull($button, {
    url: '/blocks/create/' + project_id,
    width: '600px',
    done: function ($content) {
      var $form = $content.find('#create_block_form');

      init_SubmitForm($form, {
        scroller: $content,
        submit: function () {
          $.ajax({
            url: '/blocks/create',
            method: 'POST',
            data: $form.serialize(),
            dataType: 'JSON'
          }).done(function (data) {
            if (data.status == 1) {
              $content.trigger('close');

              var newBlock = data.result;
              var $newBlockListItem = $('\
                <li>\
                  <a class="block" data-function="build-block" data-value="' + newBlock.id + '" href="javascript:void(0)">\
                    ' + newBlock.name + '\
                  </a>\
                </li>\
              ');
              init_BuildBlockButton($newBlockListItem.find('[data-function="build-block"]'));
              $blocksList.children(':last-child').before($newBlockListItem);
            }
            else {
              alert('Thất bại');
            }
          }).fail(function () {
            alert('Thất bại');
          });
        }
      });
    }
  });
}

function init_BuildBlockButton($buttons) {
  $buttons.on('click', function () {
    var $button = $(this);

    $.ajax({
      url: '/blocks/build/' + $button.attr('data-value'),
      dataType: 'JSON'
    }).done(function (data) {
      if (data.status == 1) {
        currentBlock = $button.attr('data-value');

        $buildForm =  $(data.result);
        $building = $buildForm.find('#building');
        $itemGroupsList = $buildForm.find('#groups_list');

        init_CreateFloorButton($buildForm.find('[data-function="create-floor"]'));
        init_CreateItemGroupButton($buildForm.find('[data-function="create-item-group"]'));
        init_SaveBuildingButton($buildForm.find('[data-function="save-building"]'));
        init_Floor($buildForm.find('.floor-container'));
        init_Item($buildForm.find('.groups .item'));

        $blockBuildConTainer.html($buildForm);
      }
      else {
        alert('Thất bại');
      }
    }).fail(function () {
      alert('Thất bại');
    })
  })
}

function init_CreateItemGroupButton($button) {
    init_PopupFull($button, {
      url: '/item_groups/create/' + currentBlock,
      width: '600px',
      done: function ($content) {
        var $form = $content.find('#create_item_group_form');

        init_SubmitForm($form, {
          scroller: $content,
          submit: function () {
            $.ajax({
              url: '/item_groups/create',
              method: 'POST',
              data: $form.serialize(),
              dataType: 'JSON'
            }).done(function (data) {
              if (data.status == 1) {
                $content.trigger('close');

                var itemGroup = data.result;

                var $htmlItemGroup = $('\
                  <li class="item" data-width="' + itemGroup.width_x + '" data-group="' + itemGroup.id + '">\
                    ' + itemGroup.name + '\
                  </li>\
                ');

                init_Item($htmlItemGroup);

                $itemGroupsList.children(':last-child').before($htmlItemGroup);
              }
              else {
                alert('Thất bại');
              }
            }).fail(function () {
              alert('Thất bại');
            });
          }
        })
      }
    });
}