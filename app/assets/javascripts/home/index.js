//some variables for feature
var $POPUP;

// #start start
$(function () {
    initial();

    initial_product_scroll();
})
// #end start

// #start initial
function initial () {
    //process scroll event of window
    $(window).on('scroll', function () {
        checkScroll();
    });

    //process top link
    $('.top-link > a').on('click', function () {
        slideToTop();
    });

    //process show popup
    $('.show-next').on('click', function () {
        showNext(this);
    });

    //process search toggle button
    $('#search-toggle-button').on('click', function () {
        toggleSearchBox();
    });

}
// #end initial

// #start checkScroll
function checkScroll() {
    if ($(window).scrollTop() > 400) {
        $('.top-link').fadeIn(200);
    }
    else {
        $('.top-link').fadeOut(200);
    }
}
// #end checkScroll

// #start slideToTop
function slideToTop() {
    $('html, body').animate({ scrollTop: 0 }, 300);
}
// #end slideToTop

// #start toggleSearchBox
function toggleSearchBox() {
    var $object = $('#search-box');

    //check toggle
    if ($object.css('display') == 'none') {
        //show
        $object.slideDown(500).css({
            'display': 'flex',
            'opacity': '1',
            'transition': 'opacity 0.5s 0.5s'
        });
    }
    else {
        //hide
        $object.css({
            'opacity': '0',
            'transition': 'opacity 0.5s'
        }).slideUp(500);
    }
}

// #start show next button
function showNext(object) {
    var $popup = $(object).next();

    if ($popup.css('display') == 'none') {
        //show
        $popup.fadeIn(300);
        $($(object).attr('data-focus')).focus();

        //check if have popup showing
        if ($POPUP != null) {
            $POPUP.hide();
        }

        $POPUP = $popup;
    }
    else {
        //hide
        $popup.fadeOut(300);

        $POPUP = null;
    }
}
// #end show next button

// #start initial_product_scroll
var start, startY;
var heightContainer = 472, heightAllItems;
var numberShowProduct = 5;

function initial_product_scroll() {
    //get product-container
    var $container = $('#product-container');


    //get all product columns
    var $columns = $container.find('.product-panel');

    //bind event for all columns
    $columns.on('mousedown', function(event) {
        mouseDown(this, event);
    })
};

function mouseDown(sender, e) {
    e.preventDefault();

    //get object
    var $object = $(sender);

    //get height, count of item
    var heightItem = $object.find('.item').height();
    var countItem = $object.find('.item').length;

    heightAllItems = 10 + (heightItem + 10) * countItem + 10;

    //get height of container
    //margin-top + (height-item + margin-bottom) * 5 + padding-bottom,top
    //heightContainer = 10 + (heightItem + 10) * numberShowProduct + 10;
    //$object.css('height', heightContainer + 'px');

    //get position
    start = parseInt($object.find('.product').css('top'));
    startY = e.clientY;

    //bind mousemove event for this sender
    $(window).on('mousemove.scroll', function(event) {
        mouseMove($object[0], event);
    });

    //bind event when release
    $(window).on('mouseup.scroll', function() {
        mouseUp($object[0]);
    });
}

function mouseMove(object, e) {
    //get current position
    currentY = e.clientY;

    var top = start + currentY - startY;

    if (top > 0) {
        top = 0;
    }
    else if (top < -(heightAllItems - heightContainer))
    {
        top = -(heightAllItems - heightContainer);
    }

    object = $(object).find('.product');
    object.css('top', top + 'px');

}

function mouseUp(object)
{
    $(window).off('.scroll');
}
// #end initial_product_scroll