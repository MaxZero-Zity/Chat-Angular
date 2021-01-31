const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const {getUserByEmail} = require('../functions/user/user');
const {findRefreshToken} = require('../functions/auth/auth');
const JwtUtil = require('../functions/auth/auth')
const JWT = require('../middleware/authenJWT');
const log4js = require('log4js');
const logger = log4js.getLogger();
const Model = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array())
            return res.status(422).json({
                message: error.message,
                statusCode: error.status,
                statusText: 'error',
                errors: errors.array()
            });
        }
        let getUser = await getUserByEmail({email: email});
        bcrypt.compare(password, getUser.password, async (error, result) => {
            if (error) {
                const error = new Error('Authentication failed');
                logger.error(error.message)
                error.status = 401;
                next(error);
            } else {
                if(result){
                    let accessToken = await JWT.createTokenJWT({email: getUser.email, user_id: getUser.id});
                    let refreshToken = await JWT.createRefreshTokenJWT({email: getUser.email, user_id: getUser.id});
                    logger.info(`${email} login success`)
                    res.status(201).json({
                        message: 'success',
                        status: 201,
                        statusText: 'ok',
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    });
                }else{
                    const error = new Error('email or password is incorrect');
                    logger.error(error.message)
                    error.status = 400;
                    next(error)
                }
            }
        })
    } catch (e) {
        if (e === null) {
            const error = new Error('User not found');
            error.status = 400;
            logger.error(error.message)
            next(error)
        } else {
            logger.error(e.message)
            next(e);
        }
    }
}
exports.logOut = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array())
            return res.status(422).json({
                message: error.message,
                statusCode: error.status,
                statusText: 'error',
                errors: errors.array()
            });
        }
        // let findRefreshToken = await JwtUtil.findRefreshToken({refreshToken});
        let findAccessToken = await JwtUtil.findToken({accessToken: req.headers.authorization.split(' ')[1]});
        // if (!findRefreshToken || !findAccessToken) {
        //     const error = new Error('Token not found');
        //     error.status = 400;
        //     next(error)
        // } else {
        //
        // }
        await Promise.all([
            JwtUtil.deleteTokenBackList({token: findAccessToken.token}),
            // JwtUtil.deleteTokenBackList({token: findRefreshToken.token})
        ]).then(() => {
            logger.info(`${req.users} logout success`)
            res.status(201).json({
                message: 'success',
                status: 201,
                statusText: 'ok'
            })
        }).catch((error) => {
            logger.warn(error.message)
            res.status(500).json({
                message: error.message,
                status: 500,
                statusText: error
            })
        })
    } catch (e) {
        if (e === null) {
            const error = new Error('Token not found');
            error.status = 400;
            logger.warn(error.message)
            next(error)
        } else {
            logger.warn(e.message)
            next(e);
        }
    }
}
exports.generateRefreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Access denied,token missing!');
            error.status = 403;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array())
            return res.status(403).json({
                message: error.message,
                statusCode: error.status,
                statusText: 'error',
                errors: errors.array()
            });
        }
        let tokenData = await findRefreshToken({refreshToken: refreshToken})
        const playLoad = await JWT.verifyRefreshTokenJWT({token: tokenData.token});
        const accessToken = await JWT.createNewTokenJWT({playload: playLoad});
        logger.info(`${playLoad} generateRefreshToken success`);
        res.status(200).json({
            message: 'success',
            status: 200,
            statusText: 'ok',
            accessToken: accessToken
        })
    } catch (e) {
        if (e === null) {
            const error = new Error('Token expired!');
            logger.warn(error.message)
            error.status = 401;
            next(error)
        } else {
            logger.warn(e.message)
            next(e);
        }
    }
}

exports.listToken = (req, res, next) => {
    Model.backlists.findAll({
        attributes:['id', 'end_time'],
        limit:10,
        where: {
            end_time: {
                [Op.lte] :moment().format()
            }
        }
    })
        .then((data) => {
            let listExpireToken = []
            data.forEach((v) => {
                const duration = moment.duration(moment().diff(moment(v.end_time)))
                const hours = duration.asHours();
                if(hours>= 48) {
                    listExpireToken.push(v.id)
                }
            })
            Model.backlists.destroy({
                where: {
                    id:listExpireToken
                }
            }).then(() => {
                res.status(200).json({
                    message:'success',
                    status:200,
                })
            }).catch((error) => {
                const err = new Error(error.message);
                err.status=500;
                next(err)

            })

        }).catch((error) => {
            const err = new Error(error.message);
            err.status=500;
            next(err)

    })
}
exports.deleteToken = () => {
    Model.backlists.findAll({
        attributes:['id', 'end_time'],
        where: {
            end_time: {
                [Op.lte] :moment().format()
            }
        }
    })
        .then((data) => {
            let listExpireToken = []
            if(data.length !== 0) {
                data.forEach((v) => {
                    const duration = moment.duration(moment().diff(moment(v.end_time)))
                    const hours = duration.asHours();
                    if(hours>= 48) {
                        listExpireToken.push(v.id)
                    }
                })
                Model.backlists.destroy({
                    where: {
                        id:listExpireToken
                    }
                }).then(() => {
                    return null
                }).catch((error) => {
                    logger.error(error.message)
                    return null
                })
            } else {
                logger.info('no data')
            }

        }).catch((error) => {
        logger.error(error.message)
    })
}