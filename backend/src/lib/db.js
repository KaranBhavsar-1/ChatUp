import mangoos from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn = await mangoos.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected Successfully!!! : " , conn.connection.host )
    } catch (error) {
        console.error("Got errer:" , error)
        process.exit(1) ; //1 = means fail , 0 = success
    }
}