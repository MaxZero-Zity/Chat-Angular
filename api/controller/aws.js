const AWS = require('../middleware/aws');
const log4js = require('log4js');
const logger = log4js.getLogger();
exports.getListBucket = (req, res, next) => {
    AWS.getBucket((error, data) => {
        if (error) {
            const errors = new Error(error.message);
            logger.warn(errors.message)
            next(errors);
        } else {
            let BucketList = [];
            if (data.Buckets.length === 0) {
                res.status(200).json({
                    message: 'success',
                    status: 200,
                    statusText: 'error',
                    list: BucketList
                });
            } else {
                data.Buckets.forEach((v) => {
                    BucketList.push({
                        name: v.Name
                    })
                });
                res.status(200).json({
                    message: 'success',
                    status: 200,
                    statusText: 'ok',
                    list: BucketList
                });
            }
        }
    });
}

exports.getListObject = (req, res, next) => {
    AWS.listObjects((err, data) => {
        if (err) {
            const error = new Error(err.message);
            logger.warn(error.message)
            next(error);
        } else {
            let ListContent = [];
            data.Contents.forEach((value => {
                ListContent.push(value)
            }))
            res.status(200).json({
                message:'success',
                status:200,
                statusText:'ok',
                data:ListContent
            })
        }
    })
}
exports.putObjects = (req, res, next) => {
    const key = new Date().getMilliseconds().toString();
    AWS.putObject({
        file: req.files.files.data, key:key, cb: (err, data) => {
            if (err) {
                const error = new Error(err.message);
                logger.warn(err.message)
                error.status = 500;
                next(error);
            } else {
                res.send('Ok');
            }
        }
    })
}
exports.getUrl = (req, res, next) => {
    try {
        let url = AWS.getSignedUrls({key:req.params.key});
        res.status(200).json({
            message:'success',
            status:200,
            statusText:'ok',
            data:url
        })
    } catch (e) {
        const error = new Error(e.message);
        logger.warn(e.message)
        error.status =500;
        next(error)
    }
}