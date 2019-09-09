const express = require('express');
const path = require('path');
require("express-async-errors");

console.log("App started");

const globalErrorHandler = require("./error_handling").globalErrorHandler;

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

/////////////////////////////////////////////////
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
dotenv.config();
const conf = require("./config");
/////////////////////////////////////////////////



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(globalErrorHandler);

module.exports = app;
