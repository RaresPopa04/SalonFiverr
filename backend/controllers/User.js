const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Utilizatorul exista' });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        console.log(process.env.JWT_SECRET);

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;


            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            
            res.sendStatus(200);
            
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({ msg: 'Email greșit' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Parolă greșită' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            
            res.sendStatus(200);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
})

module.exports = router;
