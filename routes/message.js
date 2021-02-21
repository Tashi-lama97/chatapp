const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  storeMessage,
  getMessageHistory,
  getAllMessagesBySenderAndReciver,
  deleteMassage,
} = require("../controllers/message");
const { getUserById, getReciverIdById } = require("../controllers/user");
const { isloggedIn, isAuthenticated } = require("../controllers/auth");

//Getting user info
router.param("userId", getUserById);
//getting reciver id
router.param("reciverId", getReciverIdById);

//Send message
router.post(
  "/message/send/:userId",
  isloggedIn,
  isAuthenticated,
  [check("reciverId", "Reciver Id should not be empty").not().isEmpty()],
  storeMessage
);

//Feching recent chat
router.get(
  "/chat/history/:userId",
  isloggedIn,
  isAuthenticated,
  getMessageHistory
);

//Fetching conversation
router.get(
  "/chat/all/:userId/:reciverId",
  isloggedIn,
  isAuthenticated,
  getAllMessagesBySenderAndReciver
);

//Deleting Message
router.delete(
  "/message/delete/:userId",
  isloggedIn,
  isAuthenticated,
  [check("messageId", "message id should not be empty").not().isEmpty()],
  deleteMassage
);

module.exports = router;
