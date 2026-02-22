import express from 'express'; 
const router = express.Router();
import { signup } from '../controllers/auth.controller.js';
import {login,logout,updateProfile} from '../controllers/auth.controller.js';
import { protectRouter } from '../middleware/auth.middleware.js';
import arcjet from '@arcjet/node';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

//router.use(arcjetProtection);


router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update",protectRouter,updateProfile);

router.get("/check",protectRouter,(req,res)=>res.status(200).json({message:"Authorized",user: req.user}))

router.get("/test",arcjetProtection,(req,res)=>res.status(200).json({message:"Authorized by arcjet"}));

export default router; 

