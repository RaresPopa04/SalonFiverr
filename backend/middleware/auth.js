const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const authMiddleware = (req, res, next) => {

    // console log the request headers

    const cookie = req.headers.cookie;
    const token = cookie.split('=')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Invalid token' });
    }


}

module.exports = authMiddleware;

