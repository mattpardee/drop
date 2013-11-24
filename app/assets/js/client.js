/**
 * Devbox entry point
 */

requirejs.config({
    baseUrl: '/plugins'
});

define(function(require, exports, module) {
    var app_container = document.getElementById("app_container"),
        top_bar = document.getElementById("top_navbar"),
        topBarHeight = top_bar.getBoundingClientRect().height;

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
    var plugin = require("../../plugins/todo/client/app");
    if (plugin.preInit) {
        plugin.preInit(function(html) {
            app_container.innerHTML = html;
            plugin.init();
        });
    }
    else {
        plugin.init();
    }
});
