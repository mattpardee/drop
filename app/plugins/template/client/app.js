define(function(require, exports, module) { 

    var html = require("text!template/client/template.html"),
        css  = require("text!template/client/template.css");

    module.exports = {
        /**
         * Called before init so we can load HTML into the container
         * or do other tasks before we fully initialize the plugin
         * @param object s Socket to communicate with the server
         * @param function cb Callback to call with our CSS & HTML
         */
        preInit : function(s, cb) {
            this.socket = s;
            cb(css, html);
        },

        init : function() {
            console.log("Template inited");
        },

        onmessage : function() {

        },

        destroy : function() {

        }
    };
});
