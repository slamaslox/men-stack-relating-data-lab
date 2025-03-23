const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

router.get("/", async (req, res) => {
    try {
        const allUsers = await User.find({});
        const currentUserId = req.session.user._id;
        const otherUsers = allUsers.filter((user) => {
            return user._id.toString() !== currentUserId;
          });
        res.render('users/index.ejs', { users: otherUsers });
      } catch (err) {
        console.log('Error loading community:', err);
        res.redirect('/');
      }
  });

router.get('/:userId', async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.userId);

    if (!foundUser) {
      return res.status(404).send('User not found');
    }

    res.render('users/show.ejs', {
      user: foundUser,
      pantry: foundUser.pantry || []
    });
  } catch (err) {
    console.log('Error loading user pantry:', err);
    res.redirect('/users');
  }
});

module.exports = router;