const Models = require('../../models');
const { Op } = require("sequelize");
const moment = require('moment');

exports.countPromotion = () => {
    return new Promise((resolve, reject) => {
        Models.promotions.count({
            where :{
                deleteStatus:{
                    [Op.is]: false
                }
            }
        })
            .then((result) => resolve(result))
            .catch((error) => reject(error))
    });
}
exports.getById = async ({id}) => {
    try {
        return await Models.promotions.findByPk(id)
            .then((data)=> data)
            .catch((err)=> err)
    } catch (e) {
        return e
    }

}
exports.getPromotionDataTable=(options = {})=>{
    return new Promise(((resolve, reject) => {
        Models.promotions.findAll({
            ...options,
            order: [
                ['createdAt', 'DESC']
            ],
            include:[
                {
                    model: Models.brands , as: 'brands',
                    attributes: ['id', 'title']

                },
                {
                    model: Models.categories , as: 'categories',
                    attributes: ['id', 'title']

                }
            ]
        }).then((data) => {
            if(data) {
                resolve(data);
            } else {
                resolve([]);
            }
        }).catch((error => {reject(error)}));
    }));
}
exports.getListPromotionLine = (catTitle) => {
    return new Promise(((resolve, reject) => {
        Models.promotions.findAll({
            where:{
                deleteStatus:{
                    [Op.is]:false
                },
                [Op.and]:[{
                    status:{
                        [Op.is]:true
                    }
                }]
            },
            include:[
                {
                    model: Models.brands , as: 'brands',
                    attributes: ['id', 'title']

                },
                {
                    model: Models.categories , as: 'categories',
                    attributes: ['id', 'title'],
                    where: {
                        title: {
                            [Op.eq]: catTitle,
                        }
                    },
                }
            ],
            order: [
                ['index', 'ASC']
            ],
        }).then((data) => {
            if(data) {
                resolve(data);
            } else {
                resolve([]);
            }
        }).catch((error => {reject(error)}));
    }));
}

exports.getListPromotionLineById = ({brandId=0,categoryId=0}) => {
    return new Promise(((resolve, reject) => {
        Models.promotions.findAll({
            where:{
                brand_id:brandId,
                categorie_id:categoryId,
                deleteStatus:{
                    [Op.is]:false
                },
                [Op.and]:[{
                    status:{
                        [Op.is]:true
                    },
                }],
            },
            include:[
                {
                    model: Models.brands , as: 'brands',
                    attributes: ['id', 'title']

                },
                {
                    model: Models.categories , as: 'categories',
                    attributes: ['id', 'title']

                }
            ],
            order: [
                ['index', 'ASC']
            ],
            limit : 10,
        }).then((data) => {
            if(data) {
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
                // return ListPromotion
                resolve(ListPromotion);
            } else {
                resolve([]);
            }
        }).catch((error => {reject(error)}));
    }));
}
exports.setDefaultActionsLinkOut = (value) => {
    let listAction = [];
    if (!value.link_out1 && !value.link_out2) {
        listAction.push({
            "type": "uri",
            "label": "ดูรายละเอียด คลิก",
            "uri": `${process.env.FRONT_URL}${value.id}`
        })
    } else {

        if (value.link_out1) {
            listAction.push({
                "type": "uri",
                "label": value.link_out_description1,
                "uri": value.link_out1
            })
        }

        if (value.link_out2) {
            listAction.push({
                "type": "uri",
                "label": value.link_out_description2,
                "uri": value.link_out2
            })
        }
    }
    return listAction;
}
