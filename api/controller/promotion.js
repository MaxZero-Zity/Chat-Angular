const {validationResult} = require('express-validator');
const FRONT_URL = process.env.FRONT_URL;
const Model = require('../models');
const AWS = require('../middleware/aws');
const log4js = require('log4js');
const logger = log4js.getLogger();
const {Op } = require('sequelize');
const {countPromotion, getPromotionDataTable, getById, getListPromotionLine, getListPromotionLineById } = require('../functions/promotion/promotion');
const entities = require("entities");
const moment = require('moment');
const { replyMessage,replyPttMessage ,replyGlassAmazonMessage,replyGasPttLocationMessage,
    setNewRichMenu, replyMessageGodJi, replyMessagePriceOli, replyMessageTexasPromotion,
    replyMessageOrderTexasChicken, replyMessageSearchTexasChicken, replyMessageJiffyPromotion, replyMessageJiffyPromotionPearlyTea,
    replyMessageJiffyHuaSengHeng, replyMessageSearchAmazon} = require('../functions/promotion/line')
const BlueCardLine = require('../functions/promotion/bluecard');
const PttLubricants = require('../functions/promotion/pttfit');
const RICH_MENU_HOME = process.env.RICH_MENU_HOME;
const RICH_MENU_PTT_STATION = process.env.RICH_MENU_PTT_STATION;
const RICH_MENU_AMAZON = process.env.RICH_MENU_AMAZON;
const RICH_MENU_BLUE_CARD = process.env.RICH_MENU_BLUE_CARD;
const RICH_MENU_PTT_LUBRICANTS = process.env.RICH_MENU_PTT_LUBRICANTS;
const RICH_MENU_TEXAS = process.env.RICH_MENU_TEXAS;
const RICH_MENU_JIFFTY = process.env.RICH_MENU_JIFFTY;

