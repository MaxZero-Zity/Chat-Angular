const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;
const FRONT_URL = process.env.FRONT_URL;
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LINE_SECRET_KEY}`
};
const request = require('request-promise');
const AWS = require('../../middleware/aws');
const {setDefaultActionsLinkOut} = require('../../functions/promotion/promotion')
const {getListPromotionLine} = require('./promotion');
const log4js = require('log4js');
const logger = log4js.getLogger();
const moment = require('moment');

exports.replyBlueCardPrivilege = (bodyResponse) => {
    getListPromotionLine("Privilege Blue Card")
        .then((data) => {
            let ListContent = [];
            if (data) {
                data.forEach((v) => {
                    let start = moment(v.start_date);
                    let stop = moment(v.end_date);
                    let dateCheck = moment()
                    if (dateCheck.valueOf() >= start.valueOf() && dateCheck.valueOf() <= stop.valueOf()) {
                        ListContent.push(
                            {
                                "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
                                "title": v.title ? v.title : '',
                                "text": v.short_description ? v.short_description : '',
                                "actions": setDefaultActionsLinkOut(v),
                                "imageBackgroundColor": "#FFFFFF"
                            }
                        )
                    }
                })
                if (ListContent.length !== 0) {
                    return request({
                        method: `POST`,
                        uri: `${LINE_MESSAGING_API}/reply`,
                        headers: LINE_HEADER,
                        body: JSON.stringify({
                            replyToken: bodyResponse.events[0].replyToken,
                            messages: [
                                {
                                    "type": "template",
                                    "altText": "BlueCardPrivilege",
                                    "template": {
                                        "type": "carousel",
                                        "imageAspectRatio": "square",
                                        "columns": ListContent,
                                    }
                                }
                            ]

                        })
                    }).then((data) => {
                        console.log(data)
                    });
                }

            } else {
                return null;
            }
        })
        .catch((e) => {
            logger.error(e.message)
        })
};
exports.replyBlueCardPromotion = (bodyResponse) => {
    getListPromotionLine("Promotion Blue Card")
        .then((data) => {
            let ListContent = [];
            if (data) {
                data.forEach((v) => {
                    let start = moment(v.start_date);
                    let stop = moment(v.end_date);
                    let dateCheck = moment()
                    if (dateCheck.valueOf() >= start.valueOf() && dateCheck.valueOf() <= stop.valueOf()) {
                        ListContent.push(
                            {
                                "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
                                "title": v.title ? v.title : '',
                                "text": v.short_description ? v.short_description : '',
                                "actions": setDefaultActionsLinkOut(v),
                                "imageBackgroundColor": "#FFFFFF"
                            }
                        )
                    }
                })
                if (ListContent.length !== 0) {
                    return request({
                        method: `POST`,
                        uri: `${LINE_MESSAGING_API}/reply`,
                        headers: LINE_HEADER,
                        body: JSON.stringify({
                            replyToken: bodyResponse.events[0].replyToken,
                            messages: [
                                {
                                    "type": "template",
                                    "altText": "BlueCardPrivilege",
                                    "template": {
                                        "type": "carousel",
                                        "imageAspectRatio": "square",
                                        "columns": ListContent,
                                    }
                                }
                            ]

                        })
                    }).then((data) => {
                        console.log(data)
                    });
                }

            } else {
                return null;
            }
        })
        .catch((e) => {
            logger.error(e.message)
            return next(e)
        })
};
exports.replyBlueCardReward = (bodyResponse) => {
    getListPromotionLine("Reward Blue Card")
        .then((data) => {
            let ListContent = [];
            if (data) {
                data.forEach((v) => {
                    let start = moment(v.start_date);
                    let stop = moment(v.end_date);
                    let dateCheck = moment()
                    if (dateCheck.valueOf() >= start.valueOf() && dateCheck.valueOf() <= stop.valueOf()) {
                        ListContent.push(
                            {
                                "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
                                "title": v.title ? v.title : '',
                                "text": v.short_description ? v.short_description : '',
                                "actions":setDefaultActionsLinkOut(v),
                                "imageBackgroundColor": "#FFFFFF"
                            }
                        )
                    }
                })
                if(ListContent.length !== 0 ) {
                    return request({
                        method: `POST`,
                        uri: `${LINE_MESSAGING_API}/reply`,
                        headers: LINE_HEADER,
                        body: JSON.stringify({
                            replyToken: bodyResponse.events[0].replyToken,
                            messages: [
                                {
                                    "type": "template",
                                    "altText": "BlueCardPrivilege",
                                    "template": {
                                        "type": "carousel",
                                        "imageAspectRatio": "square",
                                        "columns": ListContent,
                                    }
                                }
                            ]

                        })
                    }).then((data) => {
                        console.log(data)
                    });
                }
            } else {
                return null;
            }
        })
        .catch((e) => {
            logger.error(e.message)
            return next(e)
        })
};