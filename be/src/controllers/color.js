import { StatusCodes } from "http-status-codes";
import Color from "../models/color";

export const create = async (req, res) => {
    try {
        const color = await Color.create(req.body);
        console.log(color);
        
        return res.status(StatusCodes.CREATED).json(color);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getAllColors = async (req, res) => {
    try {
        const color = await Color.find()
        return res.status(StatusCodes.CREATED).json(color);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};