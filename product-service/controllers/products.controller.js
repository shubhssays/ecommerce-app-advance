const RequestHandler = require("../handlers/request.handler");
const ProductService = require("../services/products.service");

class ProductController {
    static async addProductHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductService.addProduct(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async getProductHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductService.getProducts(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async updateProductHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductService.updateProduct(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async getProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductService.getProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async deleteProductHandler(request, reply) {
        const validData = request.userInput;
        const data = await ProductService.deleteProduct(validData);
        return RequestHandler.successHandler(request, reply, data);
    }
}

module.exports = ProductController;