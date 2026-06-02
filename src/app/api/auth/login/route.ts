// connectDB
// userModel
// generateAccessToken
// generateRefreshToken
// setAccessCookie
// setRefreshCookie

import { setAccessCookie, setRefreshCookie } from "@/lib/cookies";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import userModel from "@/models/User.model";
import { ApiResponse } from "@/types/apiResponse.type";
import { NextRequest } from "next/server";

// NextRequest
export async function POST(req: NextRequest) {
    try {
        //connect db
        await connectDB()

        // get body
        const { email, password } = await req.json()

        // validate fields
        if (!email || !password) {
            const response: ApiResponse = { message: "All fields are required", success: false }
            return Response.json(response, { status: 400 })
        }

        // check existing user
        const isMatch = await userModel.findOne({ email })
        if (!isMatch) {
            const response: ApiResponse = { message: "User not found", success: false }
            return Response.json(response, { status: 400 })
        }

        // check password
        if (! await isMatch.comparePassword(password)) {
            const response: ApiResponse = { message: "Invalid password", success: false }
            return Response.json(response, { status: 400 })
        }

        // generate access token
        const accessToken = await generateAccessToken({ id: isMatch._id.toString() })

        // generate refresh token
        const refreshToken = await generateRefreshToken({ id: isMatch._id.toString() })

        // save refresh token to db
        isMatch.refreshToken = refreshToken
        await isMatch.save()

        // set cookies
        await setAccessCookie(accessToken)
        await setRefreshCookie(refreshToken)

        const response: ApiResponse = { message: "Login successful", success: true }
        return Response.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        const response: ApiResponse = { message: "error", success: false }
        return Response.json(response, { status: 500 })
    }
}