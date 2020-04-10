var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../authenticate');
var multer = require('multer');
var cors = require('./cors');

const  storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.png|jpg|gif|jpeg/)){
        return cb(new Error('You can upload only image file'), false);
    }
    else{
        return cb(null , true);
    }
}

const upload = multer({storage : storage , fileFilter : imageFileFilter});
const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions , (req, res) => {
    res.statusCode = 200;
})
.get(cors.cors, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.setHeader('Content-Type' , 'text/plain');
    res.end('GET operation  not supported on /imageUpload');
})
.post(cors.corsWithOptions,authenticate.verifyUser , authenticate.verifyAdmin,upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.setHeader('Content-Type' , 'text/plain');
    res.end('PUT operation  not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.setHeader('Content-Type' , 'text/plain');
    res.end('DELETE operation  not supported on /imageUpload');
});

module.exports = uploadRouter;