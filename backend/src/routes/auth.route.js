import express from 'express'; 
const router = express.Router();
import { signup } from '../controllers/auth.controller.js';
import {login,logout} from '../controllers/auth.controller.js';

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router; 