// DEPENDENCIES //
const express = require('express');
const Prisma = require('@prisma/client')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Role } = require('@prisma/client');

// CONFIGURATION //
const prisma = new Prisma.PrismaClient();

// signup
router.post('/signup', async (req, res) => {
    let { name, email, password } = req.body
    // lowercase the email
    email = email.toLowerCase();
    //hash the password
    password = await bcrypt.hash(password, 10);
    // create user in database
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
        }
    });
    // create a jwt to sign in the user
    const token = jwt.sign({ userId: user.id }, process.env.SECRET);
    // set the jwt as a cookie in the response
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks in milisecs
    });
    // return the user and and role the to client
    res.json({
        name: user.name,
        role: user.role
    });
});

//signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    // Check if email exist
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error(`No user found for email ${email}`)
    }
    // check if passwords matches
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Password is invalid');
    }
    // create a jwt to sign in the user
    const token = jwt.sign({ userId: user.id }, process.env.SECRET);

    // set the jwt as a cookie in the response
    res.cookie('token', token, {
        sameSite:'strict',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks in milisecs
    });
    // return the user and and role the to client
    res.json({
        name: user.name,
        role: user.role
    });
});

//signout
router.post('/signout', async (req, res) => {
    res.clearCookie('token');
    // return the user the to browser
    res.json({message: 'Goodbye'});
});

// EXPORT //
module.exports = router;