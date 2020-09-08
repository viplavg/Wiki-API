//jshint esversion:6
// Requiring all npm packages we installed in our hyper terminal
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// use express
const app = express();

// Set ejs
app.set('view engine', 'ejs');

// set bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// use public as static where we keep our css images and other stuffs
app.use(express.static("public"));

//setup connection to mongodb
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true , useUnifiedTopology: true});

// define Schema for our WikiDB
const articleSchema = {
  title: String,
  content: String
};

// create model for the Schema
const Article = mongoose.model("Article", articleSchema);

//////////////////////request targeting all articles/////////////////////////
app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if (!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }


  });
})
.post(function(req, res){

  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.")
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if (!err){
      res.send("Successfully deleted all articles.")
    } else {
      res.send(err);
    }
  });
});

//////////////////////request targeting specific articles/////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title found.");
    }
  });
})
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle}, //condition
    {title: req.body.title, content: req.body.content}, //what we want to update
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the document");
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully updated the article.")
      } else {
        res.send(err);
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the article.");
      } else {
        res.send(err);
      }
    }
  );
});


///////////////////////////////////////////////start port connection//////////////////////////////////////////////////////////

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
