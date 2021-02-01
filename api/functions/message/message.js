const Models = require('../../models');

exports.findAllMessageById = ({roomId=0}) => {
    return new Promise(((resolve, reject) => {
        Models.messages.findAll({
            where: {
                room_id:roomId,
                status:'1'
            },
            order: [
                ['createdAt', 'ASC']
            ],
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


exports.addMessage = ({text='',userId=0,roomId=0}) => {
    console.log("text==",text);
    console.log("userId==",userId);
    console.log("roomId==",roomId);
    return new Promise(((resolve, reject) => {
        Models.messages.create({
            text:text,
            user_id:userId,
            room_id:roomId,
            read_status:false,
            status:true,
        }).then((data) => {
            if(data) {
                resolve({message:'บันทึกสำเร็จ'})
            } else {
                const error = new Error('บันทึกไม่ได้')
                reject(error);
            }
        }).catch((error => {reject(error)}));

    }));

}