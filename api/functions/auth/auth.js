const Model = require('../../models');

exports.findRefreshToken = ({refreshToken}) => {
    return new Promise(((resolve, reject) => {
        Model.backlists.findOne({
            where:{
                token:refreshToken
            }
        }).then((data) => {
            resolve(data)
        }).catch(() => {
            reject(null)
        })
    }))
}

exports.findToken = ({accessToken}) => {
    return new Promise(((resolve, reject) => {
        Model.backlists.findOne({
            where:{
                token:accessToken
            }
        }).then((data) => {
            resolve(data)
        }).catch(() => {
            reject(null)
        })
    }))
}
exports.deleteTokenBackList = ({token}) => {
    return new Promise(((resolve, reject) => {
        Model.backlists.destroy({
            where:{
                token:token
            }
        }).then(() => resolve('ok'))
            .catch((error)=>reject(error))
    }))
}