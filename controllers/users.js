// DEPENDENCIES //
const express = require('express');
const Prisma = require('@prisma/client')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Role } = require('@prisma/client');

// CONFIGURATION //
const prisma = new Prisma.PrismaClient();

//get one
router.get('/', async (req, res) => {
    if (!req.userId) {
       res.json({
            name: null,
            role: null,
            avatarImage: null
        });
    } else {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        res.json({
            name: user.name,
            role: user.role,
            avatarImage: user.avatarImage,
            therapist: user.therapistId
        });
    } 
});

//get therapist's clients
router.post('/clients', async (req, res) => {
    const clients = await prisma.user.findMany({
        where: { therapistId: req.userId },
    })
    res.json({ clients });
});

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

router.post('/therapist/signup', async (req, res) => {
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
            role: 'THERAPIST'
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

// Get Therapists
router.get('/therapists', async (req, res) => {
    const therapists = await prisma.user.findMany({
        where: {
            role: 'THERAPIST'
        }
    })
    res.json({
        therapists
    })
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
    console.log(user)
    console.log(token)
    // return the user and and role the to client
    res.json({
        name: user.name,
        role: user.role,
        avatarImage: user.avatarImage,
        therapist: user.therapistId
    });
});

//signout
router.post('/signout', async (req, res) => {
    res.clearCookie('token');
    // return the user the to browser
    res.json({message: 'Goodbye'});
});


// Update Client's Therapist
router.put('/', async (req, res) => {
    
    if (req.body.therapist) {
        const updatedUser = await prisma.user.update({
            where: {
                id: req.userId,
            },
            data: {
                therapistId: Number(req.body.therapist)
            }
        })
        res.json({ updatedUser });
    }
});

// Update Image
router.put('/image', async (req, res) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: req.userId,
        },
        data: {
            avatarImage: req.body.image
        }
    })
    console.log(updatedUser)
    res.json({image: updatedUser.avatarImage});
});

// EXPORT //
module.exports = router;