exports.create = (req, res, next) => {

    const {
        title, short_description, start_date, end_date,
        link_out1, link_out_description1,link_out2,link_out_description2,index,link_public, body,
        status, brand_id, categories_id
    } = req.body
    const files = req.files.files;
    const errors = validationResult(req);
    console.log(start_date)
    console.log(end_date)
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
    let checkDate = moment(start_date).isAfter(end_date);
    if(checkDate) {
        const error = new Error('end date should be more than start date');
        error.status = 400
        next(error);
    }
    AWS.putObject({
        file: files.data, key: cover_img, cb: (error, data) => {
            if (error) {
                const err = new Error(error.message);
                err.status = 500;
                next(err)
            } else {
                Model.promotions.create({
                    title,
                    short_description,
                    start_date,
                    end_date,
                    link_out1,
                    link_out_description1,
                    link_out2,
                    link_out_description2,
                    index:+index,
                    link_public:link_public?link_public:'',
                    body,
                    user_id: req.users.user.user_id,
                    brand_id: +brand_id,
                    categorie_id: +categories_id,
                    deleteStatus:0,
                    cover_img,
                    status: status
                }).then(() => {
                    logger.info(`${req.users.user.email} create promotion success`);
                    res.status(201).json({
                        message: 'success',
                        status: 201,
                        statusText: 'ok'
                    });
                }).catch((error) => {
                    logger.error(error.message)
                    res.status(500).json({
                        message: error.message,
                        status: 500,
                        statusText: 'error'
                    });
                })
            }
        }
    })
}
exports.update = async (req, res, next) => {
    const {
        title, short_description, start_date, end_date,  link_out1, link_out_description1,
            link_out2,link_out_description2,index, link_public, body,
        status, brand_id, categories_id, id, cover_img
    } = req.body
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
    console.log(start_date)
    console.log(end_date)
    if(!cover_img) {
        const files = req.files.files;
        let cover_imgs = new Date().getMilliseconds().toString();
        try {
            let promotion = await getById({id});
            let checkDate = moment(start_date).isAfter(end_date);
            if(checkDate) {
                const error = new Error('end date should be more than start date');
                error.status = 400
                next(error);
            }
            if(promotion) {
                AWS.putObject({
                    file: files.data, key: cover_imgs, cb: (error, data) => {
                        if (error) {
                            const err = new Error(error.message);
                            logger.error(err.message)
                            err.status = 500;
                            next(err)
                        } else {
                            Model.promotions.update(
                                {
                                    title,
                                    short_description,
                                    start_date,
                                    end_date,
                                    link_out1,
                                    link_out_description1,
                                    link_out2,
                                    link_out_description2,
                                    index:+index,
                                    link_public:link_public?link_public:'',
                                    body,
                                    user_id: req.users.user.user_id,
                                    brand_id: +brand_id,
                                    categorie_id: +categories_id,
                                    cover_img:cover_imgs,
                                    status: status
                                },
                                {
                                    where:{
                                        id:+promotion.id
                                    }},
                            ).then(() => {
                                logger.info(`${req.users.user.email} update promotion success`);
                                res.status(201).json({
                                    message: 'success',
                                    status: 201,
                                    statusText: 'ok'
                                });
                            }).catch((error) => {
                                logger.error(error.message)
                                res.status(500).json({
                                    message: error.message,
                                    status: 500,
                                    statusText: 'error'
                                });
                            })
                        }
                    }
                })
            } else {
                const error = new Error('Id promotion not found');
                logger.warn(error.message)
                error.status = 400;
                next(error)
            }

        } catch (e) {
            const error = new Error('Id promotion not found');
            logger.warn(error.message)
            error.status = 400;
            next(error)
        }

    } else{
        try {
            let promotion = await getById({id});
            let checkDate = moment(start_date).isAfter(end_date);
            if(checkDate) {
                const error = new Error('end date should be more than start date');
                error.status = 400
                next(error);
            }
            if(promotion) {
                Model.promotions.update(
                    {
                        title,
                        short_description,
                        start_date,
                        end_date,
                        link_out1,
                        link_out_description1,
                        link_out2,
                        link_out_description2,
                        index:+index,
                        link_public,
                        body,
                        user_id: req.users.user.user_id,
                        brand_id: +brand_id,
                        categorie_id: +categories_id,
                        cover_img,
                        status: status
                    },
                    {
                        where:{
                            id:+promotion.id
                        }
                    }
                ).then(() => {
                    logger.info(`${req.users.user.email} update promotion success`);
                    res.status(201).json({
                        message: 'success',
                        status: 201,
                        statusText: 'ok'
                    });
                }).catch((error) => {
                    logger.error(error.message)
                    res.status(500).json({
                        message: error.message,
                        status: 500,
                        statusText: 'error'
                    });
                })
            } else {
                const error = new Error('Id promotion not found');
                logger.warn(error.message)
                error.status = 400;
                next(error)
            }


        } catch (e) {
            const error = new Error('Id promotion not found');
            logger.warn(error.message)
            error.status = 400;
            next(error)
        }
    }

}
exports.getById = (req, res, next) => {
    const { id } = req.params;
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
    Model.promotions.findOne({
        where: {
            id: Number(id)
        },
        include:[
            {
                model: Model.brands , as: 'brands',
                attributes: ['id', 'title']

            },
            {
                model: Model.categories , as: 'categories',
                attributes: ['id', 'title']

            }
        ]
    }).then(async (data) => {
        if(!data) {
            res.status(200).json({
                message: 'success',
                status: 200,
                statusText: 'ok',
                data:null
            })
        }
        let obj = Object.assign({
            "id": data.id,
            "title": entities.decode(data.title),
            "short_description": entities.decode(data.short_description),
            "user_id": data.user_id,
            "brand_id": data.brand_id,
            "categories_id": data.categorie_id,
            "start_date": data.start_date,
            "end_date": data.end_date,
            "cover_img": data.cover_img,
            "img_url": await AWS.getSignedUrls({key:data.cover_img }),
            "link_out1": data.link_out1,
            "link_out_description1":data.link_out_description1,
            "link_out2": data.link_out2,
            "link_out_description2":data.link_out_description2,
            "index":data.index,
            "link_public": data.link_public,
            "body": entities.decode(data.body),
            "status": data.status,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt,
            "brands": data.brands,
            "categories": data.categories,
            "deleteStatus":data.deleteStatus
        })
        logger.info(`view promotion success`);
        if(req.users) {
            res.status(200).json({
                message: 'success',
                status: 200,
                statusText: 'ok',
                data:obj
            });
        } else {
            let checkDate = moment().isAfter(moment(data.end_date).format('YYYY-MM-DD HH:mm'));
            if(checkDate) {
                const error = new Error('Access denied!');
                error.status = 401
                next(error);
            } else {
                if(data.status && !data.deleteStatus) {
                    res.status(200).json({
                        message: 'success',
                        status: 200,
                        statusText: 'ok',
                        data:obj
                    })
                } else {
                    const error = new Error('Access denied!');
                    error.status = 401
                    next(error);
                }

            }

        }

    }).catch((error) => {
        logger.error(error.message)
        error.status = 500;
        next(error)
    })
}

