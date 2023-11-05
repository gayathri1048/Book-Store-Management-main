const userSchema = require('../models/userSchema');
const bookSchema = require('../models/bookSchema');
const db = require('../config/db');
const bcrypt = require("bcrypt");
const session = require("express-session");

exports.getData = async (req,res) => {
    const getbooks = await bookSchema.find({}).exec();
    res.render('index', {
        books: getbooks
    });
}

exports.registerForm = async (req,res) => {
    res.render('signup');
}

exports.loginForm = async (req, res) => {
    res.render('signin');
}

exports.verifyLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        console.log(email,password);
        const existingEmail = await userSchema.findOne({email});
        if(existingEmail){
            const passwordMatch = await bcrypt.compare(password, existingEmail.password);
            if(passwordMatch) {
                req.session.user = existingEmail;
                req.session.isLoggedIn = true;
                res.send("Login successful");
                // return res.redirect('/');
            } else {
                return res.send("Please enter valid credentials");
            }
        } else {
            res.send("Please register before trying to login");
            // return res.redirect('back');
        }
    }
    catch(err){
        res.redirect('back');
    }
}

exports.createUser = async(req,res)=>{
    try{
        const {email,name,password} = req.body;
        const existingEmail = await userSchema.findOne({email});
        if(existingEmail){
            return res.send("email id is already exists. please try to login with your credentials");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userCreated =  await userSchema.create({email,name,password:hashedPassword});
        console.log('User Registered Successfully',userCreated);
        return res.redirect('back');
        
    }
    catch(err){
        console.log('error in creating a new user',err);
        return res.redirect('back');
    }
}

exports.getProfile = async (req,res) => {
    try {
        if(!req.session.user) {
            return res.send('You need to login first');
        }

        const user = await userSchema.findById(req.session.user._id);
        if (!user) {
            return res.send('An error occurred while fetching user details.');
        }
        
        // res.send(`Welcome, ${user.name}! Your email is ${user.email}.`);
        res.render('profile', {uname:user.name, email:user.email});
    } catch(error) {
        return res.status(500).send("Internal Server Error");
    }
}

exports.updateProfile = async (req,res) => {
    try {
        res.render('updateprofile');
    } catch(error) {
        console.log("error", error);
        res.send("Error in updating the profile");
    }
}

exports.saveUpdate = async (req,res) => {
    try {
        const userId = req.session.user._id;
        const updatedDetails = req.body;
        
        // Update user details in the database
        const {email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await userSchema.findByIdAndUpdate(userId, {email,password:hashedPassword}, { new: true });
        
        res.json(updatedUser);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}