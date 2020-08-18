// this file will contain all the use-facing routes, such as homepage and login page

const router = require('express').Router();

router.get('/', (req, res) => {
    // replaces res.send() or res.sendFile for responses
    res.render('homepage', {
        id: 1,
        post_url: 'https://handlebarsjs.com/guide/',
        title: 'Handlebars Docs',
        created_at: new Date(),
        vote_count: 10,
        comments: [{}, {}],
        user: {
          username: 'test_user'
        }
      });
});

module.exports = router;