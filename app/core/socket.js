define(function(require, exports, module) {

    var config = require('core/client-config'),
        routes = {};

    function registerInterface(name) {
        return {
            send : function(msg) {
                msg = (typeof msg === 'object' ? JSON.stringify(msg) : msg);
                ch.sendMessage({
                    route : name,
                    msg : msg
                });
            }
        };
    }

    function ConnectionHandler(host) {
        return {
            connect : function() {
                this.ws = new WebSocket(host);
                this.ws.onopen = function() {
                    console.log("connected");
                };

                this.ws.onmessage = function (evt) {
                    var data = evt.data;
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) {
                        return;
                    }

                    console.log(evt);
                    if (data.route) {
                        routes[data.route].onmessage(data);
                    }
                };

                this.ws.onclose = function() {
                    console.log("disconnected");
                };
            },

            register: function(appName, app) {
                var intface = registerInterface(appName);
                routes[appName] = {
                    app : app,
                    'interface' : intface
                };

                return intface;
            },

            sendMessage : function(msg) {
                msg = (typeof msg === 'object' ? JSON.stringify(msg) : msg);
                this.ws.send(msg);
            }
        };
    }

    var ch = new ConnectionHandler('ws://' + config.socket_url + ':' + config.socket_port);
    ch.connect();

    module.exports = ch;

});