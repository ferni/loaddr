/**
 * Created by Fer on 10/02/2015.
 */
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var exphbs   = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var autoIncrement = require('mongoose-auto-increment');
var Promise = require('bluebird');
// configuration ===============================================================
Promise.promisifyAll(mongoose);
Promise.promisifyAll(require('request'));
var connection = mongoose.connect(configDB.url); // connect to our database
autoIncrement.initialize(connection);
require('./app/db').init(connection);
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); // set up handlebars for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


var server = require('./app/socket').init(app);

// routes ======================================================================
require('./app/routes')(app, passport); // load our routes and pass in our app and fully configured passport

// models ==================
require('./app/models/user');
require('./app/models/loaddr');

require('./app').init(app);

// launch ======================================================================
server.listen(port);
console.log('The magic happens on port ' + port);
