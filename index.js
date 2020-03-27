const express = require('express');
const http = require('http');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use((req,res, next) =>{
    console.log(req.headers);
    res.statusCode = 200;
    res.end('<html><body><h1>This is express server</h1></body></html>');
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`server is runnig at http://${hostname}:${port}`);
});