import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
