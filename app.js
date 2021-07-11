//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = mongoose.Schema({
   title:String,
   content: String
});

const Article = mongoose.model("Article", articleSchema); 

//------------------------------------------Request Targeting All Articles---------------------------------------//
app.route("/articles")
.get((req, res)=>{
    Article.find({},(err, foundArticles)=>{
        if(err){
             res.send(err);
        }else{
            res.send(foundArticles);
        }
    });
})
.post((req, res)=>{
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save((err)=>{
        if(!err){
            res.send("Successfully added new article !");
        }else{
            res.send(err);
        }
    });
})
.delete((req, res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Deleted successfully all the articles.");
        }else{
            res.send(err);
        }
    });
});


//----------------------------------------Request Targeting Specific Article---------------------------------------//
app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle}, (err, foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article found with the given title !");
        }
    });
})
.put((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        (err)=>{
            if(!err){
                res.send("Updated successfully !");
            }else{
                res.send(err);
            }
        });
})
.patch((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {$set:req.body},
        (err)=>{
          if(!err){
              res.send("Successfully Updated a part !")
          }else{
              res.send(err);
          }
        });
})
.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err)=>{
            if(!err){
                res.send("Successfully deleted the particular article!");
            }else{
                res.send(err);
            }
        });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});