const express = require('express');
const cors = require('cors');

const app = express();

var whitelist = ['http://localhost:3000' , 'https://localhost:3443'];

var corsOptionsDelegate  =(req , callback) => {
    var corsOptions;
    console.log('origin' + req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        console.log("index : " + whitelist.indexOf(req.header('Origin')));
        corsOptions = { origin : true};
    }
    else{
        console.log('here else :' + whitelist.indexOf(req.header('Origin')));
        corsOptions = { origin : false };
    }
    callback(null , corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);