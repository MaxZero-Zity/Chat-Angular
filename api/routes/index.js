const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const roomsRouter = require('./rooms');

router.all('/', ((req, res, next) => {
    res.send(
        `<div style="margin: auto; width: 50%; padding: 10px">
            <h1>Welcome to API</h1>
            <p>${req.hostname}${req.baseUrl.toString()}</p>
        </div>`)
}))
router.use('/user', userRouter);
router.use('/rooms', roomsRouter);


module.exports = router;
