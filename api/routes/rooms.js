const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const RoomsController = require('../controller/rooms');

router.get('/', (req, res, next) => {
    res.send("rooms");
});

router.get('/all',
    RoomsController.getAllById)

module.exports = router;