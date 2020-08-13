const router = require('express').Router();
const { User, Post, Vote } = require("../../models");

// GET /api/users -- this is equivalent of "SELECT * FROM users;"
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
      // update the `.findAll()` method's attributes to look like this
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1 -- this is equivalent of "SELECT * FROM users WHERE id = 1"
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// POST /api/users
router.post('/', (req, res) => {
    /* expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    .create inserts data, passing key/value pairs where keys are what is defined in the user model
    and values from 'req.body'

    In SQL it would look like:

    INSERT INTO users
        (username, email, password)
    VALUES
        ("Lernantino", "lernantino@gmail.com", "password1234");*/

    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/login', (req, res) => {

    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
      // looks for a user with the specified email
      where: {
        email: req.body.email
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user with that email address!' });
          return;
        }

        // add comment syntax in front of this line in the .then()
        // res.json({ user: dbUserData }

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);

        // a conditional statement to verify whether the user has been verified or not
        if (!validPassword) {
            // an error message is sent back to the client, and the return statement exits out of the function immediately
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        
            res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
  /* expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  .update() method combines the parameters for creating data and looking up data,
  
  if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  
  associated SQL syntax would look like the following code:

    UPDATE users
    SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    WHERE id = 1; */

    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
        .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    /* to delete data, .destroy method is used and provides some type of identifier to indicate where exactly 
    to delete data from the user database table. */
    User.destroy({
        where: {
        id: req.params.id
        }
    })
        .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

module.exports = router;