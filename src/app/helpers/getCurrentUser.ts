import { setAccessCookie } from "@/lib/cookies";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import userModel from "@/models/User.model";
import { cookies } from "next/headers";

/**  
 * Get Current User
 * @function getCurrentUser
 * @returns {Promise<IUser | null>}
 * @description first verify Access token, then find user
 * 
 */
export async function getCurrentUser() {
    try {
        await connectDB()
        const cookie = await cookies()
        const token = cookie.get('accessToken')
        if (!token) {
            throw new Error('No token found')
        }

        const decode = await verifyAccessToken(token.value)

        if (!decode || typeof decode === 'string') {
            throw new Error('Invalid token')
        }
        const user = await userModel.findById(decode.id)
        if (!user) {
            throw new Error('User not found')
        }
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}
/**  
 * Rotate Token
 * @function rotateToken
 * @returns {Promise<IUser | null>}
 * @description first verify Refresh token, then find user and generate new token
 * 
 */
export async function rotateToken() {
    try {
        await connectDB();

        const cookieStore = await cookies();

        const refreshToken = cookieStore.get("refreshToken");

        if (!refreshToken) {
            throw new Error("No refresh token found");
        }

        const decoded = verifyRefreshToken(refreshToken.value);

        if (!decoded || typeof decoded === "string") {
            throw new Error("Invalid refresh token");
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            throw new Error("User not found");
        }

        // IMPORTANT SECURITY CHECK
        if (user.refreshToken !== refreshToken.value) {
            throw new Error("Refresh token mismatch");
        }

        const newAccessToken = generateAccessToken({
            id: user._id.toString(),
        });

        

        await user.save();

        await setAccessCookie(newAccessToken);


        return {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}