import mongoose from "mongoose";
const colorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        color: {
            type: String,
        }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.models.Color || mongoose.model("Color", colorSchema);
