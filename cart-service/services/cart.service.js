const ClientError = require("../errors/client.error");
const InventoryModel = require("../config/models/cart.model");
const ServerError = require("../errors/server.error");
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
        let { cart_ids, user_id } = userInput;

        if (cart_ids && cart_ids.length > 0) {
            cart_ids = cart_ids.replace(/\s+/g, '').split(',');
            // Remove the specified products from the cart
            await InventoryModel.destroy({
                where: {
                    id: cart_ids,
                    userId: user_id
                }
            });

            return {
                message: 'Specified products removed from cart successfully'
            };
        } else {
            // Remove all products from the cart for the user
            await InventoryModel.destroy({
                where: {
                    userId: user_id
                }
            });

            return {
                message: 'All products removed from cart successfully'
            };
        }
    }

    static async getCartItems(userInput) {
        const { user_id, page = 1, limit = 10, skip_limit = false, skip_not_found_error = false } = userInput;

        let cartItems, count;

        if (skip_limit) {
            // Fetch all cart items without pagination
            const result = await InventoryModel.findAndCountAll({
                where: { userId: user_id }
            });
            cartItems = result.rows;
            count = result.count;
        } else {
            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Fetch cart items with pagination
            const result = await InventoryModel.findAndCountAll({
                where: { userId: user_id },
                limit,
                offset
            });
            cartItems = result.rows;
            count = result.count;
        }

        if (!skip_not_found_error && cartItems.length === 0) {
            return {
                message: 'No items found in cart',
                cartItems: []
            }
        }

        return {
            message: 'Cart items fetched successfully',
            cartItems: cartItems.map(item => item.toJSON()),
            pagination: skip_limit ? null : {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
}

module.exports = CartService;