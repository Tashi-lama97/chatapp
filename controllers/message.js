const Message = require("../models/message");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

//Storing Message
exports.storeMessage = (req, res) => {
  //checking if message is for new conversation
  if (req.body.chatId) {
    const message = new Message({
      message: req.body.message,
      sender: req.userInfo._id,
      reciver: req.body.reciver,
      chatId: req.body.chatId,
    });
    message.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: "unable to store message",
        });
      }
      return res.status(200).json(data);
    });
  } else {
    const message = new Message({
      message: req.body.message,
      sender: req.userInfo._id,
      reciver: req.body.reciver,
      //creating new chat id when conversation is new
      chatId: uuidv4(),
    });
    message.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: "unable to store message",
        });
      } else {
        console.log(data);
        return res.status(200).json(data);
      }
    });
  }
};

//Getting message History
exports.getMessageHistory = (req, res) => {
  Message.aggregate([
    {
      $match: {
        //filtering data based on requesting user id
        $or: [{ sender: req.userInfo._id }, { reciver: req.userInfo._id }],
      },
    },

    {
      $group: {
        //grouping data  based on chat id to avoid dublicate recent chats
        _id: {
          chatId: "$chatId",
        },
        sender: { $last: "$sender" },
        reciver: { $last: "$reciver" },
        message: { $last: "$message" },
        date: { $last: "$createdAt" },
      },
    },

    {
      //getting data for sender info from another table
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    {
      //getting data for reciver info from another table
      $lookup: {
        from: "users",
        localField: "reciver",
        foreignField: "_id",
        as: "reciverInfo",
      },
    },
    {
      //selecting data for output
      $project: {
        _id: 1,
        message: 1,
        date: 1,
        reciver: 1,
        sender: 1,
        "senderInfo.name": 1,
        "reciverInfo.name": 1,
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ]).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to fetch data",
      });
    } else {
      return res.status(200).json(data);
    }
  });
};

exports.getAllMessagesBySenderAndReciver = (req, res) => {
  // const error = validationResult(req);
  // if (!error.isEmpty()) {
  //   return res.status(422).json({ error: error });
  // }

  Message.aggregate([
    {
      $match: {
        // matching multiple conditions to get whole conversation between two users
        $or: [
          { $and: [{ sender: req.userInfo._id }, { reciver: req.reciverId }] },
          { $and: [{ sender: req.reciverId }, { reciver: req.userInfo._id }] },
        ],
      },
    },
    // {
    //   $skip: req.body.skip,
    // },
    // { $limit: req.body.limit },

    {
      //getting data for sender info from another table
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    {
      //getting data for reciver info from another table
      $lookup: {
        from: "users",
        localField: "reciver",
        foreignField: "_id",
        as: "reciverInfo",
      },
    },
    {
      //selecting data for output
      $project: {
        _id: 1,
        message: 1,
        sender: 1,
        reciver: 1,
        createdAt: 1,
        "senderInfo.name": 1,
        "reciverInfo.name": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to fetch data",
      });
    } else {
      return res.status(200).json(data);
    }
  });
};

//Delete Message
exports.deleteMassage = (req, res) => {
  //Checking for error
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json(error);
  }
  Message.deleteOne({ _id: req.body.messageId }).exec((error, data) => {
    if (error || !data) {
      return res.status(400).json({
        error: "Unable to Delete Message",
      });
    } else {
      return res.status(200).json({
        message: "Message Scussfully Deleted",
      });
    }
  });
};
