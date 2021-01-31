const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.LINE_SECRET_KEY}`
};
const request = require('request-promise');
const AWS = require('../../middleware/aws');
const { getListPromotionLine } = require('./promotion');
const { setDefaultActionsLinkOut }= require('../../functions/promotion/promotion')
const log4js = require('log4js');
const logger = log4js.getLogger();
const moment = require('moment');
const {createLinkLineComponent  } = require('./line')
exports.replyPttFitService = (bodyResponse, data) => {

  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          "type": "imagemap",
          "baseUrl": "https://firebasestorage.googleapis.com/v0/b/my-project-e122f.appspot.com/o/fit.png?alt=media&token=6e611a44-b354-4b14-a075-ce7d275c7991&w=auto",
          "altText": "This is an imagemap",
          "baseSize": {
            "width": 1040,
            "height": 1040
          },
          "actions": [
            {
              "type": "uri",
              "area": {
                "x": 198,
                "y": 130,
                "width": 639,
                "height": 134
              },
              "linkUri": "https://www.pttfitauto.com/th/services/15451128871675"
            },
            {
              "type": "uri",
              "area": {
                "x": 201,
                "y": 283,
                "width": 645,
                "height": 121
              },
              "linkUri": "https://www.pttfitauto.com/th/services/15451183641678"
            },
            {
              "type": "uri",
              "area": {
                "x": 199,
                "y": 413,
                "width": 645,
                "height": 137
              },
              "linkUri": "https://www.pttfitauto.com/th/services/15451281021707"
            },
            {
              "type": "uri",
              "area": {
                "x": 194,
                "y": 561,
                "width": 650,
                "height": 132
              },
              "linkUri": "https://www.pttfitauto.com/th/services/15451282381708"
            },
            {
              "type": "uri",
              "area": {
                "x": 182,
                "y": 703,
                "width": 667,
                "height": 132
              },
              "linkUri": "https://www.pttfitauto.com/th/services/15451280201705"
            },
            {
              "type": "uri",
              "area": {
                "x": 189,
                "y": 844,
                "width": 666,
                "height": 130
              },
              "linkUri": "https://www.pttfitauto.com/th/services/15451182761676"
            }
          ]
        }
      ]

    })
  }).then((data) => {
    console.log(data)
  });
};
exports.replyPttFitPromotion = (bodyResponse, data) => {
  getListPromotionLine("Promotion FIT AUTO PTT Lubricants")
    .then((data) => {
      console.log(data)
      let ListContent = [];
      if (data) {
        data.forEach((v) => {
          let start = moment(v.start_date);
          let stop = moment(v.end_date);
          let dateCheck = moment()
          if (dateCheck.valueOf() >= start.valueOf() && dateCheck.valueOf() <= stop.valueOf()) {
            ListContent.push(
              createLinkLineComponent(v)
            )
          }
        })
        if(ListContent.length !== 0) {
          return request({
            method: `POST`,
            uri: `${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
              replyToken: bodyResponse.events[0].replyToken,
              messages: [
                {
                  "type": "template",
                  "altText": "PttFitProduct",
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
exports.replyPttFitProduct = (bodyResponse, data) => {

  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          "type": "imagemap",
          "baseUrl": "https://firebasestorage.googleapis.com/v0/b/my-project-e122f.appspot.com/o/lubricants.png?alt=media&token=e349e2e1-0fc4-47dd-8204-d2e028ac69d4&w=auto",
          "altText": "PttFitProduct",
          "baseSize": {
            "width": 1040,
            "height": 1040
          },
          "actions": [
            {
              "type": "uri",
              "area": {
                "x": 187,
                "y": 249,
                "width": 662,
                "height": 182
              },
              "linkUri": "https://pttlubricants.pttor.com/product.cshtml?sub_cat_id=1&language=th"
            },
            {
              "type": "uri",
              "area": {
                "x": 183,
                "y": 451,
                "width": 663,
                "height": 174
              },
              "linkUri": "https://pttlubricants.pttor.com/product.cshtml?sub_cat_id=2&language=th"
            },
            {
              "type": "uri",
              "area": {
                "x": 182,
                "y": 646,
                "width": 669,
                "height": 179
              },
              "linkUri": "https://pttlubricants.pttor.com/product.cshtml?sub_cat_id=4&language=th"
            },
            {
              "type": "uri",
              "area": {
                "x": 191,
                "y": 842,
                "width": 662,
                "height": 189
              },
              "linkUri": "https://ptt.lubricantadvisor.com/"
            }
          ]
        }
      ]
    })
  }).then((data) => {
    console.log(data)
  });

};