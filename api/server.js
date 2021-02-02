var app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const FRONT_URL = process.env.FRONT_URL;
var http = require('http').createServer(app);
const router = require('../api/routes/index');
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
    // res.io = io;
    res.send('hello!')
});
app.use('/api', router);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});


app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  if (error.status == 422) {
    res.json({
      status: false,
      message: error.message,
      validate: error.validate,
    });
  } else {
    console.error("error ", error);
    res.json({
      status: false,
      message: error.message,
      // error: (app.get('env') === 'development') ? error : {}
      error: error,
    });
  }
});


//Socket.Io
io.use(function(socket, next) {
  // var handshakeData = socket.request;
  // console.log("middleware:", handshakeData._query['foo']);
  next();
});
io.on('connection',(socket) =>{
    var roomId = socket.request;
    var stringRoomId = 'room'+String(roomId._query['roomId']);
    // console.log('a user connected == '+stringRoomId);
    socket.join(stringRoomId);
    socket.on(stringRoomId,(msg)=>{
        socket.broadcast.to(stringRoomId).emit('message-broadcast',msg);
    });
});


http.listen(process.env.APP_PORT || 3000, () => {
  console.log('listening on *:3000');
});