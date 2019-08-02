//jshint esversion:6
require('dotenv').config();

const express = require("express");
const ejs = require("ejs");
// const request = require("request");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

const port = process.env.PORT||3000;
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const secret = process.env.SECRET;


userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.route("/")
   .get((req, res)=>{
		res.render("home");
   })
   .post((req, res)=>{
   		
   });

app.route("/login")
   .get((req, res)=>{
		res.render("login");
	})
   .post((req, res)=>{
   		const username = req.body.username;
   		const password = req.body.password;
   		User.findOne(
   			{email:username}, 
   			(err, results)=>{
   				if(err){
   					console.log(err);
   				}else{
   					if(results.password === password){
   						res.render("secrets");   					
   					}
   					
   				}
   			}
   		);
   });

app.route("/register")   
   .get((req, res)=>{
		res.render("register");
	})
	.post((req, res)=>{
		const newUser = new User({
   			email: req.body.username,
   			password: req.body.password
   		});  		   	
   		newUser.save((err)=>{
   			if(!err){
   				res.render("secrets");
   			}else{
   				console.log(err);
   			}
   		});	
   });   


app.listen(port,()=>{
	console.log("Server gets started...")
})
