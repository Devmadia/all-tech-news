const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

// handlebars template engine
const exphbs = require('express-handlebars');

// sequelizestore import
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// handlebars template engine
const hbs = exphbs.create({});

// handlebars template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

// turn on routes
app.use(routes);

/* The "sync" part means that this is Sequelize 
taking the models and connecting them to associated database tables. 
If it doesn't find a table, it'll create it*/

// turn on connection to db and server

/* "force: false", if it were set to true, it would drop and re-create 
all of the database tables on startup. 

By changing the value of the force property to true, then the database connection 
must sync with the model definitions and associations. Forcing the sync method to 
true will make the tables re-create if there are any association changes.*/

// drop the tables so the application can re-create them and implement the associations
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});