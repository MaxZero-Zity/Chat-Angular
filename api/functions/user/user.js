const Models = require('../../models');

exports.findUserByEmail = ({email=''}) => {
    return new Promise(((resolve, reject) => {
        Models.users.findOne({
            where: {
                email:email,
                status:1
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
                email:email,
                status:1
            }
        }).then((data) => {
            // console.log('data', data)
            if(data) {
                
                resolve(data)
            } else {
                const error = new Error('ไม่พบข้อมูล')
                reject(error);
            }
        }).catch((error => {reject(error)}));
    }));
}

