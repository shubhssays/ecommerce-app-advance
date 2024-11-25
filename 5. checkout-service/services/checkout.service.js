const ClientError = require("../errors/client.error");
const ServerError = require("../../../banking-app-basic/customer-service/errors/server.error");
const Axios = require('../utils/axios');
const config = require('config');
const getServiceUrl = require('../utils/eurekaClient');

class CheckoutService {

    static async checkout(userInput) {
        const { user_id, cart_ids } = userInput;

        // check for duplicate cart_ids
        if (cart_ids && new Set(cart_ids).size !== cart_ids.length) {
            throw new ClientError('Duplicate cart ids');
        }

        // Fetch cart items
        const cartServiceUrl = await getServiceUrl(config.get("appNameCart"));
        let cartItemsResponse;

        const cartServiceError = new ServerError('Error in fetching cart items');

        try {
            const axios = new Axios(cartServiceUrl);
            cartItemsResponse = await axios.get(`/${user_id}?skip_limit=true&skip_not_found_error=true`);
        } catch (error) {
            console.log('Error in fetching cart items', error);
            throw cartServiceError;
        }

        if (cartItemsResponse.status != 'success') {
            throw cartServiceError;
        }

        const cartItems = cartItemsResponse.data.cartItems;

        if (cartItems.length === 0) {
            throw new ClientError('Cart is empty');
        }

        // Check if cart_ids is valid
        if (cart_ids && cart_ids.length > 0) {
            const invalidCartIds = cart_ids.filter(cartId => !cartItems.map(item => item.id).includes(cartId));
            if (invalidCartIds.length > 0) {
                throw new ClientError(`Invalid cart ids: ${invalidCartIds.join(',')}`);
            }
        }

        // Calculate total price
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.quantity * item.priceAtAddition;
        });

        // Deduct inventory
        const inventoryServiceUrl = await getServiceUrl(config.get("appNameInventory"));
        const inventoryError = new ServerError('Error in updating inventory');

        for (const item of cartItems) {
            try {
                const axios = new Axios(inventoryServiceUrl);
                await axios.post(`/deduct`, { quantity: Number(item.quantity), product_detail_id: item.productDetailId, product_id: item.productId });
            } catch (error) {
                console.log('Error in updating inventory', error);
                if(error.response && error.response.status == 400) {
                    throw new ClientError(error.response.data.message);
                }
                throw inventoryError;
            }
        }

        // Clear cart
        const cartClearError = new ServerError('Error in clearing cart');

        try {
            const axios = new Axios(cartServiceUrl);
            let params= `?user_id=${user_id}`;

            if (cart_ids && cart_ids.length > 0) {
                params += `&cart_ids=${cart_ids.join(',')}`;
            }

            console.log('params', params);

            await axios.delete(`/${params}`);
        } catch (error) {
            console.log('Error in clearing cart', error);
            throw cartClearError;
        }

        // Trigger notification
        return {
            message: 'Checkout successful',
            totalPrice
        };
    }
}

module.exports = CheckoutService;