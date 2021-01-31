const { validationResult } = require('express-validator');
const { findCategoriesByTitle,
    findCategoriesById , 
    createCategories,
    editCategories,
    deleteCategories,
    getCategoriesDataTable,
    getListCategories,
    countCategories 
} = require('../functions/categories/categories');
const { createUserLog } = require('../functions/userLog/userLog');
const log4js = require('log4js');
const logger = log4js.getLogger();

exports.getCategoriesDataTable = (req, res, next) => { 
    try {
            let item = +req.query.item || 0;
            let limit = +req.query.limit || 10;
            countCategories().then((total)=>{
                getCategoriesDataTable({offset: item,limit: limit}).then((result) => {
                    logger.info(`${req.users.user.email} createCategories success`);
                    res.status(201).json({
                        status: true,
                        message: 'ดึงข้อมูลสำเร็จ',
                        recordsTotal: total,
                        recordsFiltered: result.length,
                        data: result
                    })
                }).catch((error => {
                    logger.error(error.message)
                    return res.status(500).json({
                        message:error.message,
                        statusCode:500,
                        statusText:'error',
                    });
                }));
            }).catch((error => {
                logger.error(error.message)
                return res.status(500).json({
                    message:error.message,
                    statusCode:500,
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
};

exports.createCategories = (req, res, next) => {
    //สร้าง Categories
    try {
        const userId = +req.users.user.user_id || 0;
        const { title, status } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array());
            return res.status(422).json({
                message:error.message,
                statusCode:error.status,
                statusText:'error',
                errors: errors.array()
            });
        }else{
            //เช็ค ชื่อ Categories
            findCategoriesByTitle({title:title}).then((result) => {
                // console.log('result==',result);
                //insert Categories
                createCategories({title:title,status:status})
                .then((result) =>{
                    //ใส่ userslog
                    createUserLog({title:'สร้าง category',userId:+userId,brandId:0,categoriesId:+result.id,promotionId:0})
                    logger.info(`${req.users.user.email} createCategories success`);
                    res.status(201).json({
                        message:'create success',
                        status:201,
                        statusText:'ok'
                    });
                }).catch((error) =>{
                    logger.error(error.message)
                    return res.status(500).json({
                        message:error.message,
                        statusCode:500,
                        statusText:'error',
                    });
                });
            }).catch((error => {
                logger.error(error.message)
                return res.status(500).json({
                    message:error.message,
                    statusCode:500,
                    statusText:'error',
                });
            }));
        }
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            logger.error(e.message)
            return next(e)
        }
    }
};


exports.editCategories = (req, res, next) => {
    //แก้ไข Categories
    try {
        const userId = +req.users.user.user_id || 0;
        const { id,title, status } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array());
            return res.status(422).json({
                message:error.message,
                statusCode:error.status,
                statusText:'error',
                errors: errors.array()
            });
        }else{
            // //เช็ค ชื่อ Categories
            findCategoriesById({id:+id}).then((result) => {
                //console.log('result==',result);
                //edit Categories
                editCategories({id:+id,title:title,status:status})
                .then((result) =>{
                    createUserLog({title:'แก้ไข category',userId:+userId,brandId:0,categoriesId:+id,promotionId:0})
                    logger.info(`${req.users.user.email} editCategories success`);
                    res.status(201).json({
                        message:'edit success',
                        status:201,
                        statusText:'ok'
                    });
                }).catch((error) =>{
                    logger.error(error.message)
                    return res.status(500).json({
                        message:error.message,
                        statusCode:500,
                        statusText:'error',
                    });
                });
            }).catch((error => {
                logger.error(error.message)
                return res.status(500).json({
                    message:error.message,
                    statusCode:500,
                    statusText:'error',
                });
            }));
        }
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            logger.error(e.message)
            return next(e)
        }
    }
};


exports.deleteCategories = (req,res,next) =>{
    try {
        const userId = +req.users.user.user_id || 0;
        const { id } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check your body');
            error.status = 422;
            error.error = errors.array();
            logger.warn(error.message)
            logger.warn(errors.array());
            return res.status(422).json({
                message:error.message,
                statusCode:error.status,
                statusText:'error',
                errors: errors.array()
            });
        }else{
            // //เช็ค ชื่อ Categories
            findCategoriesById({id:+id}).then((result) => {
                //console.log('result==',result);
                //edit Categories
                deleteCategories({id:+id})
                .then((result) =>{
                    createUserLog({title:'ลบ category',userId:+userId,brandId:0,categoriesId:+id,promotionId:0})
                    logger.info(`${req.users.user.email} deleteCategories success`);
                    res.status(201).json({
                        message:'delete success',
                        status:201,
                        statusText:'ok'
                    });
                }).catch((error) =>{
                    logger.error(error.message)
                    return res.status(500).json({
                        message:error.message,
                        statusCode:500,
                        statusText:'error',
                    });
                });
            }).catch((error => {
                logger.error(error.message)
                return res.status(500).json({
                    message:error.message,
                    statusCode:error.status,
                    statusText:'error',
                });
            }));
        }
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            logger.error(e.message)
            return next(e)
        }
    }
}

exports.getListCategories = (req, res, next) => { 
    try {
            getListCategories().then((result) => {
                logger.info(`${req.users.user.email} getListCategories success`);
                res.status(201).json({
                    status: true,
                    message: 'ดึงข้อมูลสำเร็จ',
                    data: result
                })
            }).catch((error => {
                logger.error(error.message)
                return res.status(500).json({
                    message:error.message,
                    statusCode:500,
                    statusText:'error',
                });
            }));            
    } catch (e) {
        if(!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            logger.error(e.message)
            return next(e)
        }
    }
};
