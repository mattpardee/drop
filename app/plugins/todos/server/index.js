module.exports = function setup(options, imports, register) {
    
    var socket = imports.socket;

    socket.registerRoute("todos", function(msg) {
    	console.log(msg);
    });

    register(null, {});

};