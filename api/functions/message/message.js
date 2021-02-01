const Models = require('../../models');
exports.addMessage = ({text='',userId=0,roomId=0}) => {
    console.log("text==",text);
    console.log("userId==",userId);
    console.log("roomId==",roomId);
    return new Promise(((resolve, reject) => {
        Models.message.create({
            text:text,
            user_id:userId,
            room_id:roomId,
            read_status:false,
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