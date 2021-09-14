const path = require('path');
const fs = require('fs');
const multer = require('multer')

module.exports.serverConfig = {
    port : 3000,
    db_url : 'mongodb://localhost:27017',
    db_name : 'local',
}

module.exports.uploadConfig = {
    storage : multer.diskStorage({
        destination: function(req, file, callback){
            callback(null, path.join(__dirname, '../uploads'));
        },
        filename: function(req, file, callback){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            callback(null, `${file.fieldname}-${uniqueSuffix}`);
        },
    }),
    limits: {
        files : 10,
        fileSize : 1024 * 1024 * 1024
    }
}