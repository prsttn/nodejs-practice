const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routers/dishRouter');
const promotionRouter = require('./routers/promotionRouter');
const leaderRouter = require('./routers/leaderRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/dishes' , dishRouter);
app.use('/promotions' , promotionRouter);
app.use('/leaders' , leaderRouter);

app.use(express.static(__dirname + '/public'));

app.use((req,res, next) =>{
    console.log(req.headers);
    res.statusCode = 200;
    res.end('<html><body><h1>This is express server</h1></body></html>');
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`server is runnig at http://${hostname}:${port}`);
});