const ClientError = require("../errors/client.error");
const GeneralError = require("../errors/general.error");
const ProductModel = require('../config/models/products.model');

class ProductService {
    static async addProduct(userInput) {
        const { name, description, category } = userInput;

        // Check for duplicate entry based on email and phone number
        const existingProduct = await ProductModel.findOne({
            attributes: ['id'],
            where: {
                name
            },
        });

        if (existingProduct) {
            throw new ClientError('Product with this name already exists. Please try again with different name');
        }

        // Create new product
        const newProduct = await ProductModel.create({
            name,
            description,
            category,
        });

        return {
            message: 'Product added successfully',
            product: newProduct.toJSON(),
        };
    }

    static async getProducts(userInput) {
        const { page = 1, limit = 10 } = userInput;
        const offset = (Number(page) - 1) * Number(limit);

        const products = await ProductModel.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        if (products.count == 0) {
            throw new GeneralError('No products found', 200);
        }

        return {
            message: 'Products fetched successfully',
            totalItems: products.count,
            totalPages: Math.ceil(products.count / limit),
            currentPage: Number(page),
            products: products.rows
        };
    }

    static async updateProduct(userInput) {
        const { product_id, name, description, category } = userInput;

        // Check if product exists
        const product = await ProductModel.findOne({
            where: { id: product_id },
            attributes: ['id', 'name']
        });

        if (!product) {
            throw new ClientError('Product not found');
        }

        // Check for duplicate entry based on name
        if (name && name !== product.name) {
            const existingProduct = await ProductModel.findOne({
                attributes: ['id'],
                where: { name }
            });

            if (existingProduct) {
                throw new ClientError('Product with this name already exists. Please try again with a different name');
            }
        }

        // Update product details
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (category) updateData.category = category;

        if (Object.keys(updateData).length == 0) {
            throw new ClientError('No data to update');
        }

        await product.update(updateData);

        return {
            message: 'Product updated successfully',
            product: product.toJSON()
        };
    }

    static async getProductDetails(userInput) {
        const { product_id } = userInput;

        // Check if product exists
        const product = await ProductModel.findOne({
            where: { id: product_id },
        });

        if (!product) {
            throw new ClientError('Product not found');
        }

        return {
            message: 'Product details fetched successfully',
            product: product.toJSON()
        };
    }


    static async deleteProduct(userInput) {
        const { product_id } = userInput;

        // Check if customer exists
        const product = await ProductModel.findOne({
            where: { id: product_id },
            attributes: ['id']
        });

        if (!product) {
            throw new ClientError('Product not found');
        }

        await product.destroy();

        return {
            message: 'Product deleted successfully',
        };
    }
}

module.exports = ProductService;