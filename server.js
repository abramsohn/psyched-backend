// DEPENDENCIES //
const express = require('express');
const cookieParser = require('cookie-parser')
require('dotenv').config();

// CONFIGURATION //
const app = express();

// MIDDLEWARE
app.use(express.json())
app.use(cookieParser());

// MODELS //

// CONTROLLERS //
const usersController = require('./controllers/users');
app.use('/users', usersController);


// LISTENER //
const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log('Express listening at', PORT);
});
