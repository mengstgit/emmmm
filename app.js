//dependencesis
const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const config = require('./config/secret');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const passportConf = require('./config/passport');


//express
const app = express();

//get ROUTERS
const homeRoute = require('./routers/index');
const usersRoute = require('./routers/users');

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.use(cookieParser(config.secret));
// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(cookieParser(config.secret));


app.use(session({
	secret : config.secret,
	resave : false,
	saveUninitialized : false,
	store : new MongoStore({ mongooseConnection : mongoose.connection})
}));


app.use(expressValidator());
app.use(flash());

//engine
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(passport.initialize());
app.use(passport.session());
//users routes

app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	console.log(req.user);
	next();

});
app.use(homeRoute);
app.use(usersRoute);



app.listen(3000, () => {
    console.log(`server is listening on port ${config.port}`);
});