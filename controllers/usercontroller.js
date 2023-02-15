const { User, Thought } = require('../models');

const userController = {
  getUser(req, res) {
    User.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(userData => res.json(userData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true
    })
      .then(userData => {
        if (!userData) {
          res.status(404).json({
            message: 'No user found with this id.'
          });
          return;
        }
        res.json(userData);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(userData => {
        if (!userData) {
          res.status(404).json({
            message: 'No user found with this id.'
          });
          return;
        }
        return userData;
      })
      .then(userData => {
        User.updateMany({
          _id: {
            $in: userData.friends
          }
        }, {
          $pull: {
            friends: params.userId
          }
        })
          .then(() => {
            //deletes user's thought associated with id
            Thought.deleteMany({
              username: userData.username
            })
              .then(() => {
                res.json({
                  message: 'User deleted'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json(err);
              })
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          })
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      })
  },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((friendData) => {
        if (!friendData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(friendData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((friendData) => {
        if (!friendData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(friendData);
      })
      .catch((err) => res.status(400).json(err));

  }
};

module.exports = userController;
