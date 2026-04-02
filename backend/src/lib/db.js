import mangoos from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async ()=>{
    try {
        const {MONGO_URI} = ENV;
        if(!MONGO_URI) throw new Error("MONGO_URI is not set!");
        
        const conn = await mangoos.connect(ENV.MONGO_URI)
        console.log("MongoDB Connected Successfully!!! : " , conn.connection.host )
    } catch (error) {
        console.error("Got errer:" , error)
        process.exit(1) ; //1 = means fail , 0 = success
    }
}