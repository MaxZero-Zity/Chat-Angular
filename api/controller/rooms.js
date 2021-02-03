const Models = require('../models');
const { validationResult } = require('express-validator');
const {findAllRoomById,findRelationShipRoomById,addRoom} = require('../functions/rooms/rooms');
const {getUserByEmail} = require('../functions/user/user');

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


exports.addRoom = (req, res, next) => {
    try {
        const { email , userId } = req.body;
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
        //หาก่อนว่ามี email นี้ในระบบมั่ย
        getUserByEmail({email:email})
        .then((result) => {
            var friendId = result.dataValues.id
            console.log('friendId ==',friendId)
            if(friendId !== userId ){
                //ดูว่ามีห้องมั่ย 
                findRelationShipRoomById({friendId:friendId,userId:userId})
                .then((result) => {
                    // console.log(result);
                    addRoom({friendId:friendId,userId:userId})
                    .then((result) => {
                        res.status(201).json({
                            message: 'success',
                            status: 200,
                            data: result
                        })
                    })
                    .catch((error => {
                        error.status = 400;
                        next(error)
                    }));
                })
                .catch((error => {
                    error.status = 400;
                    next(error)
                }));
            }else{
                res.status(401).json({
                    message:'ไม่สามารถแอดตัวเองได้',
                    statusCode:401,
                    statusText:'error',
                });
            }
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


