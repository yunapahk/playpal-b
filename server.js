//////////////////////
// IMPORT DEPENDENCIES
//////////////////////
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
require('./config/db');
const PORT = process.env.PORT || 4567;

// CORS options
const corsOptions = {
    origin: ['http://localhost:4567', 'https://playpal-yunapahk.vercel.app'],
    credentials: true, // This is important for cookies, authorization headers with HTTPS
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use CORS with options
app.use(cors(corsOptions));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Database connection
require('./config/db');

//////////////////////
// IMPORT MIDDLEWARE
//////////////////////
const { middlewareSetup, authCheck } = require('./middleware/mid');
middlewareSetup(app);

//////////////////////
// IMPORT ROUTES
//////////////////////
const dogRoutes = require('./routes/dogRoutes');
const authRoutes = require('./routes/authRoutes');

//////////////////////
// SETUP ROUTES
//////////////////////
app.get('/', (req, res) => {
    res.json({hello: "server"});
});

// Auth related routes
app.use(authRoutes);

// Dog related routes (can be prefixed if desired e.g. app.use("/dogs", dogRoutes); )
app.use(dogRoutes);

//////////////////////
// LISTENER
//////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
