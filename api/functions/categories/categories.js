const Models = require('../../models');


exports.getCategoriesDataTable=(options = {})=>{
    return new Promise(((resolve, reject) => {
        Models.categories.findAll({
            attributes: ['id','title', 'status'],
            ...options,
            where: {
                deleteStatus:0,
            },
            order: [
                ['createdAt', 'DESC']
            ],
        }).then((data) => {
            if(data) {
                resolve(data);
            } else {
                reject(null);
            }
        }).catch((error => {reject(error)}));
    }));
}
exports.countCategories = (field_id) => {
    return new Promise((resolve, reject) => {
        Models.categories.count({
            where: {
                deleteStatus: 0
            },
        })
            .then((result) => resolve(result))
            .catch((error) => reject(error))
    });
}
exports.findCategoriesByTitle = ({title=''}) => {
    return new Promise(((resolve, reject) => {
        Models.categories.findOne({
            where: {
                title:title,
                deleteStatus:0,
            }
        }).then((data) => {
            // console.log('data', data)
            if(data) {
                const error = new Error('category is exits already')
                reject(error);
            } else {
                resolve({message:'ok'})
            }
        }).catch((error => {reject(error)}));
    }));
}

exports.findCategoriesById =  ({id=0}) => {
    return new Promise(((resolve, reject) => {
        Models.categories.findOne({
            where: {
                id:id,
                deleteStatus:0,
            }
        }).then((data) => {
            // console.log('data', data)
            if(data) {
                resolve({message:'ok'})

            } else {
                const error = new Error('No have category')
                reject(error);
            }
        }).catch((error => {reject(error)}));
    }));
}


exports.createCategories =  ({title='',status=0}) => {
    return new Promise((resolve, reject) => {
        Models.categories.create({
            title: title,
            status: status,
            deleteStatus:0,
        }).then((data) => resolve(data))
        .catch((error) => reject(error))
    })
}


exports.editCategories =  ({id=0,title='',status=0}) => {
    return new Promise((resolve, reject) => {
    Models.categories.update({
            title: title,
            status: status,
    },{
        where:{
            id:id,
            deleteStatus:0,
        }
    }).then((data) =>  resolve({message:'ok'}))
        .catch((error) => reject(error))
    })
}


exports.deleteCategories =  ({id=0}) => {
    return new Promise((resolve, reject) => {
    Models.categories.update({
            deleteStatus: 1,
            status: 0,
    },{
        where:{
            id:id,
        }
    }).then((data) =>  resolve({message:'ok'}))
        .catch((error) => reject(error))
    })
}

exports.getListCategories=()=>{
    return new Promise(((resolve, reject) => {
        Models.categories.findAll({
            attributes: ['id','title', 'status'],
            where: {
                deleteStatus:0,
                status:1
            },
            order: [
                ['createdAt', 'DESC']
            ],
        }).then((data) => {
            if(data) {
                resolve(data);
            } else {
                reject(null);
            }
        }).catch((error => {reject(error)}));
    }));
}