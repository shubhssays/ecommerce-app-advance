const ClientError = require("../errors/client.error");
const GeneralError = require("../errors/general.error");
const ServerError = require("../errors/server.error");
const ProductModel = require('../config/models/products.model');
const getServiceUrl = require('../utils/eurekaClient');
const Axios = require('../utils/axios');
const config = require('config');

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

        // finding product details from product details service
        const productDetailsUrl = await getServiceUrl(config.get("appNameProductDetails"));

        let productDetailsResponse;

        try {
            const axios = new Axios(productDetailsUrl);
            productDetailsResponse = await axios.get(`/product/${product_id}`);
        } catch (error) {
            console.log('Error in fetching product details', error);
            throw new ServerError('Error in fetching product details');
        }

        return {
            message: 'Product details fetched successfully',
            product: {
                ...product.toJSON(),
                details: productDetailsResponse?.data?.productDetails || []
            }
        };
    }

    static async deleteProduct(userInput) {
        const { product_id } = userInput;

        const transaction = await ProductModel.sequelize.transaction();

        try {
            // Check if product exists
            const product = await ProductModel.findOne({
                where: { id: product_id },
                attributes: ['id'],
                transaction
            });

            if (!product) {
                throw new ClientError('Product not found');
            }

            // Delete product details from product details service
            const productDetailsUrl = await getServiceUrl(config.get("appNameProductDetails"));
            let deleteProductDetailsResponse;

            try {
                const axios = new Axios(productDetailsUrl);
                deleteProductDetailsResponse = await axios.delete(`/${product_id}?skip_not_found_error=true`);
            } catch (error) {
                console.log('Error in deleting product details', error);
                throw new ServerError('Error in deleting product details');
            }

            if (deleteProductDetailsResponse.status != 'success') {
                throw new ServerError('Error in deleting product details');
            }

            await product.destroy({ transaction });

            await transaction.commit();

            return {
                message: 'Product deleted successfully',
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = ProductService;