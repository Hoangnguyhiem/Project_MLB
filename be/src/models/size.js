import mongoose from "mongoose";
const sizeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            uppercase: true,
            index: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Size",
            required: true,
        }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.models.Size || mongoose.model("Size", sizeSchema);
