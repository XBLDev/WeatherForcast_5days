const express = require('express');
const bodyParser = require('body-parser');
// const passport = require('passport');
// const config = require('./config');
// var path = require('path');

// connect to the database and load models
// require('./server/models').connect(config.dbUri);


const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
// app.use(passport.initialize());

// load passport strategies
// const localSignupStrategy = require('./server/passport/local-signup');
// const localLoginStrategy = require('./server/passport/local-login');
// passport.use('local-signup', localSignupStrategy);
// passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
// const authCheckMiddleware = require('./server/middleware/auth-check');
// app.use('/api', authCheckMiddleware);

// routes
// const authRoutes = require('./server/routes/auth');
// const apiRoutes = require('./server/routes/api');
// const newsRoutes = require('./server/routes/news');
// const eventRoutes = require('./server/routes/Events');
// const galaryPhotoRoutes = require('./server/routes/GalaryPhotos');

// app.use('/auth', authRoutes);
// app.use('/api', apiRoutes);
// app.use('/news', newsRoutes);
// app.use('/Events', eventRoutes);
// app.use('/GalaryPhotos', galaryPhotoRoutes);

app.route('/*').get(function(req, res) { 
  return res.sendFile(path.join(__dirname, './server/static/index.html')); 
});

// start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080 or http://127.0.0.1:8080');
});