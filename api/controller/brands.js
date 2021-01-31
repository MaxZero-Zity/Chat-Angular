const {validationResult} = require('express-validator');
const {
    findBrandsByTitle,
    findBrandsById,
    createBrands,
    editBrands,
    deleteBrands,
    getBrandsDataTable,
    getListBrands,
    countBrands
} = require('../functions/brands/brands');
const {createUserLog} = require('../functions/userLog/userLog');
const log4js = require('log4js');
const logger = log4js.getLogger();
exports.getBrandsDataTable = (req, res, next) => {
    try {
        let item = +req.query.item || 0;
        let limit = +req.query.limit || 10;
        countBrands().then((total) => {
            getBrandsDataTable({offset: item, limit: limit}).then((result) => {
                logger.info(`${req.users.user.email} getBrandsDataTable success`);
                res.status(201).json({
                    status: true,
                    message: 'ดึงข้อมูลสำเร็จ',
                    recordsTotal: total,
                    recordsFiltered: result.length,
                    data: result
                })
            }).catch((error => {
                const errors = new Error(error.message);
                logger.error(errors.message)
                errors.status = 500;
                next(errors)
            }));
        }).catch((error => {
            const errors = new Error(error.message);
            logger.error(errors.message)
            errors.status = 500;
            next(errors)
        }));

    } catch (e) {
        if (!e.status) {
            e.status = 500;
            logger.error(e.message)
            return next(e)
        } else {
            return next(e)
        }
    }
};

exports.createBrands = (req, res, next) => {
    //สร้าง Brands
    try {
        const userId = +req.users.user.user_id || 0;
        const {title, status} = req.body;
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
        } else {
            //เช็ค ชื่อ Brands
            findBrandsByTitle({title: title}).then((result) => {
                // console.log('result==',result);
                //insert Brands
                createBrands({title: title, status: status})
                    .then((result) => {
                        //ใส่ userslog
                        createUserLog({
                            title: 'สร้าง brand',
                            userId: +userId,
                            brandId: +result.id,
                            categoriesId: 0,
                            promotionId: 0
                        })
                        logger.info(`${req.users.user.email} createBrands success`);
                        res.status(201).json({
                            message: 'create success',
                            status: 201,
                            statusText: 'ok'
                        });
                    }).catch((error) => {
                    logger.error(error.message);
                    return res.status(500).json({
                        message: error.message,
                        statusCode: 500,
                        statusText: 'error',
                    });
                });
            }).catch((error => {
                logger.error(error.message);
                return res.status(500).json({
                    message: error.message,
                    statusCode: 500,
                    statusText: 'error',
                });
            }));
        }
    } catch (e) {
        if (!e.status) {
            e.status = 500;
            logger.error(error.message);
            return next(e)
        } else {
            logger.error(error.message);
            return next(e)
        }
    }
};


exports.editBrands = (req, res, next) => {
    //แก้ไข Brands
    try {
        const userId = +req.users.user.user_id || 0;
        const {id, title, status} = req.body;
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
        } else {
            // //เช็ค ชื่อ Brands
            findBrandsById({id: +id}).then((result) => {
                //console.log('result==',result);
                //edit Brands
                editBrands({id: +id, title: title, status: status})
                    .then((result) => {
                        createUserLog({
                            title: 'แก้ไข brand',
                            userId: +userId,
                            brandId: +id,
                            categoriesId: 0,
                            promotionId: 0
                        })
                        logger.info(`${req.users.user.email} editBrands success`);
                        res.status(201).json({
                            message: 'edit success',
                            status: 201,
                            statusText: 'ok'
                        });
                    }).catch((error) => {
                    return res.status(422).json({
                        message: error.message,
                        statusCode: error.status,
                        statusText: 'error',
                    });
                });
            }).catch((error => {
                return res.status(400).json({
                    message: error.message,
                    statusCode: error.status,
                    statusText: 'error',
                });
            }));
        }
    } catch (e) {
        if (!e.status) {
            e.status = 500;
            return next(e)
        } else {
            return next(e)
        }
    }
};


exports.deleteBrands = (req, res, next) => {
    try {
        const userId = +req.users.user.user_id || 0;
        const {id} = req.body;
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
        } else {
            // //เช็ค ชื่อ Brands
            findBrandsById({id: +id}).then((result) => {
                //console.log('result==',result);
                //edit Brands
                deleteBrands({id: +id})
                    .then((result) => {
                        createUserLog({
                            title: 'ลบ brand',
                            userId: +userId,
                            brandId: +id,
                            categoriesId: 0,
                            promotionId: 0
                        })
                        logger.info(`${req.users.user.email} deleteBrands success`);
                        res.status(201).json({
                            message: 'delete success',
                            status: 201,
                            statusText: 'ok'
                        });
                    }).catch((error) => {
                    return res.status(422).json({
                        message: error.message,
                        statusCode: error.status,
                        statusText: 'error',
                    });
                });
            }).catch((error => {
                return res.status(400).json({
                    message: error.message,
                    statusCode: error.status,
                    statusText: 'error',
                });
            }));
        }
    } catch (e) {
        if (!e.status) {
            e.status = 500;
            return next(e)
        } else {
            return next(e)
        }
    }
}

exports.getListBrands = (req, res, next) => { 
    try {
            getListBrands().then((result) => {
                logger.info(`${req.users.user.email} getListBrands success`);
                res.status(201).json({
                    status: true,
                    message: 'ดึงข้อมูลสำเร็จ',
                    data: result
                })
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
};
