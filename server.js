Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@Jahanvi220104 
Jahanvi220104
/
web322-app-main
Public
Code
Issues
Pull requests
1
Actions
Projects
Wiki
Security
Insights
Settings
web322-app-main/server.js /
@Jahanvi220104
Jahanvi220104 Add files via upload
Latest commit 253810f 12 minutes ago
 History
 1 contributor
123 lines (99 sloc)  3.85 KB

 /*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Jahanvi Jitendra Randhejiya Student ID:159298215 Date: 3rd october, 2022
*
*  Cyclic Web App URL: ---------------
*
*  GitHub Repository URL: https://github.com/Jahanvi220104/web322-app.git
*updated now
********************************************************************************/ 
const express = require('express');
const blogData = require("./blog-service");
const path = require("path");
const app = express();


const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

//libraries
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
   cloud_name: 'dga12xwb2',
   api_key: '694932861513843',
   api_secret: '8kE3Cp8pA7PAe4RzWO4ICj9jO1Y',
   secure: true
});
//upload variable
const upload = multer();

app.get('/', (req, res) => {
    res.redirect('/about');
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
})



app.get('/blog-service', (req, res) => {
    service.getPublishedPosts().then(data => res.json(data)).catch(err => res.json(err));
})

app.get('/post/:value', (req, res) => {
    service.getPostById(req.params.value).then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
})

app.get('/posts', (req, res) => {
    if (req.query.category) {
        service.getPostsByCategory(req.query.category).then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
    } else if (req.query.minDate) {
        service.getPostsByMinDate(req.query.minDate).then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
    } else {
        service.getAllPosts().then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
    }
})



app.get('/categories', (req, res) => {
    service.getCategories().then(data => res.json(data)).catch(err => res.json(err));
})

app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/addPost.html'));
})

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
