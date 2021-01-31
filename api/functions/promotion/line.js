const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;
const FRONT_URL = process.env.FRONT_URL;
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LINE_SECRET_KEY}`
};
const request = require('request-promise');
const AWS = require('../../middleware/aws');
const PromotionController = require('../../controller/promotion');
const {getOilPrice} = require('../../functions/oilPrice/oilPrice');
const { setDefaultActionsLinkOut} = require('../../functions/promotion/promotion')
const entities = require("entities");


const createLinkLineComponent = (v) => {
    let listLinkOut = {};
    listLinkOut = {
        "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
        "title": v.title ? v.title : '',
        "text": v.short_description ? v.short_description : '',
        "actions":setDefaultActionsLinkOut(v),
        "imageBackgroundColor": "#FFFFFF"
    }
    return listLinkOut;
}
exports.createLinkLineComponent = createLinkLineComponent;
exports.replyMessage = (bodyResponse, data) => {
    let ListContent = []
    if (data.length !== 0) {
        data.forEach((v) => {
            ListContent.push(
                {
                    "type": "bubble",
                    "hero": {
                        "type": "image",
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "url": AWS.getSignedUrls({key: v.cover_img})
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "text",
                                "text": v.title,
                                "wrap": true,
                                "weight": "bold",
                                "size": "xl"
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                        "type": "text",
                                        "color": "#0C0202FF",
                                        "text": v.categories ? v.categories.title : '',
                                        "wrap": true,
                                        "weight": "regular",
                                        "size": "md",
                                        "flex": 0
                                    }
                                ]
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "button",
                                "color": "#2E87BC",
                                "action": {
                                    "type": "uri",
                                    "label": "ดูรายละเอียด",
                                    // "weight": "bold",
                                    "uri": `${FRONT_URL}${v.id}`
                                }
                            }
                        ]
                    }
                }
            )
        })

        return request({
            method: `POST`,
            uri: `${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
                replyToken: bodyResponse.events[0].replyToken,
                messages: [
                    {
                        "type": "flex",
                        "altText": "This is a Flex Message",
                        "contents": {
                            "type": "carousel",
                            "contents": ListContent
                        }
                    }
                ]
            })
        }).then((data) => {
            console.log(data)
        });
    } else {
        return null;
    }

};


exports.replyPttMessage = (bodyResponse, data) => {
    let ListContent = []
    if (data.length !== 0) {
        data.forEach((v) => {
            ListContent.push(
                {
                    "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
                    "title": v.title ? v.title : '',
                    "text": v.short_description ? v.short_description : '',
                    "actions": setDefaultActionsLinkOut(v),
                    "imageBackgroundColor": "#FFFFFF"
                }
            )
        })
    } else {
        return null;
    }
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: bodyResponse.events[0].replyToken,
            messages: [
                {
                    "type": "template",
                    "altText": "Ptt โปรโมชั่น",
                    "template": {
                        "type": "carousel",
                        "imageAspectRatio": "square",
                        "columns": ListContent,
                    }
                }
            ]
        })
    }).then((data) => {

    });
};
exports.replyGlassAmazonMessage = (bodyResponse, data) => {
    let ListContent = []
    if (data.length !== 0) {
        data.forEach((v) => {
            ListContent.push(
                {
                    "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
                    "title": v.title ? v.title : '',
                    "text": v.short_description ? v.short_description : '',
                    "actions": setDefaultActionsLinkOut(v),
                    "imageBackgroundColor": "#FFFFFF"
                }
            )
        })
    } else {
        return null;
    }
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: bodyResponse.events[0].replyToken,
            messages: [
                {
                    "type": "template",
                    "altText": "Amazon โปรโมชั่น",
                    "template": {
                        "type": "carousel",
                        "imageAspectRatio": "square",
                        "columns": ListContent,
                    }
                }
            ]
        })
    }).then((data) => {

    });
};

