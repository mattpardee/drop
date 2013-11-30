/**
 * A module to connect to a MongoDB store
 */

module.exports = function setup(options, imports, register) {  
 
  var mongoose = require('mongoose');
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', function() {
    console.log('MongoDB connection opened');
  });

  function generate_mongo_url(obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'sample-blog_development');
    if (obj.username && obj.password) {
      return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    } else {
      return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
  }

  var mongourl = generate_mongo_url(options.mongo);

  register(null, {
    mongo: mongoose.connect(mongourl)
  });
}