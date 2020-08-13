const router = require('express').Router();


const userRoutes = require('./user-routes.js');

const postRoutes = require('./post-routes');

// this file will serve as a means to collect all of the API routes and package them up

// route for userRoutes
router.use('/users', userRoutes);

// route for postRoutes
router.use('/posts', postRoutes);

module.exports = router;