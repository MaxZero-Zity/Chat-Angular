const Models = require('../models');
const { validationResult } = require('express-validator');
const {findAllRoomById} = require('../functions/rooms/rooms');


exports.getAllById = (req, res, next) => {
    try {
        const { email } = req.params;
        console.log('emaill ==',email);
        findAllRoomById({email:email})
        .then((result) => {
            res.status(200).json({
                message: 'success',
                status: 200,
                data: result
            })
        })
        .catch((error => {
            error.status = 400;
            next(error)
        }));
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            return next(e)
        } else {
            return next(e)
        }
    }
};


