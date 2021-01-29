var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });
var cors = require('cors')

app.use(cors())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
  });
app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.send('hello!')
});


io.on('connection',(socket) =>{
    console.log('a user connected')
    socket.on('message',(msg)=>{
        console.log(msg);
        socket.broadcast.emit('message-broadcast',msg);
    });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});