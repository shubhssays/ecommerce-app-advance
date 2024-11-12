const RequestHandler = require("../handlers/request.handler");
const ProductDetailsService = require("../services/productDetails.service");

class ProductDetailsController {
    static async addProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductDetailsService.addProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async updateProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductDetailsService.updateProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async getAllProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductDetailsService.getAllProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async deleteProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductDetailsService.deleteProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }
}

module.exports = ProductDetailsController;