exports.getPromotionDataTable = (req, res, next) => {
    const { Op } = require("sequelize");
    try {
        let item = +req.query.item || 0;
        let limit = +req.query.limit || 20;
        countPromotion().then((total) => {
            getPromotionDataTable({ where :{
                    deleteStatus:{
                        [Op.is]: false
                    }
                }, offset: Number(item), limit: limit}).then((result) => {
                logger.info(`${req.users.user.email} getPromotionDataTable success`);
                res.status(200).json({
                    message: 'success',
                    status: 200,
                    recordsTotal: total,
                    recordsFiltered: result.length,
                    data: result
                })
            }).catch((error => {
                const errors = new Error(error.message);
                logger.error(error.message)
                errors.status = 500;
                next(errors)
            }));
        }).catch((error => {
            const errors = new Error(error.message);
            logger.error(error.message)
            errors.status = 500;
            next(errors)
        }));

    } catch (e) {
        if (!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            logger.error(e.message)
            return next(e)
        }
    }
};
exports.deleteUpdate = (req, res, next) => {
    Model.promotions.findAll({
        attributes:['id', 'deleteStatus']
    })
        .then((data) => {
            data.forEach((v) => {
                if(v.deleteStatus === true) {
                    Model.promotions.update(
                        { deleteStatus: false },
                        { where: { id:+v.id }}
                    )
                } else {
                    Model.promotions.update(
                        { deleteStatus: true },
                        { where: { id:+v.id }}
                    )
                }
            })
            res.send('ok')
        }).catch(err => {
            res.send(err)
    })
}
exports.delete = async (req, res, next) => {
    try {
        const { id } = req.body;
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
        let promotion = await getById({id});
        if(promotion) {
            Model.promotions.update(
                { deleteStatus: 1 },
                { where: { id:+id }
                }
            ).then(() => {
                logger.info(`${req.users.user.email} delete promotion success`);
                res.status(201).json({
                    message: 'success',
                    status: 201,
                    statusText: 'ok'
                });
            }).catch((error) => {
                logger.error(error.message)
                res.status(500).json({
                    message: error.message,
                    status: 500,
                    statusText: 'error'
                });
            })
        } else {
            const error = new Error('Id promotion not found');
            logger.warn(error.message)
            error.status = 400;
            next(error)
        }
    } catch (e) {
        if (!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            logger.error(e.message)
            return next(e)
        }
    }

}
exports.replyMessagePromotion = (req, res, next) => {
    getListPromotionLine()
        .then((data) => {
            let ListPromotion = [];
            if(data) {
                data.forEach((v) => {
                    let start = moment(v.start_date);
                    let stop = moment(v.end_date);
                    let dateCheck = moment()
                    if(dateCheck.valueOf() >= start.valueOf()   &&  dateCheck.valueOf() <= stop.valueOf()) {
                        ListPromotion.push(v)
                    }
                })
            }
            if(req.body.events[0].message.text === process.env.LINE_REPLY_MESSAGE) {
                logger.info('reply Line message')
                replyMessage(req.body,ListPromotion)
            } else {
                return;
            }


        })
        .catch((e) => {
            logger.error(e.message)
            return next(e)
        })
}

