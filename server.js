var exp = require('express');
var ws = require('ws');
var app = exp();

app.get('/',function(req,res){
    res.sendfile(__dirname + '/chat.html');
});

app.listen(82,function(){
    console.log('express Start!');
});

var websocket = new ws.Server({port:808})
websocket.on('connection', function(socket){
    console.log('ws connected!');
});
// websocket.on('listening', function(){

// })