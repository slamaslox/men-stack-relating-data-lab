// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');


const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-views.js');

// Constants
const port = process.env.PORT ? process.env.PORT : '3000';

// Import models


// Initialize Express app
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Routes (I.N.D.U.C.E.S)

// ROOT (HOME)
app.get('/', (req, res) => {
  res.render('home.ejs', {
    user: req.session.user,
  });
});

// Auth Routes
app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users', usersController);
app.use('/users/:userId/foods', foodsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
