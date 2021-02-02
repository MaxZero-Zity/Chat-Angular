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


