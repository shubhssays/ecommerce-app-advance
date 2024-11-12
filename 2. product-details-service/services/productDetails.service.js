const ClientError = require("../errors/client.error");
const GeneralError = require("../errors/general.error");
const ProductDetailsModel = require("../config/models/productDetails.model");

class ProductDetailsService {
    static async addProductDetails(userInput) {
        const { product_id, details } = userInput;

        // details = [{size, price, design}]

        // const existingDetails = await ProductDetailsModel.findOne({
        //     where: { product_id }
        // });

        // if (existingDetails) {
        //     throw new ClientError('Product details for this product already exist');
        // }

        const newProductArr = details.map(detail => {
            return {
                productId: product_id,
                size: detail.size,
                price: detail.price,
                design: detail.design
            }
        });

        // Create new product details entry
        const newProductDetails = await ProductDetailsModel.bulkCreate(newProductArr);

        return {
            message: 'Product details added successfully',
            productDetails: newProductDetails
        };
    }

    static async updateProductDetails(userInput) {
        const { detail_id, size, price, design } = userInput;

        // Check if product details exist
        const productDetail = await ProductDetailsModel.findOne({
            where: { id: detail_id }
        });

        if (!productDetail) {
            throw new ClientError('Product detail not found');
        }

        // Update product detail
        const updateData = {};
        if (size) updateData.size = size;
        if (price) updateData.price = price;
        if (design) updateData.design = design;

        if (Object.keys(updateData).length == 0) {
            throw new ClientError('No data to update');
        }

        await productDetail.update(updateData);

        return {
            message: 'Product detail updated successfully',
            productDetail: productDetail.toJSON()
        };
    }

    static async getAllProductDetails(userInput) {
        const { product_id, page = 1, limit = 10 } = userInput;
        const offset = (Number(page) - 1) * Number(limit);

        // Get all product details with pagination
        const { count, rows: productDetails } = await ProductDetailsModel.findAndCountAll({
            where: { productId: product_id },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        if (count === 0) {
            throw new GeneralError('No product details found', 200);
        }

        return {
            message: 'Product details fetched successfully',
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            productDetails: productDetails.map(detail => detail.toJSON())
        };
    }

    static async deleteProductDetails(userInput) {
        const { product_id } = userInput;

        // Check if product detail exists
        const productDetails = await ProductDetailsModel.findAll({
            where: { productId: product_id }
        });

        if (productDetails.length === 0) {
            throw new ClientError('Product details not found');
        }

        await ProductDetailsModel.destroy({
            where: { productId: product_id }
        });

        return {
            message: 'All product details deleted successfully',
        };
    }
}

module.exports = ProductDetailsService;