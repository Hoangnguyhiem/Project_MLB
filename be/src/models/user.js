import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 3,
            maxlength: 30,
        },
        password: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        date: {
            type: String,
         
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        avatar: {
            type: String,
            default: "../upload/default-avatar.jpeg",
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model.User || mongoose.model("User", userSchema);
