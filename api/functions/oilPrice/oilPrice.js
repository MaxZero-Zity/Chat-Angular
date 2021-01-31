const Models = require('../../models');
const { Op } = require("sequelize");
const moment = require('moment');





exports.getOilPrice=(options = {})=>{
    return new Promise(((resolve, reject) => {
        Models.oilPrice.findAll({
            order: [
                ['createdAt', 'DESC']
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

exports.createOilPrice =  ({cover_img=''}) => {
    return new Promise((resolve, reject) => {
        Models.oilPrice.create({
            cover_img: cover_img,
        }).then((data) => resolve(data))
        .catch((error) => reject(error))
    })
}
exports.updateOilPrice =  ({id=0,cover_img=''}) => {
    return new Promise((resolve, reject) => {
    Models.oilPrice.update({
            cover_img: cover_img,
    },{
        where:{
            id:id,
        }
    }).then((data) =>  resolve({message:'ok'}))
        .catch((error) => reject(error))
    })
}
exports.getOilPrice=(options = {})=>{
    return new Promise(((resolve, reject) => {
        Models.oilPrice.findAll({
            order: [
                ['createdAt', 'DESC']
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