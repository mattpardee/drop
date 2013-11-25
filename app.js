var express = require('express'),
    architect = require("architect"),
    http = require('http'),
    fs = require('fs'),
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

// Assemble all the apps in our plugins directory
var apps = {
    apps : []
};

var pluginBase = path.join('./app/plugins'),
    files = fs.readdirSync(pluginBase),
    packageInfo;

for (var f in files) {
    if (files[f].indexOf('.') === -1) {
        packageInfo = fs.readFileSync(path.join(pluginBase, files[f], '/package.json'));
        try {
            packageInfo = JSON.parse(packageInfo.toString());
        }
        catch (e) {
            console.log("ERR: Could not parse client plugin's package.json file for:\n\t", files[f]);
            continue;
        }

        //console.log(packageInfo);
        apps.apps.push({
            link : files[f],
            name : packageInfo.name
        });
    }
}

// Set up routes
app.get('/', function(req, res) {
    res.render('index', apps);
});

app.get('/apps/:appname', function(req, res) {
    res.render('index', apps);
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
