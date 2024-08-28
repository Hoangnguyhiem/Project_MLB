import mongoose, { Schema } from "mongoose";
const ValueAttributeSchema = new Schema(
    {
        price: {
            type: Number,
            required: true,
        },
        size: {
            type: Schema.Types.ObjectId,
            ref: "Size",
        },
        stock: {
            type: Number,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        discount: {
            type: Number,
        }
    },
    { timestamps: false, versionKey: false }
);
export const ValueAttributeModel = mongoose.model("ValueAttribute", ValueAttributeSchema);

const AttributeSchema = new Schema(
    {
        color: {
            type: Schema.Types.ObjectId,
            ref: "Color",
        },
        image: [],
        variants: [
            {
                type: Schema.Types.ObjectId,
                ref: "ValueAttribute",
            },
        ],
    },
    { timestamps: false, versionKey: false }
);
export default mongoose.model.Attribute || mongoose.model("Attribute", AttributeSchema);
