const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const MessageController = require('../controller/message');



router.post('/add',
    [
        body('text').isString().trim().isLength({min:1,max:100}).escape(),
        body('room_id').isInt(),
        body('user_id').isInt(),
    ],
    MessageController.addMessage);
module.exports = router;