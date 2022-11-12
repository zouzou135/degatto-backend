var express = require('express');
var app = express();
var session = require("express-session");
var mysql = require('mysql');
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

app.use(session({
    secret: "2C44-4D44-WppQ385",
    resave: true,
    saveUninitialized: true
}));

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send('login failed');
    } else {
        var sql = "SELECT * FROM UserName where username = ? AND password = ?";
        con.query(sql, [req.body.username, req.body.password], function (err, result) {
            console.log(result.length);
            if (result.length > 0) {
                this.user = req.body.username;
                req.session.user = req.body.username;
                req.session.admin = true;
                console.log(req.session + " " + req.session.user + " " + req.session.admin);
                let obj = {
                    msg: "Successful",
                    result: result,
                }
                res.send(obj);
            } else {
                let obj = {
                    msg: "Failed!",
                }
                res.send(obj);
            }
        })
    }
});

var auth = function (req, res, next) {
    console.log(req.session + " " + req.session.user + " " + req.session.admin);
    if (req.session && req.session.user && req.session.admin) {
        return next();
    } else {
        res.sendStatus(401);
    }
};


app.post('/users', function (req, res) {
    var sql = `SELECT * FROM USER WHERE idUserName = ${req.body.userId};`;
    console.log(req.body.userId);
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});

app.get('/', function (req, res) {
    res.render('login');
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "csis_279_db"
});

con.connect(err => {
    if (err) throw err;
});


app.get('/', function (req, res) {
    var sql = "SELECT * FROM CLIENT";
    con.query(sql, function (err, result) {
        console.log(result);
        res.send("I am the index route!");
    });
    //res.send("I am the index route!");
});


// app.get('/users', function (req, res) {
//     var sql = "SELECT * FROM USER";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// function deleteUserRecord(userID) {
//     let sql = `DELETE FROM User WHERE idUser = ${userID};`;

//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("User record deleted");
//     });
// }

app.post("/deleteUser", function (req, res) {
    let userID = req.body.idUser;
    console.log(userID);
    let sql = `DELETE FROM User WHERE idUser = ${userID};`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("User record deleted");
        res.send(result);
    });

});

// function updateUser(userID, userFN, userLN) {
//     let sql = `UPDATE USER SET USER_FIRST_NAME = "${userFN}", USER_LAST_NAME = "${userLN}" WHERE idUser = ${userID};`;
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log('Record updated');
//     });
// }

app.post("/updateUser", function (req, res) {
    let userID = req.body.idUser;
    let userFN = req.body.USER_FIRST_NAME;
    let userLN = req.body.USER_LAST_NAME;
    let sql = `UPDATE USER SET USER_FIRST_NAME = "${userFN}", USER_LAST_NAME = "${userLN}" WHERE idUser = ${userID};`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('Record updated');
        res.send(result);
    });
    // console.log(userID + " " + userFN + " " + userLN);
    // updateUser(userID, userFN, userLN);
});

// function insertUser(userFN, userLN) {
//     let sql = `INSERT INTO USER (USER_FIRST_NAME, USER_LAST_NAME) VALUES ("${userFN}", "${userLN}")`;
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log('One record inserted');
//     });
// }

app.post("/addUser", function (req, res) {
    let userFN = req.body.USER_FIRST_NAME;
    let userLN = req.body.USER_LAST_NAME;
    let sql = `INSERT INTO USER (USER_FIRST_NAME, USER_LAST_NAME) VALUES ("${userFN}", "${userLN}")`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('One record inserted');
        res.send(result);
    });
    // console.log(userFN + " " + userLN);
    // insertUser(userFN, userLN);
});

// what port to run server on
app.listen(3001, function () {
    console.log('server started on port 3001');
});
