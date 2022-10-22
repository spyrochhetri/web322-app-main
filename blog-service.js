var fs = require("fs");
var path = require("path");
let posts = {};
let categories = [];


module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    try {
  
      fs.readFile("./data/posts.json", function (err, data) {
        if (err) throw err;
        posts = JSON.parse(data);
      });
      fs.readFile("./data/categories.json", function (err, data) {
        if (err) throw err;
        categories = JSON.parse(data);
      });
    } catch (ex) {
      reject("unable to read file");
    }
    resolve("JSON file successfully read.");
  });
};

module.exports.getAllPosts = function () {
  var all_posts = [];
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < posts.length; i++) {
      all_posts.push(posts[i]);
    }
    if (all_posts.length == 0) {
      reject("no results returned");
    }
    resolve(all_posts);
  });
};

module.exports.getPublishedPosts = function () {
  var published_posts = [];

  return new Promise(function (resolve, reject) {
    for (var a = 0; a < posts.length; a++) {
      if (posts[a].published == true) {
        published_posts.push(posts[a]);
      }
    }
    if (published_posts.length == 0) {
      reject("no results returned");
    }
    resolve(published_posts);
  });
};

module.exports.getCategories = function () {
  var c_categories = [];
  return new Promise(function (resolve, reject) {
    if (posts.length == 0) {
      reject("no data returned");
    } else {
      for (var v = 0; v < categories.length; v++) {
        c_categories.push(categories[v]);
      }
      if (c_categories.length == 0) {
        reject("no data returned");
      }
    }
    resolve(c_categories);
  });
};

// Add post
function addPost(postData){
  return new Promise((resolve, reject) => {
      if(postData.published === undefined) {
          postData.published = false;
      } else postData.published = true;

      postData.id = posts.length + 1;

      posts.push(postData);

      resolve(postData);
  })
}



function getPostsByCategory (category){
  return new Promise((resolve, reject) => {
      const categoryPosts = posts.filter((post) => {
          return post.category == category;
      })

      categoryPosts.length > 0 ? resolve(categoryPosts) : reject("no results returned");
  })
}

function getPostsByMinDate (minDateStr){
  return new Promise((resolve, reject) => {
      const minDatePosts = posts.filter((post) => {
          return new Date(post.postDate) >= new Date(minDateStr);
      })

      minDatePosts.length > 0 ? resolve(minDatePosts) : reject("no results returned");
  })
}

function getPostById (id){
  return new Promise((resolve, reject) => {
      const idPosts = posts.filter((post) => {
          return post.id == id;
      })

      idPosts.length > 0 ? resolve(idPosts) : reject("no results returned");
  })
}