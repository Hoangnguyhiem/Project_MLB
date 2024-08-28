import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        sex: {
            type: Boolean,
            default: true,
        },
        designs: {
            type: String,
            required: true,
        },
        design: {
            type: String,
            required: true,
        },
        colorText: {
            type: String,
            required: true,
        },
        material: {
            type: String,
            required: true,
        },
        photoSize: {
            type: String,
            required: true,
        },
        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        featured: Boolean,
        attributes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attribute",
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
export default mongoose.models.Product || mongoose.model("Product", productSchema);
