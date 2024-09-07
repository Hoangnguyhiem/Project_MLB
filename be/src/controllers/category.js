import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import Category from "../models/category";
import Product from "../models/product";
export const create = async (req, res) => {
    try {
        const { name, parentId } = req.body
        let image = null;
        if (req.file) {
            // Nếu có tệp, bạn có thể lưu hoặc xử lý nó ở đây
            image = req.file.path; // Đường dẫn đến tệp đã upload
        }
        const category = await Category.create({
            name: name,
            slug: slugify(name, "-"),
            image: image,
            parentId: parentId || null,
        });
        const savedCategory = await category.save();

        // Nếu danh mục này có parentId, cập nhật subcategoriesId của danh mục cha
        if (parentId) {
            await Category.findByIdAndUpdate(
                parentId,
                { $push: { subcategoriesId: savedCategory._id } },
                { new: true }
            );
        }
        return res.status(StatusCodes.CREATED).json(savedCategory);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};


export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params; // Sử dụng destructuring để lấy id
        const category = await Category.find(id)
        if (!category) {
            // Sửa điều kiện kiểm tra
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy danh mục!" }); // Cập nhật thông điệp cho rõ ràng
        }
        return res.status(StatusCodes.OK).json({
            category,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getAllByCategoryId = async (req, res) => {
    const { id } = req.params
    try {
        const categories = await Category.find({ parentId: id }).populate("subcategoriesId");
        if (categories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: "Không có danh mục nào!" });
        }
        return res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};


export const getAllParent = async (req, res) => {
    try {
        const categories = await Category.find({ parentId: null }).populate({ path: "subcategoriesId", populate: "subcategoriesId" });

        if (categories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: "Không có danh mục nào!" });
        }
        return res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getAllChildren = async (req, res) => {
    try {
        // { subcategoriesId: [] }
        const categories = await Category.find().populate({ path: "subcategoriesId", populate: "subcategoriesId" });

        if (categories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: "Không có danh mục nào!" });
        }
        return res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};



export const getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let products = [];
        const category = await Category.findById(id).populate({
            path: "subcategoriesId",
            populate: {
                path: "subcategoriesId",
                populate: {
                    path: "subcategoriesId"
                }
            }
        });
        if (category.subcategoriesId.length === 0) {
            products = await findProductsByCategories([id], req.query);
        } else {
            const categoryIds = category.subcategoriesId.flatMap(sub => {
                if (sub.subcategoriesId.length === 0) return sub._id;
                return sub.subcategoriesId.flatMap(subSub => {
                    if (subSub.subcategoriesId.length === 0) return subSub._id;
                    return subSub.subcategoriesId.map(subSubSub => subSubSub._id);
                });
            });

            products = await findProductsByCategories([...categoryIds], req.query);
        }
        return res.status(StatusCodes.OK).json(products);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
const findProductsByCategories = async (categoryIds, query) => {
    const page = parseInt(query.page) - 1 || 0;
    const limit = parseInt(query.limit) || 16;
    const search = query.search || '';
    // const colors = query.colors ? query.colors.split(',') : ['66ce6df95f1e96fe6c896fef'];
    // console.log(colors);
    
    const products = await Product.find({
        category: { $in: categoryIds },
        name: { $regex: search, $options: "i" },
        style : { $in:["2","3","4","1"] },
    })
        .populate('category')
        .populate({
            path: 'attributes',
            populate: [
                {
                    path: 'color',
                },
                {
                    path: 'variants',
                    populate: {
                        path: 'size',
                        select: 'name'
                    }
                }
            ]
        })
        .skip(page * limit)
        .limit(limit)
        .lean();

    const totalProducts = await Product.countDocuments({ category: { $in: categoryIds } });
    const totalPage = Math.ceil(totalProducts / limit);

    return {
        products,
        page: page + 1,
        limit,
        totalPage
    };
};





export const deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json(category);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
export const updateCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json(category);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

// iphone 13 product max => /product/iphone-13-product-max
// GET /product/:slug
