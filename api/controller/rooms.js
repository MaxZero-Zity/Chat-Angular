const Models = require('../models');
const { validationResult } = require('express-validator');
const {findAllRoomById} = require('../functions/rooms/rooms');


exports.getAllById = (req, res, next) => {
    try {
        const { id } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            return res.status(422).json({
                message:error.message,
                statusCode:error.status,
                statusText:'error',
                errors: errors.array()
            });
        }
        // console.log('id ==',id);
        findAllRoomById({id:id})
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


