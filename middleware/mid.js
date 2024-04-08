const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
    "https://playpal-yunapahk.vercel.app", // Production origin
    "http://localhost:3000", // Development origin
    'ttps://playpal-at7nrf5rq-yunapahk.vercel.app/'// test
];

const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Reflect the request's credentials (cookies, HTTP authentication) as necessary
};

const middlewareSetup = (app) => {
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(cookieParser());
    // other middleware
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
