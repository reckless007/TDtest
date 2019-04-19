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
          var rand,host,link;
          res.sendfile('index.html');
          rand=Math.floor((Math.random() * 100) + 54);
          host=req.get('host');
          link="http://"+req.get('host')+"/verify?id="+rand;
          let mailOptions = {
            from: 'reckless.brat2769@gmail.com' , // sender address
            to: Email, // list of receivers
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }


            app.get('/verify',function(req,res){
            
            if((req.protocol+"://"+req.get('host'))==("http://"+host))
            {
                console.log("Domain is matched. Information is from Authentic email");
                if(req.query.id==rand)
                {
                    console.log("email is verified");
                    bcrypt.hash(Pass, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
                    
                    var sql = 'INSERT INTO test (Password,Email) VALUES ("' + hash + '","' + Email + '")';
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                    });
                });
                    res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
                }
                else
                {
                    console.log("email is not verified");
                    res.end("<h1>Bad Request</h1>");
                }
            }
            else
            {
                res.end("<h1>Request is from unknown source");
            }


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
                   console.log(result[0].Password);
                bcrypt.compare(pass,result[0].Password,function(err, result){
                    console.log(result);
                    if (result==true)
                    {
                    res.json({
                        status:200,
                        success:true
                    })
                }
                   });
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
