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
 var blogService = require ('./blog-service.js')

 var HTTP_PORT = process.env.PORT || 8080;

 //libraries
const multer = require("multer");
const cloudinary= require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: 'dgbjmbkxr',
  api_key: '764431573664668',
  api_secret: 'iKg_pblVfzbodEHRFHfZQOwSl1w',
  secure: true
});

//upload variable
const upload = multer();

app.use(express.static('public'));

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
app.get("/", (req, res) => {
  res.redirect('/about');
});

 app.get("/about", function (req, res) {
   res.sendFile(path.join(__dirname, "/views/about.html"));
 });

//BLOGS
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
 
 //GET POSTS
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
 
 //GET CATEGORIES
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
 
 //GET /POST/ADD
 app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

 app.listen(HTTP_PORT, onHttpStart)

 // Adding POST routes
app.post('/posts/add', upload.single("featureImage"), (req, res) => {
  if(req.file){
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
  
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };
  
      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
      }
  
      upload(req).then((uploaded)=>{
          processPost(uploaded.url);
      });
  } else {
      processPost("");
  }

  function processPost(imageUrl){
      req.body.featureImage = imageUrl;

      const postData = {
          "body": req.body.body,
          "title": req.body.title,
          "postDate": new Date().toISOString().split('T')[0],
          "category": req.body.category,
          "featureImage": imageUrl,
          "published": req.body.published,
      }

      service.addPost(postData).then(data => res.redirect('/posts')).catch(err => res.json(`message: ${err}`));
  }
})

//ERROR
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "Page Not Found"));
});


 blogService.initialize().then(() =>{
  app.listen(HTTP_PORT, () => {
      console.log('Express HTTP server is listening to the port', HTTP_PORT)
  })
}).catch(() => {
  console.log('Error: Server not started')

})