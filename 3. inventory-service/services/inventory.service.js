const ClientError = require("../errors/client.error");
const GeneralError = require("../errors/general.error");
const InventoryModel = require("../config/models/inventory.model");

class InventoryService {

    static async addProductToInventory(userInput) {
        const { product_id, product_detail_id, quantity } = userInput;

        // Check if product already exists in inventory
        const existingProduct = await InventoryModel.findOne({
            where: { productId: product_id, productDetailId: product_detail_id }
        });

        if (existingProduct) {
            throw new ClientError('Product with provided product detail already exists in inventory');
        }

        // Add new product to inventory
        const newProduct = await InventoryModel.create({
            productId: product_id,
            productDetailId: product_detail_id,
            quantity
        });

        return {
            message: 'Product added to inventory successfully',
            product: newProduct.toJSON()
        };
    }

    static async updateProductInInventory(userInput) {
        const { inventory_id, quantity } = userInput;

        // Check if product exists in inventory
        const product = await InventoryModel.findOne({
            where: { id: inventory_id }
        });

        if (!product) {
            throw new ClientError('Product not found in inventory');
        }

        // Update product in inventory
        await product.update({ quantity });

        return {
            message: 'Product updated in inventory successfully',
            product: product.toJSON()
        };
    }

    static async deleteProductFromInventory(userInput) {
        const { product_id, product_detail_id } = userInput;

        // Build the where clause based on the presence of product_detail_id
        const whereClause = { productId: product_id };
        if (product_detail_id) {
            whereClause.productDetailId = product_detail_id;
        }

        // Check if products exist in inventory
        const products = await InventoryModel.findAll({
            where: whereClause
        });

        if (products.length === 0) {
            throw new ClientError('Products not found in inventory');
        }

        // Delete all found products
        await InventoryModel.destroy({
            where: whereClause
        });

        return {
            message: 'Product deleted from inventory successfully',
        };
    }


    static async getProductDetails(userInput) {
        const { product_id, product_detail_id, page = 1, limit = 10 } = userInput;

        // Build the where clause based on the presence of product_detail_id
        const whereClause = { productId: product_id };
        if (product_detail_id) {
            whereClause.productDetailId = product_detail_id;
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Fetch products with pagination
        const { rows: inventory, count } = await InventoryModel.findAndCountAll({
            where: whereClause,
            limit,
            offset
        });

        if (inventory.length === 0) {
            throw new ClientError('Products not found in inventory');
        }

        return {
            message: 'Inventory products fetched successfully',
            inventory: inventory.map(product => product.toJSON()),
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
}

module.exports = InventoryService;