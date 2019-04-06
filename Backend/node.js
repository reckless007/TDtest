const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var cors = require('cors');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2")

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

var con = mysql.createConnection({
    // properties
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TestDB'
});
con.connect(function (error) {
    if (!!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }

    app.post('/add', (req, res) => {
        //res.send('Hello World');

        var Pass = req.body.pass1;
        var Email = req.body.email1;

      

  

        let transporter = nodemailer.createTransport({
            service: 'gmail',
         
        
            auth: {
              user: 'reckless.brat2769@gmail.com', // generated ethereal user
              pass: 'qwerty!234' // generated ethereal password
            }
          });
          let mailOptions = {
            from: 'reckless.brat2769@gmail.com' , // sender address
            to: Email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello ,Thanks For Registering.Please Click The Link Below", // plain text body
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        

        bcrypt.hash(Pass, saltRounds, function(err, hash) {
            // Store hash in your password DB.
        
        var sql = 'INSERT INTO test (Password,Email) VALUES ("' + hash + '","' + Email + '")';
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });

    });





    app.post("/login",(req,res)=>{
        var mail=req.body.email1;
        var pass=req.body.pass1;
        
        var queryy='SELECT * from test where Email="'+mail+'"';
    
        con.query(queryy,(err,result)=>{
            if(err)
            console.log(err)
            // res.send('Insert success.');
            else{
                console.log(result);
             if(result.length==0)
             {
                 res.json({
                     status:404,
                     success:false
                 })
             }
             else if(result.length==1)
             {
                 if(result[0].Password==pass)
                 {
                res.json({
                    status:200,
                    success:true
                })

                
            }
            else{
                res.json({
                    status:400,
                    success:false
                })
            }
            }
            else{
                res.json({
                    status:400,
                    success:false
                })
            }
            }
    })
    
        }
        )



});

    const port1 = process.env.PORT || 3000;
var server = app.listen(port1, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})