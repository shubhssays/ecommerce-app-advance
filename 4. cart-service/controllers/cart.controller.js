const RequestHandler = require("../handlers/request.handler");
const CartService = require("../services/cart.service");

class CartController {
    static async addItemToCartHandler(request, reply) {
        const validData = request.userInput;
        const data = await CartService.addItemToCart(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async updateCartItemHandler(request, reply) {
        const validData = request.userInput;
        const data = await CartService.updateCartItem(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async getCartItemsHandler(request, reply) {
        const validData = request.userInput;
        const data = await CartService.getCartItems(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async removeItemFromCartHandler(request, reply) {
        const validData = request.userInput;
        const data = await CartService.removeItemFromCart(validData);
        return RequestHandler.successHandler(request, reply, data);
    }
}

module.exports = CartController;