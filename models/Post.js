const { Model, DataTypes } = require('sequelize');

// import connection
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        })
        .then(() => {
            return Post.findOne({
                where: {
                  id: body.post_id
              },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

// create fields/columns for Post model
Post.init(
    /* defining the post schema:
    id column is the primary key and set to auto-increment,
    title is defined as a string,
    post_url is defined as a string with Sequelize having the ability
    to offer validation in the scheme definition. The isURL is set to true.
    
    User_id column determines who posted the news article using the references property
    to establish the relationship between post and user by creating a reference to the
    user model, specifically the id column defined by the key property, a primary key.
    
    User_id is conversely defined as a foreign key and will be the matching link.
    
    In the second parameter, the metadata is reconfigured, including the naming conventions.*/
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isURL: true
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
    }
  );

// makes the Post model accessible to other parts of the application 
module.exports = Post;