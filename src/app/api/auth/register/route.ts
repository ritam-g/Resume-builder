import { connectDb } from "@/lib/mongoose";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./api.types";
import userModel from "@/models/User.model";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const body: RegisterBody = await req.json();
        const { name, email, password, modbile } = body;

        if (!name || !email || !password || !modbile) {
            return NextResponse.json<ApiResponse>({
                message: "All fields are required",
                sucess: false,
            }, {
                status: 400,
            });
        }

        const isExist = await userModel.findOne({ email });

        if (isExist) {
            return NextResponse.json<ApiResponse>({
                message: "User already exists",
                sucess: false,
            }, {
                status: 409,
            });
        }

        const newUser = await userModel.create({
            name,
            email,
            password,
            modbile,
        });

        const token = generateToken({
            userId: newUser._id.toString(),
        });

        const response = NextResponse.json<ApiResponse>({
            message: "User created successfully",
            sucess: true,
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    modbile: newUser.modbile,
                },
            },
        }, {
            status: 201,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60,
            secure: process.env.NODE_ENV === "production",
        });

        return response;

    } catch (error) {
        console.error(error);

        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            sucess: false,
            erors:  error
        }, {
            status: 500,
        });
    }
}