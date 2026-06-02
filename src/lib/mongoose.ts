import mongoose from "mongoose";

/**  
 * Connect to MongoDB
 * @function connectDB
 * @returns {Promise<void>}
 */
export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!)

        console.log("Connected to MongoDB")

    } catch (error) {
        console.log(error)
    }
}