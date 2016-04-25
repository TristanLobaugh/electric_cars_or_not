// Steps
// 1. Initialize the app with the express generator
//   express electric_cars
//     (creates entire folder structure for using express)
// 2. Add .gitingore file that will ignore everything inside of node_modules
//     files wont get added to the git repository
// 3. Copy the compass boilerplate into the project.
//     this will give access to compass. We need to change the ruby config file to write to the cerrect location
//     ../public/stylesheets
// 4. Init git the repository
//     git init
//     git add *
//     git commit -morgangit push/add origin/open up github desktop
// 5. npm install ejs --save
// 6. npm install mongodb --save
// 7. npm install
//   this will install express, all it's dependicies, whatever is inside package.jscon
// 8. Run nodemon
// 9. Swtich the templating engine (if desired) from jade to ejs.
//   in app.js change to ejs in the app.set line
//   in the views folder changes files to ejs extensions
// 10. In index.ejs set up common files and include them
//   head
//   nav
//   footer
// 11. Set up a wrapper div to hold our votiing buttons and our image
// 12. Style our Home package
// 13. Set up and test the connection with mongo.




var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
