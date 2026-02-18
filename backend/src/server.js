import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js'; 
import messageRoute from './routes/messages.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});