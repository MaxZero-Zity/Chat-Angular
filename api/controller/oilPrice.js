
const {validationResult} = require('express-validator');
const Model = require('../models');
const AWS = require('../middleware/aws');
const log4js = require('log4js');
const logger = log4js.getLogger();
const {getOilPrice,createOilPrice,updateOilPrice} = require('../functions/oilPrice/oilPrice');
const entities = require("entities");
const moment = require('moment');
const { replyMessage,replyPttMessage ,replyGlassAmazonMessage,replyGasPttLocationMessage,
    setNewRichMenu, replyMessageGodJi, replyMessagePriceOli, replyMessageTexasPromotion,
    replyMessageOrderTexasChicken, replyMessageSearchTexasChicken, replyMessageJiffyPromotion, replyMessageJiffyPromotionPearlyTea,
    replyMessageJiffyHuaSengHeng, replyMessageSearchAmazon} = require('../functions/promotion/line')




exports.view = (req, res, next) => {
    try {
        getOilPrice().then(async(result) => {
            if(result.length > 0){
                let obj = Object.assign({
                    "id": result[0].id,
                    "img_url": await AWS.getSignedUrls({key:result[0].cover_img }),
                })
                res.status(200).json({
                    status: true,
                    message: 'ดึงข้อมูลสำเร็จ',
                    data: obj
                })
            }else{
                res.status(200).json({
                    status: true,
                    message: 'ดึงข้อมูลสำเร็จ',
                    data: result
                })
            }
        }).catch((error => {
            return res.status(400).json({
                message:error.message,
                statusCode:error.status,
                statusText:'error',
            });
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

exports.upload = (req, res, next) => {

    try {
        const files = req.files.files;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array());
            return res.status(422).json({
                message: error.message,
                statusCode: error.status,
                statusText: 'error',
                errors: errors.array()
            });
        }
        let cover_img = new Date().getMilliseconds().toString();
        AWS.putObject({
            file: files.data, key: cover_img, cb: (error, data) => {
                if (error) {
                    const err = new Error(error.message);
                    err.status = 500;
                    next(err)
                } else {
                    getOilPrice().then((result) => {
                        if(result.length > 0){
                            let id = +result[0].id
                            updateOilPrice({id:id,cover_img:cover_img}).then((result) => {
                                res.status(201).json({
                                    status: true,
                                    message: 'upload สำเร็จ',
                                    data: result
                                })
                            }).catch((error => {
                                return res.status(400).json({
                                    message:error.message,
                                    statusCode:error.status,
                                    statusText:'error',
                                });
                            })); 
                        }else{
                            createOilPrice({cover_img:cover_img}).then((result) => {
                                res.status(201).json({
                                    status: true,
                                    message: 'upload สำเร็จ',
                                    data: result
                                })
                            }).catch((error => {
                                return res.status(400).json({
                                    message:error.message,
                                    statusCode:error.status,
                                    statusText:'error',
                                });
                            }));   
                        }
                    }).catch((error => {
                        return res.status(400).json({
                            message:error.message,
                            statusCode:error.status,
                            statusText:'error',
                        });
                    }));    
                    console.log('cover_img',cover_img);
                }
            }
        })      
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            return next(e)
        } else {
            return next(e)
        }
    }
}
