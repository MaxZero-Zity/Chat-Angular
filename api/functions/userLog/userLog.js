const Models = require('../../models');

exports.createUserLog =  ({title='',userId=0,brandId=0,categoriesId=0,promotionId=0}) => {
    return new Promise((resolve, reject) => {
        Models.userlogs.create({
            title: title,
            user_id: userId,
            brand_id:brandId,
            categorie_id:categoriesId,
            promotion_id:promotionId
        }).then((data) => resolve(data))
        .catch((error) => reject(error))
    })
}