exports.replyGasPttLocationMessage = (bodyResponse) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: bodyResponse.events[0].replyToken,
            messages: [
                {
                    "type": "imagemap",
                    "baseUrl": "https://cdn.discordapp.com/attachments/453112054497411093/791879558273826846/oil-type.png?w=1040",
                    "altText": "ค้นหาสถานีจากชนิดน้ำมัน",
                    "baseSize": {
                      "width": 1040,
                      "height": 1040
                    },
                    "actions": [
                      {
                        "type": "uri",
                        "area": {
                          "x": 5,
                          "y": 16,
                          "width": 1026,
                          "height": 1015
                        },
                        "linkUri": "https://www.pttstation.com/"
                      }
                    ]
                  }
            ]
        })
    }).then((data) => {

    });
};
exports.setNewRichMenu = ({richMenuId, userId}) => {
    return request({
        method: `POST`,
        uri: `https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`,
        headers: LINE_HEADER
    }).then((data) => {
        console.log(data)
        return data
    });
}
exports.replyMessageGodJi = (bodyResponse, userId) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: userId,
            messages: [
                {
                    type: "imagemap",
                    baseUrl: "https://charabizasia.files.wordpress.com/2017/07/main-1.jpg?w=1040",
                    altText: "This is an imagemap",
                    baseSize: {
                        width: 1040,
                        height: 623
                    },
                    video: {
                        originalContentUrl: "https://mokmoon.com/videos/Brown.mp4",
                        previewImageUrl: "https://linefriends.com/img/bangolufsen/img_og.jpg",
                        area: {
                            x: 260,
                            y: 155,
                            width: 540,
                            height: 360
                        },
                        externalLink: {
                            linkUri: "https://line.me",
                            label: "See More"
                        }
                    },
                    actions: [
                        {
                            type: "uri",
                            linkUri: "https://developers.line.biz",
                            area: {
                                x: 0,
                                y: 0,
                                width: 320,
                                height: 320
                            }
                        },
                        {
                            type: "message",
                            text: "Hello",
                            area: {
                                x: 720,
                                y: 303,
                                width: 320,
                                height: 320
                            }
                        }
                    ]
                }
            ]
        })
    }).then((data) => {
        console.log(data.status)
    }).catch((err) => {
        console.info(err)
    })

};
exports.replyMessageOrderTexasChicken = (bodyResponse, userId) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: userId,
            messages: [
                {
                    "type": "imagemap",
                    "baseUrl": "https://cdn.discordapp.com/attachments/486388149665267733/791923946232479784/texas-delivery.png?w=1040",
                    "altText": "สั่งไก่ Texas Chicken ออนไลน์",
                    "baseSize": {
                        "width": 1040,
                        "height": 1040
                    },
                    "actions": [
                        {
                            "type": "uri",
                            "area": {
                                "x": 19,
                                "y": 29,
                                "width": 494,
                                "height": 484
                            },
                            "linkUri": "https://grab.onelink.me/2695613898?pid=FacebookAds_Organic&c=TH182WPAT1TEXASNEW_GFTH_SOCIALMEDIA_FB&is_retargeting=true&af_dp=grab://open?screenType=GRABFOOD&taxiTypeId=5270&merchantIDs=THGFIST000009yt,THGFIST000003lf,THGFIST000003ok,THGFIST000008p5,THGFIST000009yx,THGFIST0000005a,THGFIST000001af,THGFIST000004sr,THGFIST000003qx,THGFIST000009ys,THGFIST000009yu,THGFIST000009yw,THGFIST000002tp,THGFIST000008o8,THGFIST000009yv,THGFIST00000640&af_web_dp=https://www.grab.com/id/download"
                        },
                        {
                            "type": "uri",
                            "area": {
                                "x": 527,
                                "y": 24,
                                "width": 503,
                                "height": 487
                            },
                            "linkUri": "https://gojek.onelink.me/2351932542?pid=partner&c=texas&af_click_lookback=30d&af_dp=gojek://gofood/brand/fdc98e8d-bc78-40f3-8f62-cdf76d770407&af_web_dp=https://www.gojek.com/th/%3Futm_source%3Dpartner%26utm_medium%3Dorganic%26utm_campaign%3Dtexas"
                        },
                        {
                            "type": "uri",
                            "area": {
                                "x": 17,
                                "y": 536,
                                "width": 503,
                                "height": 483
                            },
                            "linkUri": "https://app.adjust.com/fsgw5kh_drze69g?campaign=promo_app_th_facebook_TexasChicken&adgroup=facebook&deeplink=foodpanda://%3Fc%3Dth%26s%3Ds&fallback=https://www.foodpanda.co.th/chain/ch1eg/texas-chicken%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dpromo_TexasChicken_facebook"
                        },
                        {
                            "type": "uri",
                            "area": {
                                "x": 530,
                                "y": 537,
                                "width": 498,
                                "height": 484
                            },
                            "linkUri": "https://bit.ly/2zxCAut"
                        }
                    ]
                }
            ]
        })
    }).then((data) => {
        console.log(data.status)
    }).catch((err) => {
        console.info(err)
    })

};
exports.replyMessageSearchTexasChicken = (bodyResponse, userId) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: userId,
            messages: [
                {
                    type: "template",
                    altText: "This is a buttons template",
                    template: {
                        type: "buttons",
                        imageAspectRatio: "rectangle",
                        imageSize: "cover",
                        imageBackgroundColor: "#FFFFFF",
                        title: "ค้นหา Texas Chicken",
                        text: "Texas Chicken",
                        defaultAction: {
                            type: "uri",
                            label: "View detail",
                            uri: "https://www.google.co.th/maps"
                        },
                        actions: [
                            // {
                            //     type: "postback",
                            //     label: "Buy",
                            //     data: "action=buy&itemid=123"
                            // },
                            {
                                type: "uri",
                                label: "ค้นหา Texas Chicken",
                                uri: "https://www.google.co.th/maps"
                            }
                        ]
                    }
                }
            ]
        })
    }).then((data) => {
        console.log(data.status)
    }).catch((err) => {
        console.info(err)
    })

};
exports.replyMessageSearchAmazon = (bodyResponse, userId) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: userId,
            messages: [
                {
                    type: "template",
                    altText: "This is a buttons template",
                    template: {
                        type: "buttons",
                        imageAspectRatio: "rectangle",
                        imageSize: "cover",
                        imageBackgroundColor: "#FFFFFF",
                        title: "ค้นหา Café Amazon",
                        text: "Café Amazon",
                        defaultAction: {
                            type: "uri",
                            label: "View detail",
                            uri: "https://www.google.co.th/maps"
                        },
                        actions: [
                            // {
                            //     type: "postback",
                            //     label: "Buy",
                            //     data: "action=buy&itemid=123"
                            // },
                            {
                                type: "uri",
                                label: "Café Amazon ใกล้คุณ",
                                uri: "https://www.google.co.th/maps"
                            }
                        ]
                    }
                }
            ]
        })
    }).then((data) => {
        console.log(data.status)
    }).catch((err) => {
        console.info(err)
    })

};
exports.replyMessageTexasPromotion = async ({replyToken}) => {
    let getList = await PromotionController.getTexasPromotionChicken();
    let ListContent = [];
    if (getList) {
        getList.forEach((v) => {
            ListContent.push(
                createLinkLineComponent(v)
            )
        })
    }
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: replyToken,
            messages: [
                {
                    "type": "template",
                    "altText": "โปรโมชั่น",
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
    }).catch((err) => {
        console.log("err ==", err)
    });
}
exports.replyMessageJiffyPromotion = async ({replyToken}) => {
    let getList = await PromotionController.getJiffyPromotion();
    let ListContent = [];
    if (getList) {
        getList.forEach((v) => {
            console.log(v)
            ListContent.push(
                createLinkLineComponent(v)
            )
        })
    }
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: replyToken,
            messages: [
                {
                    "type": "template",
                    "altText": "รายการโปรโมชั่น",
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
exports.replyMessageJiffyPromotionPearlyTea = async ({replyToken}) => {
    let getList = await PromotionController.getJiffyPromotionPearlyTea();
    let ListContent = [];
    console.log('getList:', getList)
    if (getList) {
        getList.forEach((v) => {
            ListContent.push(
                createLinkLineComponent(v)
            )
        })
    }
    if(ListContent.length !== 0) {
        return request({
            method: `POST`,
            uri: `${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
                replyToken: replyToken,
                messages: [
                    {
                        "type": "template",
                        "altText": "รายการโปรโมชั่น",
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

}
exports.replyMessageJiffyHuaSengHeng = async ({replyToken}) => {
    let getList = await PromotionController.getJiffyPromotionHuaSengHeng();
    let ListContent = [];
    if (getList) {
        getList.forEach((v) => {
            ListContent.push(
                {
                    "thumbnailImageUrl": AWS.getSignedUrls({key: v.cover_img}),
                    "title": v.title ? v.title : '',
                    "text": v.short_description ? v.short_description : '',
                    "actions":setDefaultActionsLinkOut(v),
                    "imageBackgroundColor": "#FFFFFF"
                }
            )
        })
    }
    if(ListContent.length !== 0) {
        return request({
            method: `POST`,
            uri: `${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
                replyToken: replyToken,
                messages: [
                    {
                        "type": "template",
                        "altText": "รายการโปรโมชั่น",
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

}
exports.replyMessagePriceOli = async (bodyResponse, userId) => {

    let cover_img = await getOilPrice().then(async (result) => {
        if (result.length > 0) {
            return result[0].cover_img
        } else {
            return ''
        }
    }).catch((error => {
        return ''
    }));
    const linkImagesPublic = `${process.env.S3_URL}/${cover_img}`
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: userId,
            messages: [
                {
                    "type": "imagemap",
                    "baseUrl": linkImagesPublic.concat("?w=1040"),
                    "altText": "ราคาน้ำมันวันนี้",
                    "baseSize": {
                        "width": 1040,
                        "height": 1040
                    },
                    "actions": []
                }
            ]
        })
    }).then((data) => {
        console.log("data ==", data.status)
    }).catch((err) => {
        console.info(err)
    })
}