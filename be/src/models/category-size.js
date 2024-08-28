import mongoose, { Schema } from "mongoose";

const categorySizeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            uppercase: true,
        }
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model.CategorySize || mongoose.model("CategorySize", categorySizeSchema);