exports.replyMessagePttPromotion = (req, res, next) => {
    //Promotion Ptt
    try {
        // const replyToken = req.body.events[0].replyToken || ''
        // const value = req.body.events[0].postback.data || ''
        getListPromotionLineById({brandId:2,categoryId:1}).then((data) => {
                replyPttMessage(req.body,data)
                return res.status(200).json({
                    message: 'success',
                    status: 201,
                    statusText: 'ok'
                });
        })
        .catch((e) => {
                const errors = new Error(e.message);
                logger.error(error.message)
                errors.status = 500;
                return  next(errors)
        })
      } catch (e) {
        const errors = new Error(e.message);
        logger.error(error.message)
        errors.status = 500;
        return next(errors)
      }
}
const replyMessagePttPromotions = (req) => {
    try {
        getListPromotionLineById({brandId:2,categoryId:1}).then((data) => {
            replyPttMessage(req.body,data)
        })
            .catch((e) => {
                logger.error(error.message)
            })
    } catch (e) {
        logger.error(error.message)
    }
}
exports.replyMessageGasPttLocation = (req, res, next) => {
    //gas location Ptt
    try {
        replyGasPttLocationMessage(req.body)
        return res.status(200).json({
            message: 'success',
            status: 201,
            statusText: 'ok'
        });
    } catch (e) {
        const errors = new Error(e.message);
        logger.error(errors.message)
        errors.status = 500;
        return next(errors)
    }
}
const replyMessageGasPttLocations = (req) => {
    //gas location Ptt
    try {
        replyGasPttLocationMessage(req.body)
        // return res.status(200).json({
        //     message: 'success',
        //     status: 201,
        //     statusText: 'ok'
        // });
    } catch (e) {
        const errors = new Error(e.message);
        logger.error(errors.message)
        // errors.status = 500;
        // return next(errors)
    }
}
exports.replyMessageGlassAmazonPromotion = (req, res, next) => {
    //ถ้วย Amazon
    // console.log('test')
    // const replyToken = req.body.events[0].replyToken || ''
    // const value =   req.body.events[0].message.text
    // console.log(value)
    try {
        getListPromotionLineById({brandId:3,categoryId:4}).then((data) => {
            replyGlassAmazonMessage(req.body,data)
            return res.status(200).json({
                message: 'success',
                status: 201,
                statusText: 'ok'
            });
        })
        .catch((e) => {
            const errors = new Error(e.message);
            logger.error(error.message)
            errors.status = 400;
            return next(errors)
        })
    } catch (e) {
        const errors = new Error(e.message);
        logger.error(error.message)
        errors.status = 500;
        return next(errors)
    }

}
const replyMessageGlassAmazonPromotions = (req) => {
    try {
        getListPromotionLineById({brandId:3,categoryId:4}).then((data) => {
            replyGlassAmazonMessage(req.body,data)

        })
            .catch((e) => {
                logger.error(error.message)
            })
    } catch (e) {
        logger.error(error.message)
    }

}

exports.replyMessageCafeAmazonPromotion = (req, res, next) => {
    //CafeAmazon
    // console.log('test')
    // const replyToken = req.body.events[0].replyToken || ''
    // const value =   req.body.events[0].message.text
    // console.log(value)
    try {
        getListPromotionLineById({brandId:3,categoryId:5}).then((data) => {
            replyGlassAmazonMessage(req.body,data)
            return res.status(200).json({
                message: 'success',
                status: 201,
                statusText: 'ok'
            });
        })
        .catch((e) => {
            const errors = new Error(e.message);
            logger.error(error.message)
            errors.status = 400;
            return next(errors)
        })
    } catch (e) {
        const errors = new Error(e.message);
        logger.error(error.message)
        errors.status = 500;
        return next(errors)
    }

}
const replyMessageCafeAmazonPromotions = (req) => {
    try {
        getListPromotionLineById({brandId:3,categoryId:5}).then((data) => {
            replyGlassAmazonMessage(req.body,data)

        })
            .catch((e) => {
                logger.error(e.message)
            })
    } catch (e) {
        // const errors = new Error(e.message);
        logger.error(error.message)
        // errors.status = 500;
        // return next(errors)
    }

}
exports.getTexasPromotionChicken = async () => {
    let start= moment().format('YYYY-MM-DD')
    let end = moment().format('YYYY-MM-DD')
    return await Model.promotions.findAll({
        attributes:['id', 'title', 'cover_img', 'link_out1','short_description', 'link_out_description1','link_out2', 'link_out_description2', 'end_date'],
        where:{
            status:1,
            deleteStatus:0,
            categorie_id:18,
            end_date: {
                [Op.gte]: end
            },
            start_date: {
                [Op.lte]: start
            }
        },
        order: [
            ['index', 'ASC']
        ],
        limit:10
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
    })
}
exports.getJiffyPromotion = async () => {
    let start= moment().format('YYYY-MM-DD')
    let end = moment().format('YYYY-MM-DD')
    return await Model.promotions.findAll({
        attributes:['id', 'title', 'cover_img', 'link_out1','short_description', 'link_out_description1', 'link_out2', 'link_out_description2'],
        where:{
            status:1,
            deleteStatus:0,
            categorie_id:20,
            end_date: {
                [Op.gte]: end
            },
            start_date: {
                [Op.lte]: start
            }
        },
        order: [
            ['index', 'ASC']
        ],
        limit:10
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
    })
}
exports.getJiffyPromotionPearlyTea = async () => {
    let start= moment().format('YYYY-MM-DD')
    let end = moment().format('YYYY-MM-DD')
    return await Model.promotions.findAll({
        attributes:['id', 'title', 'cover_img', 'link_out1','short_description', 'link_out_description1', 'link_out2', 'link_out_description2', 'end_date', 'start_date'],
        where:{
            status:1,
            deleteStatus:0,
            categorie_id:21,
            end_date: {
                [Op.gte]: end
            },
            start_date: {
                [Op.lte]: start
            }
        },
        order: [
            ['index', 'ASC']
        ],
        limit:10
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
    })
}

