const router = require('express').Router();
const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboard-routes.js');

// file to collect the packaged API routes: API enpoints are being collected and prefixed with the path /api

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

router.use((req, res) => {
    // if a request to any endpoint doesn't exist, error 404 will indicate the request is an incorrect resource (RESTful API practice)
    res.status(404).end();
});

module.exports = router;