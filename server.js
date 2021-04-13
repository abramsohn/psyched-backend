// DEPENDENCIES //
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// CONFIGURATION //
const app = express();
// cors configurations
const whitelist = ['http://localhost:3000', 'https://psyched-frontend.herokuapp.com'];
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('not allowed by CORS'));
        }
    }
}

// MIDDLEWARE
// app.use(cors({ origin: 'https://psyched-frontend.herokuapp.com' , credentials :  true}));
app.use(cors( corsOptions ));
app.use(express.json())
app.use(cookieParser());

//extract user from JWT and append it to requests
app.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const { userId } = jwt.verify(token, process.env.SECRET);
        req.userId = userId;
    }
    next();
});

// CONTROLLERS //
const usersController = require('./controllers/users');
app.use('/users', usersController);

const distressEventsController = require('./controllers/distressEvents');
app.use('/distress-events', distressEventsController);


// LISTENER //
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('Express listening at', PORT);
});
