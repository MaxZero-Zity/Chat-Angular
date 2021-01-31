const Models = require('../models');
const { validationResult } = require('express-validator');
const { findUserByEmail } = require('../functions/user/user');

exports.createUsers = (req, res, next) => {
    try {
        const { email } = req.body;
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
            findUserByEmail({email:email})
                .then((result) => {
                    Models.users.create({
                        email:email,
                        name:email,
                        status:'1',
                    }).then(() => {
                        res.status(201).json({
                            message:'success',
                            status:201,
                            statusText:'ok'
                        });
                    }).catch((error => {
                        res.status(500).json({
                            message:error.message,
                            status:500,
                            statusText:'error'
                        });
                    }))
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
            logger.error(e.message)
            return next(e)
        }
    }

};