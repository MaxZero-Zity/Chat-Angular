const Models = require('../../models');

exports.findUserByEmail = ({email=''}) => {
    return new Promise(((resolve, reject) => {
        Models.users.findOne({
            where: {
                email:email
            }
        }).then((data) => {
            // console.log('data', data)
            if(data) {
                const error = new Error('email is exits already')
                reject(error);
            } else {
                resolve({message:'ok'})
            }
        }).catch((error => {reject(error)}));
    }));
}
exports.getUserByEmail = ({email=''}) => {
    return new Promise(((resolve, reject) => {
        Models.users.findOne({
            where: {
                email:email
            }
        }).then((data) => {
            if(data) {
                resolve(data)
            } else {
                reject(null);
            }
        }).catch((error => {reject(error)}));
    }));
}