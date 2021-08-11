const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (_req, _file, cb)=>{
        if(!fs.existsSync(__dirname + '../../../client/src/assets/images/uploads')){
            fs.mkdirSync(__dirname + '../../../client/src/assets/images/uploads')
        }
        cb(null, __dirname + '../../../client/src/assets/images/uploads')
    },
    filename: (req, file, cb )=>{
        const fileName = Date.now() + path.extname(file.originalname);
        req.fileName = fileName;
        cb(null, fileName)
    }
});
const upload = multer({storage});

module.exports = upload;