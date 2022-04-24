const mysql = require('mysql2');
var session = require('express-session');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
var cookieParser=require("cookie-parser");
var bodyParser = require('body-parser');
app.use(cookieParser());

app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))

var http = require('http');
var fs = require('fs');


var encoder = bodyParser.urlencoded()

// app.setViewEngine({
//     engine: {
//       handlebars: require('handlebars'),
//     },
//     templates: join(__dirname, '..', 'views'),
//   });
app.set('view engine', 'ejs');

const connection = mysql.createConnection
({
    host: "localhost",
    user: "root",
    password: "Jona@147", 
    database: "loginsample"
});




app.use(express.static('assets'));

connection.connect( function(error)
{
    if(error)throw error
    console.log("connected to the database")
});

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + "/in.html");
});

app.post('/',encoder, function(req, res)
{
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from login where username=? and userpass=?",[username,password] ,function(error, results, fields)
    {
        if(results.length>0)
        {
            res.redirect('/home');
            console.log('got it');
        }
        else
        {
            
            
            res.redirect('/wrong'); 
            
        }
        res.end();
    })
})

app.get ('/home', (req, res) =>
{
    res.sendFile(__dirname + '/home.html')
});


// ******************************************// REGISTRATION FORM//*********************************************************************************** */

app.get('/wrong', (req, res) =>
{
    res.sendFile(__dirname + '/wrongLogin.html')
});

// app.get ('/register', (req, res) =>
// {
//     res.sendFile(__dirname + '/register.html')
// });

// app.post("/register",encoder,(req,res)=>{
//     var username = req.body.username;
//     var password = req.body.password;



// var sql="INSERT INTO login(username,userpass) VALUES ('"+username+"','"+password+"')";
// connection.query(sql,(error,results)=>{
//     if(error) throw error
//     res.redirect("/",);
    
        


// });


// });









app.get('/register', function(req, res, next) {
    res.sendFile(__dirname + '/register.html')
  });

app.get('/userexist', function(req, res, next) {
    res.sendFile(__dirname + '/exist.html')
  });

app.get('/pass', function(req, res, next) {
    res.sendFile(__dirname + '/pass.html')
  });
  // to store user input detail on post request
  app.post('/register',encoder, function(req, res) {
      
          username=req.body.username,
          password=req.body.password,
          confirm_password=req.body.password2
    
  // check unique email address
  var sql='SELECT * FROM login WHERE username =?';
  connection.query(sql, [username] ,function (err, data, fields) {
   if(err) throw err
   if(data.length>1){
      return res.redirect('/userexist');
   }else if(confirm_password !=password){
     return res.redirect('/pass');
   }else{
       
      // save users data into database
      var sql="INSERT INTO login (username,userpass) VALUES ('"+username+"','"+password+"')";
     connection.query(sql,function (err, data) {
        if (err) throw err;
             });
    var msg ="Your are successfully registered";
   }
   //res.sendFile(__dirname + '/register.html');   // res.redirect('/register',{alertMsg:msg});
  })
       
  });

//*******************************************************LOGOUT*************************************************************/
app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
  });




app.listen(3000, ()=>
{
    console.log('server started')
})