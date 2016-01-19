$(document).ready(function () {
    var debug = false;

    var active = 0;

    var menuId = "#slide-menu";
    var toggleMenuButton = "#toggle-menu";
    var containerId = "#root .react-container";
    var pageId = "#page";

    var menuHeight = $(menuId).height();
    var menuWidth = $(menuId).width();

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    var animationDelay = 200;

    // Initialize mobile menu
    initialize();

    function initialize() {
        console.log('Initializing mobile menu...');

        // Adjust menu size & position
        adjust();

        // Move menu to #root container
        $(menuId).appendTo(containerId);

        $(toggleMenuButton).on("click", function (e) {
            e.preventDefault();
            if (active)
                close();
            else
                open();
        });

        $(window).on("resize", function () {
            adjust();
        });

        if(debug) open();
    }

    function adjust() {
        console.log('Adjusting mobile menu...');

        // Update vars
        menuHeight = $(menuId).height();
        menuWidth = $(menuId).width();

        windowHeight = $(window).height();
        windowWidth = $(window).width();

        if (active) { // If menu is active
            // Adjust #page content overflow
            lockScroll();
        }else { // If menu is not active
            // Move menu on standby position
            $(menuId).css('right', -menuWidth+'px');
        }
    }

    function open() {
        active = 1;

        // Show menu
        $(menuId).css('display', 'block');

        // Add transparent overlay on #page content
        $(pageId).addClass('menu-overlay');

        $(menuId).animate({
            right: 0,
        }, animationDelay, function() {
            // Animation complete.

            // Bind click to close menu on click on #page content
            bindPage();

            // Lock scroll position
            lockScroll();
        });
    }

    function close() {
        active = 0;

        // Remove transparent overlay on #page content
        $(pageId).removeClass('menu-overlay');

        $(menuId).animate({
            right: -menuWidth+'px',
        }, animationDelay, function() {
            // Animation complete.

            // Hide menu
            $(menuId).css('display', 'none');

            // Unbind #page
            unbindPage();

            // Unlock scroll position
            unlockScroll();
        });
    }

    function bindPage() {
        // Bind click on #page
        $(pageId).on("click", function (e) {
            e.preventDefault();
            if (active) {
                close();
            }
        });
    }

    function unbindPage() {
        $(pageId).off("click");
    }

    function lockScroll() {
        // Hide #page overflow to prevent content scrolling
        $(pageId).css('height', windowHeight+'px');
        $(pageId).css('overflow', 'hidden');
    }

    function unlockScroll() {
        // Restore the #page content overflow
        $(pageId).css('height', '');
        $(pageId).css('overflow', '');
    }
});
