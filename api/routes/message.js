const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const MessageController = require('../controller/message');

router.get('/all/:id',  
    MessageController.getMessageAll)

router.get('/last/:id',  
    MessageController.getMessageLast)

router.post('/add',
    [
        body('text').isString().trim().isLength({min:1,max:100}).escape(),
        body('room_id').isInt(),
        body('user_id').isInt(),
    ],
    MessageController.addMessage);
module.exports = router;