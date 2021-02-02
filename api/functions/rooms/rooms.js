const Models = require('../../models');
exports.findAllRoomById = ({email=''}) => {
    return new Promise((resolve, reject) => {
        
        Models.sequelize.query(`
        SELECT 
        rooms.id as id,
        (SELECT MAX(name) FROM users WHERE users.id = rooms.friend_id) as friend_name,
        rooms.friend_id as friend_id,
        users.id as user_id,
        users.name as name,
        users.email as email
        FROM rooms 
        LEFT JOIN users
        ON rooms.user_id = users.id
        WHERE users.email = :email and rooms.status = '1'
        `,
            {
                replacements: { email: email ? email : '' },
                type: Models.sequelize.QueryTypes.SELECT
            }
        ).then((doc) => {
            resolve(doc)
        }).catch((error) => reject(error))
    })
}


