var exp = require('express');
var ws = require('ws');
var app = exp();
var mybatis = require('mybatis-mapper');

const mariadb = require('mariadb');
const pool = mariadb.createPool(
    { host: 'localhost',
    port: '3306',
    database: 'osf',
    user: 'root', 
    password: '12345678', 
    connectionLimit: 5 });
// mybatis.createMapper()

app.get('/views/**', function(req,res){
    res.sendFile(__dirname+req.url);
})

app.get('/users', function (req, res) {    
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * from user_info")
                .then((rows) => {
                    console.log(rows); //[ {val: 1}, meta: ... ]
                    res.json(rows);
                })
                .then((res) => {
                    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                    conn.end();
                })
                .catch(err => {
                    //handle error
                    conn.end();
                })
        }).catch(err => {
            //not connected
        });
})
app.get('/logic', function (req, res) {    
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * from test_info")
                .then((rows) => {
                    console.log(rows); //[ {val: 1}, meta: ... ]
                    res.json(rows);
                })
                .then((res) => {
                    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                    conn.end();
                })
                .catch(err => {
                    //handle error
                    conn.end();
                })
        }).catch(err => {
            //not connected
        });
})

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/chat.html');
});

app.listen(82, function () {
    console.log('express Start!');
});

var websocket = new ws.Server({ port: 808 })
websocket.on('connection', function (socket) {
    console.log('ws connected!');
    // WebSocket 에 메시지 이벤트를 발생시킴
    setInterval(function () {
        socket.send(new Date().toString());
    }, 1000)
});
// websocket.on('listening', function(){

// })