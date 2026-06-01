import { IUser } from "@/types/user.types"
import mongoose from "mongoose"




let userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [1024, "Password can not be more than 1024 characters"]
    },
    modbile: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})
// hash passwrod also isModified thing return void 
// compare pas return boolean
const userModel = mongoose.model("User", userSchema)

export default userModel