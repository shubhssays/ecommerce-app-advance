const RequestHandler = require("../handlers/request.handler");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    static async addProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.addProductToInventory(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async updateProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.updateProductInInventory(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async getAllProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.getProductDetails(validData);
        return RequestHandler.successHandler(request, reply, data);
    }

    static async deleteProductDetailsHandler(request, reply) {
        const validData = request.userInput;
        const data = await InventoryService.deleteProductFromInventory(validData);
        return RequestHandler.successHandler(request, reply, data);
    }
}

module.exports = InventoryController;