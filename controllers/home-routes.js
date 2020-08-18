// this file will contain all the use-facing routes, such as homepage and login page

const router = require('express').Router();

router.get('/', (req, res) => {
    // replaces res.send() or res.sendFile for responses
    res.render('homepage'); 
});

module.exports = router;