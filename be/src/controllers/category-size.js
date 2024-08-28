import CategorySize from "../models/category-size"
import { StatusCodes } from "http-status-codes";


export const create = async (req, res) => {
    try {
        const { name } = req.body
        console.log(name);
        
        const category = await CategorySize.create({name})
        return res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getAllCategoriesSize = async (req, res) => {
    try {
        const category = await CategorySize.find()
        return res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};