const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoUtil = require('./utils/mongoUtil');
try {
    mongoUtil.connectToServer();
    console.log("Connected to database successfully");
}
catch (error) {
    console.log("Error occured while connecting to database");
}

const indexRoute = require('./routes/index');
const addMemberRoute = require('./routes/addmember');
const dashboardRoute = require('./routes/dashboard');
const completeRoute = require('./routes/complete');

const serveFavicon = require('serve-favicon')

app.set('trust proxy', true)

app.use(cookieParser());

app.use(serveFavicon('./splitter-favicon.png'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use('/', indexRoute);
app.use('/addmember', addMemberRoute);
app.use('/dashboard', dashboardRoute);
app.use('/complete', completeRoute);

app.use((req, res, next) => {
    let error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (error.message == "jwt must be provided") {
        res.render('error', {
            status: 401,
            message: "Session has expired, go to home to generate new session"
        })
    } else {
        res.render('error', {
            status: error.status || 500,
            message: error.message || "Internal Server Issue"
        });
    }
});

module.exports = app;