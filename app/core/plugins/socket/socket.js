/**
 * A module to provide a WebSocket server and interface
 * for plugins to receive and send messages via
 */

module.exports = function setup(options, imports, register) {  
 
  var WebSocketServer = require('ws').Server,
      wss = new WebSocketServer({port: 1530}),
      interfaces = {};

  /**
   * Websocket handling -- utility methods
   */

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1);
  }

  function generateGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
  }

  var sessions = {};

  /**
   * Websocket session management
   */
  wss.on('connection', function(ws) {
    function helper (ws) {
        var session = new Session(ws),
            guid = generateGuid();
        sessions[guid] = session;
        ws.on('close', function() {
            delete sessions[guid];
            delete session;
        });
    }

    console.log("New connection");
    helper(ws);
  });

  function Session(ws) {
    this.ws = ws;

    ws.send(JSON.stringify({
        'cmd' : 'handshake'
    }));

    ws.on('message', function(message) {
        try {
            message = JSON.parse(message);
        }
        catch (e) {
            console.log(e);
            return;
        }

        console.log(message);

        // Pass the message off to one of the registered plugins
        if (message.route && interfaces[message.route]) {
          interfaces[message.route](message);
        }
    });
  }

  register(null, {
    socket: {
      registerRoute: function(path, cb) {
        interfaces[path] = cb;
      }
    }
  });
}