var fs = require("fs");
var posts = {};
var categories = [];

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