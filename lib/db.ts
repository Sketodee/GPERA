import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            serverSelectionTimeoutMS: 20000,
        })
        console.log("Successfully connected to MongoDb")
    } catch (error :any) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}


export default connectDb