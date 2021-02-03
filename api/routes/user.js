const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const UsersController = require('../controller/users');

router.get('/', (req, res, next) => {
    res.send("auth");
});
router.post('/create',
    [
        body('email').isEmail().normalizeEmail().escape(),
    ],
    UsersController.createUsers);

router.post('/get/profile', 
    [
        body('email').isEmail().normalizeEmail().escape(),
    ],
    UsersController.getUserProfile);



module.exports = router;