const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const middlewareSetup = (app) => {
    app.use(cors({
        // Deployed version
        // Reminder: Switch the origin to your deployed frontend URL before deploying.
        // origin: "https://git.heroku.com/playpal-yp.git/",

        // Dev mode
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(cookieParser());
};

const authCheck = async (req, res, next) => {
    if (req.cookies.token) {
        try {
            const payload = jwt.verify(req.cookies.token, process.env.SECRET);
            req.payload = payload;
            next();
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    } else {
        res.status(400).json({ error: "You are not authorized" });
    }
};

module.exports = { middlewareSetup, authCheck };
