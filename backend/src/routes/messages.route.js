import express from 'express';
import { getAllContacts } from '../controllers/message.controller.js';
const router =express.Router();
import { protectRouter } from '../middleware/auth.middleware.js';
import { getMessagesByUserId } from '../controllers/message.controller.js';
import { sendMessage } from '../controllers/message.controller.js';
import  {getAllCharPartners} from '../controllers/message.controller.js';
router.get("/contacts",protectRouter,getAllContacts);
router.get("/chats",protectRouter,getAllCharPartners);
 router.get("/:id",protectRouter,getMessagesByUserId)
router.post("/send/:id",protectRouter, sendMessage);

export default router;