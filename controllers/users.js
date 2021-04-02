// DEPENDENCIES //
const express = require('express');
const Prisma = require('@prisma/client')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    // create a JWT to sign in the user
    const token = jwt.sign({ userId: user.id }, process.env.SECRET);
    // set the jwt as a cookie in the response
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks in milisecs
    });
    // return the user the to browser
    res.json(user)
    



});


    
    
    
    
    
    
    
    
    

// EXPORT //
module.exports = router;