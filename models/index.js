const User = require('./User');

// require the Post model
const Post = require("./Post");

/* A user can make many posts. But a post only belongs to a single user, 
and never many users. By this relationship definition, we know we have a 
one-to-many relationship*/

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

/* This association creates the reference for the id column in the User 
model to link to the corresponding foreign key pair, which is the user_id 
in the Post model.*/

// reverse association: post belongs to one user, not many; foreign key link is designated at user_id in the post model
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

// import user model data
module.exports = { User };