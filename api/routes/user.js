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
        body('password').isLength({min:8, max:20}),
    ],
    UsersController.createUsers);

module.exports = router;