exports.getJiffyPromotionHuaSengHeng = async () => {
    let start= moment(moment().format('DD/MM/YYYY') + ' ' + '00:00', 'DD/MM/YYYY HH:mm').startOf('days').format();
    let end = moment(moment().format('DD/MM/YYYY') + ' ' + '23:59', 'DD/MM/YYYY HH:mm').endOf('days').format();
    return await Model.promotions.findAll({
        attributes:['id', 'title', 'cover_img', 'link_out1','short_description', 'link_out_description1', 'link_out2', 'link_out_description2'],
        where:{
            status:1,
            deleteStatus:0,
            categorie_id:22,
            end_date: {
                [Op.gte]: end
            },
            start_date: {
                [Op.lte]: start
            }
        },
        order: [
            ['index', 'ASC']
        ],
        limit:10
    }).then((data) => {
        return data
    }).catch((err) => {
        console.log(err)
    })
}
exports.replyMessagePromotion2 = (req, res, next) => {
    try {
        const ListRichMenu = [
            RICH_MENU_HOME,
            RICH_MENU_PTT_STATION,
            RICH_MENU_AMAZON,
            RICH_MENU_BLUE_CARD,
            RICH_MENU_PTT_LUBRICANTS,
            RICH_MENU_TEXAS,
            RICH_MENU_JIFFTY
        ]
        const actionType = req.body.events[0].type;
        console.log('actionType ==',actionType);
        if(actionType === 'message') {
            const messageAction = req.body.events[0].message.text;
            const userId = req.body.events[0].source.userId;
            const replyToken = req.body.events[0].replyToken;
            switch (messageAction) {
                case 'ราคาน้ำมันวันนี้':replyMessagePriceOli(req, userId)
                    .then((data)=> data)
                    .catch(()=> setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId}))
                    break;
                case 'ทำนายดวงตามราศี': BlueCardLine.replyBlueCardPrivilege(req.body)
                    break;
                case 'โปรโมชั่น Texas Chicken': replyMessageTexasPromotion({replyToken: replyToken})
                    .then((data)=> data)
                    .catch(()=> setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId}))
                    break;
                case 'สั่งไก่ Texas Chicken ออนไลน์': replyMessageOrderTexasChicken(req.body,userId)
                    break;
                case 'ค้นหา Texas Chicken ใกล้คุณ': replyMessageSearchTexasChicken(req.body,userId)
                    break;
                case 'โปรโมชั่น Jiffy': replyMessageJiffyPromotion({replyToken: replyToken})
                    .then((data)=> data)
                    .catch(()=> setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId}))
                    break;
                case 'โปรโมชั่น Pearly Tea': replyMessageJiffyPromotionPearlyTea({replyToken: replyToken})
                    .then((data)=> data)
                    .catch(()=> setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId}))
                    break;
                case 'โปรโมชั่น HuaSengHong Dimsum': replyMessageJiffyHuaSengHeng({replyToken: replyToken})
                    .then((data)=> data)
                    .catch(()=> setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId}))
                    break;
                case 'คอลเลคชั่นแก้วน้ำ': replyMessageGlassAmazonPromotions(req);
                    break;
                case 'โปรโมชั่น Café Amazon': replyMessageCafeAmazonPromotions(req)
                    break;
                case 'ค้นหา Café Amazon ใกล้คุณ': replyMessageSearchAmazon(req.body,userId)
                    break;
                case 'โปรโมชั่น PTT Station': replyMessagePttPromotions(req)
                    break;
                case 'ค้นหา PTT Station ใกล้คุณ': replyMessageGasPttLocations(req)
                    break;
                case 'สิทธิพิเศษ Blue Card': BlueCardLine.replyBlueCardPrivilege(req.body)
                    break;
                case 'โปรโมชั่น Blue Card': BlueCardLine.replyBlueCardPromotion(req.body)
                    break;
                case 'Reward แลกคะแนนสะสม': BlueCardLine.replyBlueCardReward(req.body)
                    break;
                case 'ค้นหา PTT Station จากชนิดน้ำมัน': replyMessageGasPttLocations(req)
                    break;
                default : setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId}) //PttLubricants
                    break;
            }
        } else if (actionType === 'postback') {
            const postBackAction = req.body.events[0].postback.data;
            const userId = req.body.events[0].source.userId;

            switch (postBackAction) {
                case 'ptt_station':setNewRichMenu({richMenuId:ListRichMenu[1],userId:userId});
                    break;
                case 'ptt_home':setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId});
                    break;
                case 'ptt_amazon': setNewRichMenu({richMenuId:ListRichMenu[2],userId:userId});
                    break;
                case 'ptt_blue_card': setNewRichMenu({richMenuId:ListRichMenu[3],userId:userId});
                    break;
                case 'ptt_lubricants': setNewRichMenu({richMenuId:ListRichMenu[4],userId:userId});
                    break;
                case 'ptt_texas': setNewRichMenu({richMenuId:ListRichMenu[5],userId:userId});
                    break;
                case 'ptt_hua_seng_hong': setNewRichMenu({richMenuId:ListRichMenu[6],userId:userId});
                    break;
                case 'ptt_lub_fit': PttLubricants.replyPttFitService(req.body);
                    break;
                case 'ptt_lub_product': PttLubricants.replyPttFitProduct(req.body);
                    break;
                case 'ptt_lub_promotion': PttLubricants.replyPttFitPromotion(req.body);
                    break;
                default : setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId});
                    break
            }
        } else {
            //เพิ่ม UserID
            const userId = req.body.events[0].source.userId;
            setNewRichMenu({richMenuId:ListRichMenu[0],userId:userId});
        }
        res.send('OK')
    } catch (e) {
        console.log(e.stack)
        e.status =400
        e.message = e.stack
        next(e)
    }
}
exports.ListAllPromotion = async (req, res, next) => {
    let item = +req.query.item || 0;
    let limit = +req.query.limit || 20;
    let count = await Model.promotions.count()
        .then((count) => count)
        .catch((error) => error)
    Model.promotions.findAll({
        attributes:[
            'id', 'title', 'cover_img', 'link_out1',
            'short_description', 'link_out_description1',
            'link_out2', 'link_out_description2','status',
            'start_date', 'end_date', 'body', 'deleteStatus'
        ],
        order: [
            ['createdAt', 'DESC']
        ],
        include:[
            {
                model: Model.brands , as: 'brands',
                attributes: ['id', 'title']

            },
            {
                model: Model.categories , as: 'categories',
                attributes: ['id', 'title']

            }
        ],
        offset: Number(item), limit: limit
    }).then(async (data) => {
        let list = [];
        if(data) {
            data.forEach((value => {
                let obj = Object.assign({
                    "id": value.id,
                    "title": value.title,
                    "short_description": entities.decode(value.short_description),
                    "user_id": value.user_id,
                    "brand_id": value.brand_id,
                    "categories_id": value.categorie_id,
                    "start_date": value.start_date,
                    "end_date": value.end_date,
                    "cover_img": value.cover_img,
                    "img_url": AWS.getSignedUrls({key:value.cover_img }),
                    "link_out1": value.link_out1,
                    "link_out_description1":value.link_out_description1,
                    "link_out2": value.link_out2,
                    "link_out_description2":value.link_out_description2,
                    "index":value.index,
                    "link_public": value.link_public,
                    "body": entities.decode(value.body),
                    "status": value.status,
                    "createdAt": value.createdAt,
                    "updatedAt": value.updatedAt,
                    "brands": value.brands,
                    "categories": value.categories,
                    "deleteStatus": value.deleteStatus

                })
                list.push(obj)
            }))
        }
        res.status(200).json({
            message:'success',
            total:count,
            current: data.length,
            data:list
        })
    }).catch((error) => {
        console.log(error.stack)
        const err = new Error(error.message);
        err.status = 500;
        next(err)
    })
}
