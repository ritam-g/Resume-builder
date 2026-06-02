import { IUser } from "@/types/user.type";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt"

export interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}
export type UserDocument = IUser & IUserMethods & Document;
const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false

    },
    mobile: {
        type: Number,
        required: [true, "Mobile is required"],
        unique: true
    },
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (checkPassword: string) {
    return await bcrypt.compare(checkPassword, this.password);
};

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel