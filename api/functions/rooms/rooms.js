const Models = require('../../models');
exports.findAllRoomById = ({userId=0}) => {
    return new Promise(((resolve, reject) => {
        Models.rooms.findAll({
            where: {
                user_id:userId
            }
        }).then((data) => {
            console.log('data', data)
            if(data) {
                resolve(data)
            } else {
                const error = new Error('Not Found')
                reject(error);
                
            }
        }).catch((error => {reject(error)}));
    }));
}