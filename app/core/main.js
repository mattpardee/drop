define(function(require, exports, module) {
    var app_container = document.getElementById("app_container"),
        top_bar = document.getElementById("top_navbar"),
        topBarHeight = top_bar.getBoundingClientRect().height,
        socket = require('core/socket');

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

            // We have loaded the plugin, let's set some vars and initialize
            if (typeof plugin.preInit === 'function') {
                plugin.preInit(socket.register(appName), function(css, html) {
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
});
