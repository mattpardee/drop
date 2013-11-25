var express = require('express'),
    architect = require("architect"),
    http = require('http'),
    path = require('path'),
    exphbs = require('express3-handlebars'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 1530});

var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', __dirname);
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/apps/:appname', function(req, res) {
    res.render('index');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Architect config
 *
 */
var configPath = path.join(__dirname, "config.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
    if (err) throw err;
    console.log("Plugin system ready");
});


/**
 * Websocket handling
 *
 */

var sessions = {};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1);
}

function generateGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

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

        switch (message.cmd) {
            default:
                break;
        }
    });
}
