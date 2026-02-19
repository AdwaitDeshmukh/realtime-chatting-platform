import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js'; 
import messageRoute from './routes/messages.route.js';
import path from 'path';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
dotenv.config();

const app = express();
const port = ENV.PORT || 5000;
app.use(express.json());
const _dirname=path.resolve();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

if (ENV.NODE_ENV === "production" || true) { 
    // This points to E:\chatting_app\frontend\dist
    app.use(express.static(path.join(_dirname, "frontend", "dist")));

    // This ensures any page refresh or direct URL access returns the React app
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
});