 /*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Jahanvi Jitendra Randhejiya Student ID:159298215 Date: 3rd october, 2022
*
*  Cyclic Web App URL: https://delightful-bear-bathing-suit.cyclic.app/
*
*  GitHub Repository URL: https://github.com/Jahanvi220104/web322-app.git
*
********************************************************************************/ 
 var express = require("express");
 var app = express();
 var path = require("path");
 var data = require("./blog-service");
 var HTTP_PORT = process.env.PORT || 8080;
 
 function onHttpStart() {
   console.log("Express http server listening on: " + HTTP_PORT);
   return new Promise(function (res, req) {
     data
       .initialize()
       .then(function (data) {
         console.log(data);
       })
       .catch(function (err) {
         console.log(err);
       });
   });
 }
 app.use(express.static("public"));
// GET ABOUT
 app.get("/", function (req, res) {
   res.sendFile(path.join(__dirname + "/views/about.html"));
 });
 //GET /POST/ADD
 app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/addPost.html"));
});

 app.get("/blog", function (req, res) {
   data
     .getPublishedPosts()
     .then(function (data) {
       res.json(data);
     })
     .catch(function (err) {
       res.json({ message: err });
     });
 });
 
 app.get("/posts", function (req, res) {
   data
     .getAllPosts()
     .then(function (data) {
       res.json(data);
     })
     .catch(function (err) {
       res.json({ message: err });
     });
 });
 
 app.get("/categories", function (req, res) {
   data
     .getCategories()
     .then(function (data) {
       res.json(data);
     })
     .catch(function (err) {
       res.json({ message: err });
     });
 });
 
 app.use(function (req, res) {
   res.status(404).sendFile(path.join(__dirname, "Page Not Found"));
 });
 
 app.listen(HTTP_PORT, onHttpStart)
