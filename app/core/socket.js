define(function(require, exports, module) {
    function ConnectionHandler(host) {
        return {
            connect : function() {
                this.ws = new WebSocket(host);
                this.ws.onopen = function() {
                    console.log("connected");
                };

                this.ws.onmessage = function (evt) {
                    console.log(evt);
                };

                this.ws.onclose = function() {
                    console.log("disconnected");
                };
            },

            sendMessage : function(msg) {
                msg = (typeof msg === 'object' ? JSON.stringify(msg) : msg);
                this.ws.send(msg);
            }
        };
    }

    module.exports = ConnectionHandler;
});
