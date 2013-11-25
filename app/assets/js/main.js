/**
 * Devbox entry point
 *
 * Does some configuration and then loads Drop core.
 */

requirejs.config({
    baseUrl: '/plugins',
    paths : {
        core: '../core'
    }
});

requirejs.onError = function (err) {

    var errorMsg = ['<p>Oh boy. There was an issue loading an app or dependency.</p><p>',
        err.message, '</p><p>Require.js error type: ', err.requireType, '</p><p>',
        'Please copy the above text and file a bug on the \
        <a href="http://github.com/mattpardee/drop/issues" target="_blank">\
        GitHub</a> repo. Afer closing this dialog you can switch to another application.</p>'].join('');

    $('#error-modal .modal-header h4').text('Loading Error');
    $('#error-modal .modal-body').html(errorMsg);
    $('#error-modal').modal('show');

};

define(function(require, exports, module) {
    require('core/main');
});
