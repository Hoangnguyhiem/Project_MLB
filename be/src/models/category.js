import mongoose, { Schema } from "mongoose";
// https://file.hstatic.net/200000642007/file/quan_ao_95bd9be66a87420b8f5ef12689c994ae.jpg

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            uppercase: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        image: {
            type: String,
            default: null
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null
        },
        subcategoriesId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                default: null
            }
        ]
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model.Category || mongoose.model("Category", categorySchema);
