const Models = require('../../models');
exports.findAllRoomById = ({id=0}) => {
    return new Promise((resolve, reject) => {
        
        Models.sequelize.query(`
        SELECT 
        rooms.id as room_id,
        users.id as user_id,
        users.email as email,
        users.name as name,
        relationship_rooms.friend_id as friendId,
        (SELECT MAX(name) FROM users WHERE users.id = relationship_rooms.friend_id) as friendName
        FROM users 
        LEFT JOIN relationship_rooms
        ON relationship_rooms.user_id = users.id
        LEFT JOIN rooms
        ON rooms.id = relationship_rooms.room_id 
        WHERE users.id = :id  and rooms.status = 1
        `,
            {
                replacements: { id: id ? id : 0 },
                type: Models.sequelize.QueryTypes.SELECT
            }
        ).then((doc) => {
            resolve(doc)
        }).catch((error) => reject(error))
    })
}

exports.findRelationShipRoomById = ({friendId=0,userId=0}) => {
        return new Promise(((resolve, reject) => {
            Models.relationship_rooms.findOne({
                where: {
                    friend_id:friendId,
                    user_id:userId
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


exports.addRoom = ({friendId=0,userId=0}) => {
    return new Promise(((resolve, reject) => {
        Models.rooms.create({
            name:'TestRoom',
            status:true,
        }).then((data) => {
            if(data) {
                console.log('create ==', data)
                var roomId  = data.dataValues.id
                Models.relationship_rooms.create({
                    user_id:userId,
                    friend_id:friendId,
                    room_id:roomId
                }).then((data) => {
                    if(data) {
                        //add ของ เพื่อนต่อ
                        Models.relationship_rooms.create({
                            user_id:friendId,
                            friend_id:userId,
                            room_id:roomId
                        }).then((data) => {
                            if(data) {
                                // console.log('message ==', data)
                                resolve({message:'บันทึกสำเร็จ'})
                            } else {
                                const error = new Error('บันทึกไม่ได้')
                                reject(error);
                            }
                        }).catch((error => {reject(error)}));
                    } else {
                        const error = new Error('บันทึกไม่ได้')
                        reject(error);
                    }
                }).catch((error => {reject(error)}));

            } else {
                const error = new Error('บันทึกไม่ได้')
                reject(error);
            }
        }).catch((error => {reject(error)}));
    }));
}


