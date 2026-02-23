import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoute from './routes/auth.route.js'; 
import messageRoute from './routes/messages.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const port = ENV.PORT || 5000;

app.use(cors({ 
  origin: ENV.NODE_ENV === "production" 
    ? "https://realtime-chatting-platform.onrender.com"  // hardcoded, no env variable
    : "http://localhost:5173",
  credentials: true 
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

console.log("CLIENT_URL:", ENV.CLIENT_URL);
console.log("CLIENT_URL length:", ENV.CLIENT_URL?.length);

if (ENV.NODE_ENV === "production") {
    const _dirname = path.resolve();
    app.use(express.static(path.join(_dirname, "frontend", "dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});