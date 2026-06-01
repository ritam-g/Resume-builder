import mongoose from "mongoose";

export async function connectDb() {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI!)
        }
        console.log('db is connected')
    } catch (error) {
        console.log(error)
    }
}