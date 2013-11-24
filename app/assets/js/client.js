/**
 * Devbox entry point
 */

requirejs.config({
    baseUrl: '/plugins'
});

requirejs.onError = function (err) {

    var errorMsg = ['<p>There was an issue loading an app or dependency:</p><p>',
        err.message, '</p><p>Require.js error type: ', err.requireType, '</p><p>',
        'Please file a bug on the \
            <a href="http://github.com/mattpardee/drop/issues" target="_blank">\
            GitHub</a> repo. Afer closing this dialog you can switch to another application.</p>'].join('');

    $('#error-modal .modal-header h4').text('Require.js Error');
    $('#error-modal .modal-body').html(errorMsg);

    $('#error-modal').modal('show');

};

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
});
