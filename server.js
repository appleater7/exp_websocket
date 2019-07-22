var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mariadb = require('mariadb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mariadb.createPool({
    host: 'localhost',
    database: 'osf',
    user: 'root',
    password: '12345678',
    connectionLimit: 5
});

app.get('/views/**',function(req,res){
    res.sendFile(__dirname + req.url)
})
app.get('/users', function (req, res) {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT ui_num, ui_name, ui_dept, (case when ui_active=1 then '정상' else '퇴사' end) ui_active from user_info")
                .then((rows) => {
                    res.json(rows);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                });
        }).catch(err => {
            console.log(err);
        });
});
app.post('/users/save', async function (req, res) {
    let conn = await pool.getConnection();
    try{
        conn.beginTransaction();
        var rows = 0;
        for(let data of req.body){
            let result;
            if(data.status==='I'){
                let param = [data.ui_name, data.ui_dept];
                result = await conn.query("insert into user_info(ui_name,ui_dept) values(?,?)", param);
            }else if(data.status==='U'){
                let param = [data.ui_name, data.ui_dept, data.ui_num];
                result = await conn.query("update user_info set ui_name=?,ui_dept=? where ui_num=?", param);
            }else if(data.status==='D'){
                let param = [data.ui_num];
                result = await conn.query("update user_info set ui_active=0 where ui_num=?", param);
            }
            rows += result.affectedRows;
        }
        await conn.commit(()=>{
            console.log('commit ok!');
        })
        await conn.end();
        console.log(rows);
        res.json({success:rows});
    }catch(err){
        conn.rollback(()=>{
            console.log('commit ok!');
            res.json(err);
        })
        console.log(err);
        res.json(err);
    }
});
app.post('/test', function (req, res) {
    console.log(req.body);
    let param = [req.body.num, req.body.name];
    pool.getConnection()
        .then(conn => {
            conn.query("insert into test_info values(?,?)", param)
                .then((result) => {
                    res.json(result);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                });
        }).catch(err => {
            console.log(err);
        });
})

app.post('/logic', async function (req, res) {
    console.log(req.body);
    let param = [req.body.num, req.body.name];
    let conn = await pool.getConnection();
    try{
        conn.beginTransaction();
        let rows = await conn.query("insert into test_info values(?,?)", param);
        console.log(rows);
        console.log('일단 1번은 성공!!');
        rows += await conn.query("insert into test_info values(?,?)", param);
        conn.commit(()=>{
            console.log('commit ok!');
        })
        conn.end();
        res.json(rows);
    }catch(err){
        conn.rollback(()=>{
            console.log('commit ok!');
        })
        conn.end();
        console.log(err);
        res.json(err);
    }
})

app.put('/test/:num', function (req, res) {
    let param = [req.body.name, req.params.num];
    pool.getConnection()
        .then(conn => {
            conn.query("update test_info set name=? where num=?", param)
                .then((result) => {
                    res.json(result);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                });
        }).catch(err => {
            console.log(err);
        });
})

app.delete('/test/:num', function (req, res) {
    let param = [req.params.num];
    pool.getConnection()
        .then(conn => {
            conn.query("delete from test_info where num=?", param)
                .then((result) => {
                    res.json(result);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                });
        }).catch(err => {
            console.log(err);
        });
})
app.listen(80, function () {
    console.log('Example app listening on port 80!')
});
