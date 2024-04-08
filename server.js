// IMPORT DEPENDENCIES
require('dotenv').config();
const express = require('express');
const app = express();

// Database connection
require('./config/db');
const PORT = process.env.PORT;

// IMPORT MIDDLEWARE
const { middlewareSetup, authCheck } = require('./middleware/mid');
// Apply centralized middleware setup
middlewareSetup(app);

// IMPORT ROUTES
const dogRoutes = require('./routes/dogRoutes');
const authRoutes = require('./routes/authRoutes');

// SETUP ROUTES
app.get('/', (req, res) => {
    res.json({hello: "server"});
});

// Use middleware as needed, for example, authCheck for secure routes
// app.use('/secure-route', authCheck, secureRouteHandler);

// Apply routes
app.use(authRoutes);
app.use(dogRoutes);

// LISTENER
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
