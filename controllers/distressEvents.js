// DEPENDENCIES //
const express = require('express');
const Prisma = require('@prisma/client')
const router = express.Router();

// MODELS //
// const User = require('./users')

// CONFIGURATION //
const prisma = new Prisma.PrismaClient();

// Create
router.post('/', async (req, res) => {
    let { description, emotion, emotionIntensity, factCheck, skill, opositeAction, problemSolving } = req.body
    const distressEvent = await prisma.distressEvent.create({
        data: {
            clientId: req.userId,
            description,
            emotion,
            emotionIntensity,
            factCheck,
            skill,
            opositeAction,
            problemSolving
        }
    });
    res.json({
        distressEvent
    });
});

// Get

router.get('/', async (req, res) => {
    const distressEvents = await prisma.distressEvent.findMany({
        where: {
            clientId: req.userId
        }
    });
    res.json({
        distressEvents
    });
});

//get
// router.get('/', async (req, res) => {
//     if (!req.userId) {
//        res.json({
//             name: null,
//             role: null
//         });
//     } else {
//         const user = await prisma.user.findUnique({
//             where: { id: req.userId }
//         });

//         res.json({
//             name: user.name,
//             role: user.role
//         });
//     } 
// });

// EXPORT //
module.exports = router;