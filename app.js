var express = require('express'),
    architect = require("architect"),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    exphbs = require('express3-handlebars');

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
        packageInfo = fs.readFileSync(path.join(pluginBase, files[f], '/server/package.json'));
        try {
            packageInfo = JSON.parse(packageInfo.toString());
        }
        catch (e) {
            console.log("ERR: Could not parse plugin's package.json file for:\n\t", files[f]);
            continue;
        }

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
var configPath = path.join(__dirname, "config.js"),
    config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
    if (err) throw err;
    console.log("Plugin system ready");
});