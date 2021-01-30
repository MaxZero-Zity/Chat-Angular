var app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const FRONT_URL = process.env.FRONT_URL;
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
      origin:  process.env.FRONT_URL,
      methods: ["GET", "POST"]
    }
  });
  
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin',  FRONT_URL);
    next();
  });
app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', FRONT_URL);
    res.send('hello!')
});

//Socket.Io
io.on('connection',(socket) =>{
    console.log('a user connected')
    socket.on('message',(msg)=>{
        console.log(msg);
        socket.broadcast.emit('message-broadcast',msg);
    });
});


http.listen(process.env.APP_PORT || 3000, () => {
  console.log('listening on *:3000');
});