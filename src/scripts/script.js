$(document).on('load', init());

function init() {
    buildMenu();
    scroller();
}

function buildMenu() {
    var sections = $('.section');
    var menu = $('#menu .navbar-nav');

    for (var i = 0; i < sections.length; i++) {
        var item = sections[i];
        var id = $(item).attr('id');

        if (id !== 'banner') {
            var href = id;
            var label = id.charAt(0).toUpperCase() + id.slice(1);
            var menuItem = '<li class="nav-item">';
            menuItem    += '<a class="nav-link" href="#' + href + '">' + label + '</a>';
            menuItem    += '</li>';

            $(menu).append(menuItem);
        }
    }
}

function scroller() {
    var $root = $('html, body');

    $('#menu a').click(function () {
        var href = $.attr(this, 'href');

        $root.animate({
            scrollTop: $(href).offset().top
        }, 500, 'swing', function () {
            window.location.hash = href;
        });

        return false;
    });

    $('a.navbar-brand').click(function () {
        var href = $.attr(this, 'href');

        $root.animate({
            scrollTop: 0
        }, 500, 'swing', function () {
            window.location.hash = href;
        });

        return false;
    });
}