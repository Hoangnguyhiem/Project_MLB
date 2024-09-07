import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart";

// Lấy danh sách sản phẩm thuộc 1 user
export const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId }).populate({
            path: "products.productId",
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
        }).populate("products.attributeId")
            .populate("products.variantId");
        const cartData = {
            products: cart.products.map((item) => ({
                productId: item.productId,
                color: item.color,
                images: item.images,
                variantId: item.variantId,
                attributeId: item.attributeId,
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
export const addItemToCart = async (req, res) => {
    const { userId, variantId, attributeId, productId, quantity, color, images, price, size, name, slug, status, discount } = req.body;
    try {
        // kiểm tra giỏ hàng có tồn tại chưa? dựa theo UserId
        let cart = await Cart.findOne({ userId })
        // nếu giỏ hàng không tồn tại thì chúng ta tạo mới
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }
        const existColorIndex = cart.products.findIndex(
            (item) => item.variantId.toString() == variantId
        );
        // kiểm tra xem sản có tồn tại trong giỏ hàng không?
        if (existColorIndex !== -1) {
            // nếu mà sản phẩm tồn tại trong giỏ hàng thì chúng ta cập nhật số lượng
            cart.products[existColorIndex].quantity += quantity;
        } else {
            // nếu sản phẩm chưa có trong giỏ hàng thì chúng ta thêm mới
            cart.products.push({ attributeId, variantId, productId, quantity, color, images, price, size, name, slug, status, discount });
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
    const { userId, variantId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" });
        }
        cart.products = cart.products.filter(
            (product) => product.variantId && product.variantId.toString() !== variantId
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
    const { userId, productId, variantDefault, attributeId, variantId, images, price, quantity, slug, status, color, size, name, discount } = req.body;



    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" });
        }

        const existColorIndex = cart.products.findIndex(
            (item) => item.variantId.toString() == variantId
        );
        if (variantId == variantDefault?._id) {
            cart.products[existColorIndex].quantity = quantity;
        }
        else if (existColorIndex !== -1) {
            // nếu mà sản phẩm tồn tại trong giỏ hàng thì chúng ta cập nhật số lượng
            cart.products[existColorIndex].quantity += quantity;
            filterCarts(cart, variantDefault)
        } else {
            // nếu sản phẩm chưa có trong giỏ hàng thì chúng ta thêm mới
            cart.products.push({ productId, variantId, attributeId, price, size, slug, status, discount, color, images, name, quantity });
            filterCarts(cart, variantDefault)
        }
        cart.updateTotals();
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" });
    }
};

const filterCarts = async (cart, variantDefault) => {
    cart.products = cart.products.filter(
        (item) => item.variantId.toString() !== variantDefault._id.toString()
    );
}

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
