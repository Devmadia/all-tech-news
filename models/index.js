const User = require('./User');
const Vote = require('./Vote');

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

/* to associate User and Post to one another in a way that queries Post and can see a total of how many votes a user creates
and when a User is queried it'll show all of the posts they've voted on */
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});
  
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

/* Connect the Post and User models together through the Vote model, there actually is no direct relationship between 
Post and Vote or User and Vote. To see the total number of votes on a post, a direct connection to the Post and Vote 
models are required. */
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// import user, post, and vote model data
module.exports = { User, Post, Vote };