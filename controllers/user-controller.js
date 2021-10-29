const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).json({ message: 'User ID does not exist' });
        }
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createUser({ body }, res) {
    User.create(body)
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json(err));
  },
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: 'User ID does not exist' });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.status(400).json(err));
  },
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: 'User ID does not exist' });
          return;
        }
        // could do res.json(data) but we don't need the data. We just need to know that it was deleted.
        res.json(true);
      })
      .catch((err) => res.status(400).json(err));
  },

  createFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.id } },
      { new: true }
    ).then((data) => {
      if (!data) {
        res.status(404).json({ message: 'Friend ID does not exist' });
        return;
      }
      User.findOneAndUpdate(
        { _id: params.friendId },
        { $addToSet: { friends: params.userId } },
        { new: true }
      )
        .then((data) => {
          if (!data) {
            res.status(404).json({ message: 'Friend ID does not exist' });
          }
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    });
  },
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { freinds: params.id } },
      { new: true }
    ).then((data) => {
      if (!data) {
        res.status(404).json({ message: 'Friend ID does not exist' });
        return;
      }
      User.findOneAndUpdate(
        { _id: params.friendId },
        { $pull: { friends: params.userId } },
        { new: true }
      )
        .then((data) => {
          if (!data) {
            res.status(404).json({ message: 'Friend ID does not exist' });
          }
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    });
  },
};

module.exports = userController;