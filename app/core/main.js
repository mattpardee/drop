define(function(require, exports, module) {
    console.log("Requirin'");
    var app_container = document.getElementById("app_container"),
        top_bar = document.getElementById("top_navbar"),
        topBarHeight = top_bar.getBoundingClientRect().height,
        ConnectionHandler = require('core/socket');

    function resize() {
        app_container.style.height = window.innerHeight - topBarHeight + "px";
    }

    window.addEventListener('resize', function() {
        resize();
    });

    resize();

    // Set up JS functionality
    $('.dropdown-toggle').dropdown();

    // To test, let's load a plugin
    var path = location.pathname.split("/");

    if (path.length > 2 && path[1] === 'apps') {
        var appName = path[2];
        require(['/plugins/' + appName + '/client/app.js'], function(plugin) {
            if (typeof plugin.preInit === 'function') {
                plugin.preInit(function(css, html) {
                    app_container.innerHTML = [
                        '<style type="text/css">',
                        css,
                        '</style>',
                        html].join('\n');

                    plugin.init();
                });
            }
            else {
                plugin.init();
            }
        });
    }
    else {
        // Load up the dashboard view
    }

    var ch = new ConnectionHandler('ws://' + location.hostname + ':1530');
    ch.connect();
});
