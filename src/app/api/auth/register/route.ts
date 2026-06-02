import { setAccessCookie, setRefreshCookie } from "@/lib/cookies";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import userModel from "@/models/User.model";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {


    try {
        // connect db
        await connectDB()
        // get body
        const { name, email, password, mobile } = await req.json()
        // validate fields
        if (!name || !email || !password || !mobile) {
            return Response.json({
                message: "All fields are required"
            }, { status: 400 })
        }
        // check existing user
        const isMatch = await userModel.findOne({ $or: [{ email }, { mobile }], })
        if (isMatch) {
            return Response.json({
                message: "User already exists"
            }, { status: 400 })
        }
        // create user
        const newUser = await userModel.create({ name, email, password, mobile })
        // generate access token
        const accessToken = await generateAccessToken({ id: newUser._id.toString() })
        // generate refresh token
        const refreshToken = await generateRefreshToken({ id: newUser._id.toString() })

        // save refresh token to db
        newUser.refreshToken = refreshToken
        await newUser.save()
        // create response
        await setAccessCookie(accessToken)
        await setRefreshCookie(refreshToken)
        // set access cookie

        // set refresh cookie

        // return response
        const response: ApiResponse = {
            message: "User created successfully",
            success: true,
        };

        return Response.json(response);
    } catch (error) {
        console.log(error)
        const response: ApiResponse = {
            message: "Something went wrong",
            error: error,
            success: false,
        };
        if (error instanceof Error) {
            return Response.json(response, { status: 500 })
        } else {
            return Response.json(response, { status: 500 })
        }
    }
}