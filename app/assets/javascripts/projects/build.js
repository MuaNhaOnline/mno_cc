var project_id;

var $draggingItem = null;
var $startFloor = null;
var startIndex;
var isCancel;
var isDuplicate;

var $building;

$(function () {
    $building = $('#building');

    init_CreateFloorButton($('[data-function="create-floor"]'));
    init_Floor($('.floor-container'));
    init_Item($('.groups .item'));
})

function init_Floor($floorContainers) {
    //Set sum item's width of floor
    $floorContainers.find('.floor').each(function () {
        var width = 0;
        $floor = $(this);
        $floor.find('.item').each(function () {
            width +=  parseFloat(this.getAttribute('data-width'));
        });
        $floor.attr('data-width', width);

        setWidthItemsInFloor($floor);
    });

    //Init copy button
    $floorContainers.find('[data-function="copy"]').on('click', function () {
        var copyNumber = prompt('Bạn muốn sao chép bao nhiêu tầng?');

        $floor = $(this).parents('.floor-container');
        for (var i = 0; i < copyNumber; i++) {
            $floor.before($floor.clone(true));
        }

        setFloorNumber();
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
                $draggingItem = $(this).clone(true);
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
    width = parseFloat($floor.attr('data-width'));

    $floor.find('.item').each(function () {
        this.style.width = parseFloat(this.getAttribute('data-width')) / width * 100 + '%';
    });
}

function init_CreateFloorButton($button) {
    $button.on('click', function() {
        $new_floor = $('\
		<li class="floor-container">\
            <ul class="floor" data-width="0">\
            </ul>\
            <a class="open-functions-button">\
            </a>\
            <ul class="functions-container">\
               <li>\
                  <a data-function="copy" href="javascript:void(0)">Sao chép thêm dòng</a>\
               </li>\
            </ul>\
     	</li>\
		');

        $building.prepend($new_floor);

        init_Floor($new_floor);
    });
}