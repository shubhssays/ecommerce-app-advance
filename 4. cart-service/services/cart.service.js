const ClientError = require("../errors/client.error");
const InventoryModel = require("../config/models/cart.model");
const ServerError = require("../../../banking-app-basic/customer-service/errors/server.error");
const Axios = require('../utils/axios');
const config = require('config');
const getServiceUrl = require('../utils/eurekaClient');

class CartService {

    static async addItemToCart(userInput) {
        const { user_id, product_detail_id, quantity } = userInput;

        // Fetch product details
        const productDetailServiceUrl = await getServiceUrl(config.get("appNameProductDetails"));
        let productDetailResponse;

        const productDetailError = new ServerError('Error in fetching product details');

        try {
            const axios = new Axios(productDetailServiceUrl);
            productDetailResponse = await axios.get(`/product/${product_detail_id}`);
        } catch (error) {
            console.log('Error in fetching product details', error);
            throw productDetailError;
        }

        if (productDetailResponse.status != 'success') {
            throw productDetailError;
        }

        if (Object.keys(productDetailResponse.data.productDetails).length === 0) {
            throw new ClientError('Invalid product_detail_id');
        }

        const price = productDetailResponse.data.productDetails.price;
        const productId = productDetailResponse.data.productDetails.productId;
        const productDetailId = productDetailResponse.data.productDetails.id;

        // Check if the product is already in the cart
        const existingCartItem = await InventoryModel.findOne({
            where: { userId: user_id, productId: productId, productDetailId: product_detail_id }
        });

        if (existingCartItem) {
            // Update the quantity if the product is already in the cart
            await existingCartItem.update({ quantity: existingCartItem.quantity + quantity });
            return {
                message: 'Product quantity updated in cart successfully',
                cartItem: existingCartItem.toJSON()
            };
        }

        // check if the product is in inventory
        const inventoryServiceUrl = await getServiceUrl(config.get("appNameInventory"));
        let inventoryResponse;

        const inventoryError = new ServerError('Error in fetching product from inventory');

        try {
            const axios = new Axios(inventoryServiceUrl);
            inventoryResponse = await axios.get(`/product/${productId}`);
        } catch (error) {
            console.log('Error in fetching product from inventory', error);
            throw inventoryError;
        }

        if (inventoryResponse.status != 'success') {
            throw inventoryError;
        }

        const inventoryProduct = inventoryResponse?.data?.product || {};
        const availableQuantity = Number(inventoryProduct?.quantity || 0);

        if (!inventoryProduct || availableQuantity === 0) {
            throw new ClientError('Product is out of stock');
        }

        if (availableQuantity < quantity) {
            throw new ClientError(`Only ${availableQuantity} items are available in inventory`);
        }

        // Add new product to cart
        const newCartItem = await InventoryModel.create({
            userId: user_id,
            productId,
            productDetailId,
            quantity,
            priceAtAddition: price
        });

        return {
            message: 'Product added to cart successfully',
            cartItem: newCartItem.toJSON()
        };
    }

    static async updateCartItemQuantity(userInput) {
        const { cart_id, quantity } = userInput;

        // Check if the product is in the cart
        const cartItem = await InventoryModel.findOne({
            where: { id: cart_id }
        });

        if (!cartItem) {
            throw new ClientError('Product not found in cart');
        }

        // Fetch product details from inventory service
        const inventoryServiceUrl = await getServiceUrl(config.get("appNameInventory"));
        let inventoryResponse;

        const inventoryError = new ServerError('Error in fetching product from inventory');

        try {
            const axios = new Axios(inventoryServiceUrl);
            inventoryResponse = await axios.get(`/product/${cartItem.toJSON().productId}`);
        } catch (error) {
            console.log('Error in fetching product from inventory', error);
            throw inventoryError;
        }

        if (inventoryResponse.status != 'success') {
            throw inventoryError;
        }

        const inventoryProduct = inventoryResponse?.data?.product || {};
        const availableQuantity = Number(inventoryProduct?.quantity || 0);

        if (availableQuantity === 0) {
            throw new ClientError('Product is out of stock');
        }

        if (availableQuantity < quantity) {
            throw new ClientError(`Only ${availableQuantity} items are available in inventory`);
        }

        const updateCart = { quantity };

        // Update the quantity of the product in the cart
        await cartItem.update(updateCart);

        return {
            message: 'Product quantity updated in cart successfully',
            cartItem: cartItem.toJSON()
        };
    }

    static async removeItemFromCart(userInput) {
        const { cart_id } = userInput;

        // Check if the product is in the cart
        const cartItem = await InventoryModel.findOne({
            where: { id: cart_id }
        });

        if (!cartItem) {
            throw new ClientError('Product not found in cart');
        }

        // Remove the product from the cart
        await cartItem.destroy();

        return {
            message: 'Product removed from cart successfully'
        };
    }

    static async getCartItems(userInput) {
        const { user_id, page = 1, limit = 10 } = userInput;

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Fetch cart items with pagination
        const { rows: cartItems, count } = await InventoryModel.findAndCountAll({
            where: { userId: user_id },
            limit,
            offset
        });

        if (cartItems.length === 0) {
            throw new ClientError('Cart is empty');
        }

        return {
            message: 'Cart items fetched successfully',
            cartItems: cartItems.map(item => item.toJSON()),
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
}

module.exports = CartService;