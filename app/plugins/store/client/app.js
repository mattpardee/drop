define(function(require, exports, module) { 

    var html = require("text!store/client/store.html");
    var css = require("text!store/client/store.css");

    module.exports = {
        /**
         * Called before init so we can load HTML into the container
         * or do other tasks before we fully initialize the plugin
         *
         * @param function cb Callback to call with our CSS & HTML
         */
        preInit : function(cb) {
            cb(css, html);
        },

        init : function() {
        },

        onmessage : function() {

        },

        destroy : function() {

        }
    };
});
