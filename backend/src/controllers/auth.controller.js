import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";

export const signup=async(req,res)=>{
 const {fullName,email,password}=req.body;
 try{
if(!fullName||!email||!password){
    return res.status(400).json({message:"All fields are required"})
}
if(password.length<6){
    return res.status(400).json({message:"Password must be at least 6 characters"})
}
if(!email.includes("@")){
    return res.status(400).json({message:"Invalid email"})
}
const user=await User.findOne({email});
if(user){
    return res.status(400).json({message:"User already exists"})
}

const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt);
const newUser=new User({fullName,email,password:hashedPassword});
if (newUser) {
    generateToken(newUser._id, res);
    const savedUser = await newUser.save();

    // 1. Trigger the email FIRST (or at least before the return)
    try {
        // Use a fallback URL if ENV.CLIENT_URL isn't set yet
        const clientURL = ENV.CLIENT_URL || "http://localhost:5173";
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, clientURL);
    } catch (error) {
        console.log("Email Error in Controller:", error);
    }

    // 2. FINALLY send the response to Postman
    return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
    });
}
else{
    return res.status(400).json({message:"Something went wrong"})
}
 }
 catch(error){
console.log(error);
return res.status(500).json({message:"Something went wrong"})
 }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    }
    catch(error){
        console.log(error)
    }
};

export const logout=async(req,res)=>{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"User logged out"});
};