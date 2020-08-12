const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users -- this is equivalent of "SELECT * FROM users;"
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1 -- this is equivalent of "SELECT * FROM users WHERE id = 1"
router.get('/:id', (req, res) => {
    User.findOne({
      attributes: { exclude: ['password'] },
        // where option to find a user where its 'id' value equals whatever 'req.params.id' is
      where: {
        id: req.params.id
      }
    })
        // incase of a search for a user with an non-existent id value
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