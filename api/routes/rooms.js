const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const RoomsController = require('../controller/rooms');

router.get('/', (req, res, next) => {
    res.send("rooms");
});

router.post('/all',
[
    body('id').not().isEmpty().isInt(),
],
RoomsController.getAllById);

router.post('/add', 
[
    body('email').isEmail().normalizeEmail().escape(),
    body('userId').not().isEmpty().isInt(),
],
RoomsController.addRoom);
module.exports = router;