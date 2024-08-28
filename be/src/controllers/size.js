import { StatusCodes } from "http-status-codes";
import Size from "../models/size";

export const create = async (req, res) => {
    try {
        const size = await Size.create(req.body);
        console.log(size);
        
        return res.status(StatusCodes.CREATED).json(size);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getAllSizes = async (req, res) => {
    try {
        const size = await Size.find()
        return res.status(StatusCodes.CREATED).json(size);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};