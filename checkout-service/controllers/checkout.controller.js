const RequestHandler = require("../handlers/request.handler");
const CheckoutService = require("../services/checkout.service");

class CartController {
    static async checkoutHandler(request, reply) {
        const validData = request.userInput;
        const data = await CheckoutService.checkout(validData);
        return RequestHandler.successHandler(request, reply, data);
    }
}

module.exports = CartController;