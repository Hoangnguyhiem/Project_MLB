import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart";
const findProductInCart = (cart, productId) => {
    return cart.products.find((item) => item.productId.toString() === productId);
};
// Lấy danh sách sản phẩm thuộc 1 user
export const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId })
        const cartData = {
            products: cart.products.map((item) => ({
                productId: item.productId._id,
                color: item.color,
                image: item.image,
                colorId: item.colorId,
                size: item.size,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                slug: item.slug,
            })),
        };
        const totalQuantity = cart.totalQuantity
        const totalPrice = cart.totalPrice
        return res.status(StatusCodes.OK).json({ cartData, totalQuantity, totalPrice });
    } catch (error) { }
};
// export const getTotalCartUserId = async (req, res) => {
//     const { userId } = req.params;
//     try {
//         const cart = await Cart.findOne({ userId }).populate("products.productId");
//         const totalQuantity = cart.totalQuantity
//         const totalPrice = cart.totalPrice
//         return res.status(StatusCodes.OK).json({cartData});
//     } catch (error) { }
// };
// Thêm sản phẩm vào giỏ hàng
export const addItemToCart = async (req, res) => {
    const { userId, colorId, productId, quantity, color, image, price, size, name, slug } = req.body;
    try {
        // kiểm tra giỏ hàng có tồn tại chưa? dựa theo UserId
        let cart = await Cart.findOne({ userId })

        // nếu giỏ hàng không tồn tại thì chúng ta tạo mới
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }
        // const existProductIndex = cart.products.findIndex(
        //     (item) => item.productId.toString() == productId
        // );
        const existColorIndex = cart.products.findIndex(
            (item) => item.colorId.toString() == colorId
        );




        // kiểm tra xem sản có tồn tại trong giỏ hàng không?
        if (existColorIndex !== -1) {
            // nếu mà sản phẩm tồn tại trong giỏ hàng thì chúng ta cập nhật số lượng
            cart.products[existColorIndex].quantity += quantity;
        } else {
            // const product = await Product.findOne(req.params.id)
            //     .populate({
            //         path: 'attributes',
            //         populate: {
            //             path: 'sizes'
            //         }
            //     });
            //     const price = product.attributes[0].sizes[existColorIndex].price
                
            // nếu sản phẩm chưa có trong giỏ hàng thì chúng ta thêm mới
            cart.products.push({ colorId, productId, quantity, color, image, price, size, name, slug });
        }
        cart.updateTotals();
        await cart.save();

        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        // trả về client lỗi
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" });
    }
};
// Xóa sản phẩm trong giỏ hàng thuộc 1 user

export const removeFromCart = async (req, res) => {
    const { userId, colorId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" });
        }
        cart.products = cart.products.filter(
            (product) => product.colorId && product.colorId.toString() !== colorId
        );
        cart.updateTotals();
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" });
    }
};
// Cập nhật số lượng sản phẩm trong giỏ hàng thuộc 1 user
export const updateProductQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" });
        }

        const product = findProductInCart(cart, productId);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" });
        }
        product.quantity = quantity;

        // Tự động cập nhật tổng số lượng và giá
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" });
    }
};

// Tăng số lượng của sản phẩm trong giỏ hàng
export const increaseProductQuantity = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = cart.products.find((item) => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        product.quantity++;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Giảm số lượng của sản phẩm trong giỏ hàng
export const decreaseProductQuantity = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = cart.products.find((item) => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (product.quantity > 1) {
            product.quantity--;
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
