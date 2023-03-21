//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session=require('express-session')
const passport=require('passport')
const localStrategy=require('passport-local').Strategy;
const passportLocalMongoose=require('passport-local-mongoose')

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret:'My little secret',
    resave:false,
    saveUninitialized:false
}
));
app.use(passport.initialize())
app.use(passport.session())
mongoose.connect('mongodb://127.0.0.1:27017/passport');



const secretSchema=new mongoose.Schema({
    username:String,
    password:String
})
secretSchema.plugin(passportLocalMongoose)

const User=mongoose.model('User',secretSchema)
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/',function(req,res){
    res.render('home');
}); 
app.get('/secret',function(req,res){
   if (req.isAuthenticated){
    res.render('secrets')
   }else{
    res.render("login")
   }
});
app.get('/register',function(req,res){
    res.render('register');
});
app.post('/register',function(req,res){
    const newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secret')
            })
        }
    })
});
app.get('/login',function(req,res){
    res.render('login');
    
})
app.post('/login',passport.authenticate('local',{
    successRedirect:'/secret',
    failureRedirect:'/login'
}))
app.get('/logout',function(){
    res.redirect('/')
})


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})

