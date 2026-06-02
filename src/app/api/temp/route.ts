import { connectDB } from "@/lib/mongoose";

export async function GET() {

    try {
        await connectDB()

        return Response.json({
            message: "hello"
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            message: "error"
        }, { status: 500 })
    }
}