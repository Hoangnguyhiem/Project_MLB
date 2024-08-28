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
            products = await findProductsByCategories([id]);
        } else {
            const categoryIds = category.subcategoriesId.flatMap(sub => {
                if (sub.subcategoriesId.length === 0) return sub._id;
                return sub.subcategoriesId.flatMap(subSub => {
                    if (subSub.subcategoriesId.length === 0) return subSub._id;
                    return subSub.subcategoriesId.map(subSubSub => subSubSub._id);
                });
            });

            products = await findProductsByCategories([...categoryIds, id]);
        }
        return res.status(StatusCodes.OK).json(products);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
const findProductsByCategories = async (categoryIds) => {
    return await Product.find({ category: { $in: categoryIds } })
        .populate('category')
        .populate({
            path: 'attributes',
            populate: [
                {
                    path: 'color',
                    select: 'color'
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
        .lean();
};


// export const getProductsByCategory = async (req, res) => {

//     try {
//         const { id } = req.params;
//         let products = [];
//         const category = await Category.findById(id).populate({ path: "subcategoriesId", populate: "subcategoriesId" });
//         if (category.subcategoriesId.length <= 0) {
//             products = await findProductsByCategories(id)
//         }


//         if (category.subcategoriesId.length > 0) {
//             const categoryIds = category.subcategoriesId.map((item) => item._id)
//             const categorysub = category.subcategoriesId.map((item) => item.subcategoriesId)


//             if (categoryIds.length > 0) {
//                 const categoryIds = categorysub.flatMap((item) => item.map((value) => value._id))

//                 products = await findProductsByCategories(categoryIds)
//             } else {
//                 products = await findProductsByCategories(categoryIds)
//             }

//             products = await findProductsByCategories(categoryIds)
//         }

//         return res.status(StatusCodes.OK).json(products);
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//     }
// };

// const findProductsByCategories = async (categoryIds) => {
//     return await Product.find({ category: { $in: categoryIds } })
//         .populate('category')
//         .populate({
//             path: 'attributes',
//             populate: {
//                 path: 'sizes'
//             }
//         }).lean();
// };

























// export const getProductsByCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         let products = [];

//         const categoryItems = await CategoryItem.find({ parentCategoryId: id }).populate("subcategories").lean();
//         const categoryItem = await CategoryItem.findById(id).populate("subcategories").lean();

//         const categoryIds = categoryItems.flatMap(item => item.subcategories.map(subcat => subcat._id));

//         if (categoryItems.length > 0) {
//             if (categoryIds.length > 0) {
//                 products = await findProductsByCategories(categoryIds);
//             } else {
//                 const idCategories = categoryItems.map(item => item._id);
//                 products = await findProductsByCategories(idCategories);
//             }
//         } else if (categoryItem) {
//             const categoryIds = categoryItem.subcategories.map(item => item._id);
//             if (categoryIds.length > 0) {
//                 products = await findProductsByCategories(categoryIds);
//             } else {
//                 products = await findProductsByCategories([id]);
//             }
//         } else {
//             products = await findProductsByCategories([id]);
//         }

//         return res.status(StatusCodes.OK).json(products);

//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//     }
// };

// const findProductsByCategories = async (categoryIds) => {
//     return await Product.find({ category: { $in: categoryIds } })
//         .populate('category')
//         .populate({
//             path: 'attributes',
//             populate: {
//                 path: 'sizes'
//             }
//         }).lean();
// };

// export const getCategoryById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         let products;

//         const categoryItems = await CategoryItem.find({ parentCategoryId: id }).populate("subcategories").lean();
//         const categoryItem = await CategoryItem.findById(id).populate("subcategories").lean();
//         if (categoryItems.length > 0) {
//             // Lấy tất cả _id từ các subcategories
//             const categoryIds = categoryItems.flatMap(item => item.subcategories.map(subcat => subcat._id));

//             if (categoryIds.length <= 0) {
//                 const idCategories = categoryItems.map((item) => item._id);
//                 products = await Product.find({ category: idCategories })
//                     .populate('category')
//                     .populate({
//                         path: 'attributes',
//                         populate: {
//                             path: 'sizes'
//                         }
//                     }).lean();
//             } else {
//                 // Tìm tất cả sản phẩm thuộc các danh mục con
//                 products = await Product.find({ category: { $in: categoryIds } })
//                     .populate('category')
//                     .populate({
//                         path: 'attributes',
//                         populate: {
//                             path: 'sizes'
//                         }
//                     }).lean();
//             }
//         } else if (categoryItem) {
//             const categoryIds = categoryItem.subcategories.map((item) => (item._id))

//             if (categoryIds.length <= 0) {
//                 products = await Product.find({ category: id })
//                     .populate('category')
//                     .populate({
//                         path: 'attributes',
//                         populate: {
//                             path: 'sizes'
//                         }
//                     }).lean();
//             } else {
//                 products = await Product.find({ category: { $in: categoryIds } })
//                     .populate('category')
//                     .populate({
//                         path: 'attributes',
//                         populate: {
//                             path: 'sizes'
//                         }
//                     }).lean();

//             }

//         }
//         else {
//             // Nếu không có subcategories, lấy sản phẩm trực tiếp từ categoryId
//             products = await Product.find({ category: id })
//                 .populate('category')
//                 .populate({
//                     path: 'attributes',
//                     populate: {
//                         path: 'sizes'
//                     }
//                 }).lean();
//         }

//         // Trả về kết quả
//         return res.status(StatusCodes.OK).json(products);

//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//     }
// };



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
