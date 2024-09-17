import Favorite from "../models/favorite";
import { StatusCodes } from "http-status-codes";

export const getFavoriteUserId = async (req, res) => {
    try {
        const { _id } = req.user;
        const userId = _id.toString()

        const favorite = await Favorite.find({ userId }).populate(
            {
                path: "productId",
                populate: [
                    {
                        path: 'attributes',
                        populate: [
                            {
                                path: 'color',
                            },
                            {
                                path: 'variants',
                                populate: {
                                    path: 'size',
                                    select: 'name',
                                },
                            },
                        ],
                    },
                ],
            });
        if (!favorite) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        }
        return res.status(StatusCodes.OK).json(favorite);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
export const addFavoriteUserId = async (req, res) => {
    try {
        const { _id } = req.user;
        const userId = _id.toString()
        const { productId } = req.body


        const favorite = await Favorite.create({ userId, productId });
        if (!favorite) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        }
        return res.status(StatusCodes.OK).json(favorite);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
export const deleteFavoriteUserId = async (req, res) => {
    try {
        const { _id } = req.user;
        const userId = _id.toString()
        const { productId } = req.params;

        const favorite = await Favorite.findOneAndDelete({ userId, productId });
        if (!favorite) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        }
        return res.status(StatusCodes.OK).json(favorite);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};