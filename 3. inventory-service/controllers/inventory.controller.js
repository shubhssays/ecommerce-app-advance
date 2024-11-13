const RequestHandler = require("../handlers/request.handler");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    static async addProductToInventoryHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.addProductToInventory(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async updateProductInInventoryHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.updateProductInInventory(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async getProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.getProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async deleteProductFromInventoryHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.deleteProductFromInventory(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async findProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.findProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }
}

module.exports = InventoryController;