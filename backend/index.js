const express = require('express');
const app=express();
const http=require("http");
//import { createConnection } from 'mysql'; #typescript
const mysql=require("mysql");
const queries=require("./queries");
const url = require('url');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { application } = require('express');

function generateAccessToken (username) {
  return jwt.sign(username, "secret", { 
    //expiresIn: "15m"
  })
}

var con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root", 
  password: "root"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.listen(8080,()=>{
    console.log('live on port 8080');
});

// CORS configuration
// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(express.json())

app.get('/',function(req,res){
    res.send('Homepage here');
});

// Create admin user
bcrypt.hash("admin", 10).then((adminPass) =>
  con.query (queries.user_queries.getUserByUsername + "\"" + "admin" + "\"", async (err, result) => {
    if (err) throw (err)
    console.log("------> Search Results")
    console.log(result.length)
    if (result.length != 0) {
      console.log("------> Admin already exists")
    } 
  else {
    await con.query (mysql.format(queries.user_queries.createAdmin, ["admin", adminPass]), (err, result)=> {
    if (err) throw (err)
    console.log ("--------> Created new Admin")
    console.log(result.insertId)
    })
  }
}));

app.get('/getAll',(req,res)=>{
  con.query(queries.books_queries.getAllBooks, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.get('/getById/:id',(req,res)=>{
  // console.log(req);
  id = req.query.id; // get the id from the query
  con.query(queries.books_queries.getBookById + id, function (err, result) {
    if (err) throw err;
    console.log(result[0]);
    res.send(result[0]);
  });
});

app.get('/favourites/:username', (req, res)=>{
  username = req.query.username;
  con.query(mysql.format(queries.user_queries.getFavouritesByUsername, [username]), function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  })
});

app.post("/addFavourite", async (req, res) => {
  console.log(req.params);
  username = req.body.username;
  bookId = req.body.bookId;
  await con.query(mysql.format(queries.books_queries.checkFavourite, [username, bookId]), async (err, result) => {
    if (err) throw (err);
    if (result.length != 0) {
      console.log("Book is already in favourites!");
      res.sendStatus(500);
    } else {
      await con.query(mysql.format(queries.books_queries.addFavourite, [username, bookId]), async (err, result) => {
        if (err) throw (err);
        console.log("Book is added to favourites!");
        res.sendStatus(200);
      })
    }
  })
});

app.post("/removeFavourite", async (req, res) => {
  console.log(req.params);
  username = req.body.username;
  bookId = req.body.bookId;
  console.log(mysql.format(queries.user_queries.removeFavourite, [username, bookId]))
  await con.query(mysql.format(queries.user_queries.removeFavourite, [username, bookId]), async (err, result) => {
    if (err) throw (err);
    if(result.affectedRows === 0){
      console.log("Can't remove something that doesn't exist!");
      res.sendStatus(500);
    }else{
      console.log("Book is removed from favourites!");
      res.sendStatus(200);
    }
  })
});

app.post("/removeBook", async (req, res) => {
  bookId = req.body.bookId;
  await con.query(mysql.format(queries.books_queries.removeBookUsers, [bookId]), async (err, result) => {
    if (err) throw (err);
    await con.query(mysql.format(queries.books_queries.removeBook, [bookId]), async (err, result) => {
      if (err) throw (err);
      if(result.affectedRows === 0){
        console.log("Can't remove something that doesn't exist!");
        res.sendStatus(500);
      }else{
        console.log("Book is removed!");
        res.sendStatus(200);
      }
    })
  })
});

app.post("/updateBook", async (req, res) => {
  id = req.body.id;
  title = req.body.title;
  author = req.body.author;
  summary = req.body.summary;
  description = req.body.description;
  await con.query(mysql.format(queries.books_queries.updateBook, [title, author, summary, description, id]), async (err, result) => {
    if (err) throw (err);
    if(result.affectedRows === 0){
      console.log("Something went wrong!")
      res.sendStatus(500);
    }else{
      console.log("Edit successful!")
      res.sendStatus(200);
    }
  })
});

app.post("/register", async (req,res) => {
  console.log(req.body)
  const username = req.body.username;
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  // ? will be replaced by values
  // ?? will be replaced by string
  await con.query (queries.user_queries.getUserByUsername + "\"" + username + "\"", async (err, result) => {
    if (err) throw (err)
    console.log("------> Search Results");
    console.log(result.length);
    if (result.length != 0) {
      console.log("------> User already exists");
      res.sendStatus(409);
    } 
    else {
      await con.query (mysql.format(queries.user_queries.createUser, [username, hashedPassword]), (err, result)=> {
        if (err) throw (err)
        console.log ("--------> Created new User");
        console.log(result.insertId);
        res.sendStatus(200);
      })
    }
  }) //end of con.query()
}); //end of app.post()


//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  con.query (queries.user_queries.getUserByUsername + "\"" + username + "\"", async (err, result) => {
    if (err) throw (err)
    if (result.length == 0) {
      console.log("--------> User does not exist");
      res.sendStatus(404);
    }
    else {
        const hashedPassword = result[0].password;
        //get the hashedPassword from result
      if (await bcrypt.compare(password, hashedPassword)) {
        console.log("---------> Login Successful");
        console.log("---------> Generating accessToken");
        const token = generateAccessToken({username: username});
        console.log(token);
        res.json({accessToken: token});
      }
      else {
        console.log("---------> Password Incorrect");
        res.send("Password incorrect!");
      } //end of bcrypt.compare()
    }//end of User exists i.e. results.length==0
  }) //end of connection.query()
}) //end of app.post()


// app.post("/signout", (req, res) => {
// 
// })