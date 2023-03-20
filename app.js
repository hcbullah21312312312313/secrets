//jshint esversion:6
require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt=require('bcrypt');
const saltRounds=10;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/secrets');
const cors = require('cors');

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
const secretSchema=new mongoose.Schema({
    email:String,
    password:String
})
const secretModel=mongoose.model('secret',secretSchema)
app.route('/')
.get(function(req,res){
    res.render('home');
});
app.route('/login')
.get(function(req,res){
    res.render('login');
    
})
.post(async function(req,res){
    var users=[]
    const emaila=req.body.email;
        const loginAttempt=await secretModel.findOne({email:emaila})
                bcrypt.compare(req.body.password,loginAttempt.password, function(err, result) {
                     if(result == true){
                        res.render('secrets',{message:'ok'});
                    }else{
                        console.log('err')
                    }
                });
    // loginAttempt.forEach(function(user){
    // users.push(user)
    // })
    // for(let i=0; i<users.length; i++){
    //     if (users[i].email === email && users[i].password === password){
    //         res.render('secrets',{message:'ok'});
    //     }else{
    //         console.log('data not found');
    //     }
    // }
});
app.route('/register')
.get(function(req,res){
    res.render('register');
})
.post(function(req,res){
    const email=req.body.email;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const loginAttempt=new secretModel({
            email:email,
            password:hash
        })
        
        loginAttempt.save().then(()=>console.log('The data has been parsed to the server')).then(function(){
            res.redirect('/');
        })
        
    });
    
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})

