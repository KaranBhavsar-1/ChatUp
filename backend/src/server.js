import express from 'express';
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000
// const NODE_ENV = process.env.NODE_ENV

app.use(express.json()) //under request.body

app.use("/api/auth" , authRoutes)
app.use("/api/message" , messageRoutes)

// make ready for deployment 
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(_,res)=>{
        // res.sendFile(path.join(__dirname,"../frontend","dist", "index.html"));
        res.sendFile(path.join(__dirname,"../frontend", "dist","index.html"));
    })
}

app.listen(PORT, ()=> {
    console.log("Server running on port " + PORT)
    connectDB();
});