const Models = require('../models');
const { validationResult } = require('express-validator');
const {addMessage} = require('../functions/message/message');


exports.addMessage =  (req, res, next) => {

    try {
        const { text,user_id,room_id } = req.body;
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
        addMessage({
            text:text,
            userId:user_id,
            roomId:room_id
        })
        .then((result) => {
            res.status(200).json({
                message: 'success',
                status: 200,
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
}


