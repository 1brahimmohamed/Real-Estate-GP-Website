/************************************************************************************
 *
 * File Name  : app.js
 * Description: This file contains the main application file
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

// ------------------------------------------   Imports  ------------------------------------------//
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize  = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const propertyRouter = require('./routes/propertyRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const inquiryRouter = require('./routes/inquiryRoutes');
const viewRouter = require('./routes/viewRoutes');
const messageRouter = require('./routes/messageRoutes');

const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/errorController');
const ErrorHandler = require('./utils/errorHandler');


const app = express();

// views
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// serving static files
app.use(express.static(`${__dirname}/public`));


// ------------------------------------------   Middlewares  ------------------------------------------//

// set security HTTP headers
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "img-src": ["'self'", 'https: data:', 'http:'],
    }
}));

// limit requests from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb'}));
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());


// prevent parameter pollution
app.use(hpp({
    whitelist: [
        'price',
        'area',
        'bedrooms',
    ]
}));


// app.use((req, res, next) => {
//     console.log(req.cookies);
//     next();
// });

// ------------------------------------------   Routes  ------------------------------------------//
app.use('/', viewRouter);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/inquiries', inquiryRouter);
app.use('/api/v1/messages', messageRouter);


// error handling for unhandled routes
app.all('*', (req, res, next) => {
    res.sendFile(`${__dirname}/public/404.html`);
});

app.use(globalErrorHandler);

// export app
module.exports = app;