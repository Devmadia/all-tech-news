// this file will contain all the use-facing routes, such as homepage and login page

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// post route
router.get('/', (req, res) => {
    console.log(req.session);
    // query set up to return all posts and their nested properties
    Post.findAll({
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
            // pass a single post object into the homepage template
            console.log(dbPostData[0]);
            /* don't need to  need to serialize data before when you built API routes, because the res.json() method automatically does that */
            // res.render('homepage', dbPostData[0].get({ plain: true }));
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // res.render('homepage', dbPostData[0]);
            res.render('homepage', { posts });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

// login route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
  });

module.exports = router;