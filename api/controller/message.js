const Models = require('../models');
const { validationResult } = require('express-validator');
const {addMessage , findAllMessageById , findLastMessageById} = require('../functions/message/message');


exports.getMessageAll =  (req, res, next) => {

    try {
        const { id } = req.params;
        if(id !== undefined){
            findAllMessageById({roomId:id})
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
        }else{
            const error = new Error('ไม่มีแชทนี้');
            error.status = 401
            next(error);
        }
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            return next(e)
        } else {
            return next(e)
        }
    }
}
exports.getMessageLast =  (req, res, next) => {

    try {
        const { id } = req.params;
        if(id !== undefined){
            findLastMessageById({roomId:id})
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
        }else{
            const error = new Error('ไม่มีแชทนี้');
            error.status = 401
            next(error);
        }
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            return next(e)
        } else {
            return next(e)
        }
    }
}
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
                data:result,
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


