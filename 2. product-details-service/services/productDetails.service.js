const ClientError = require("../errors/client.error");
const GeneralError = require("../errors/general.error");
const ProductDetailsModel = require("../config/models/productDetails.model");
const getServiceUrl = require('../utils/eurekaClient');
const Axios = require('../utils/axios');

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

        // Check if product exists
        await ProductDetailsService.checkIfProductExists({ productId: product_id, skip_not_found_error: false, only_product: true });

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

        // Check if product exists
        await ProductDetailsService.checkIfProductExists({ productId: product_id, skip_not_found_error: false, only_product: true });

        const offset = (Number(page) - 1) * Number(limit);

        // Get all product details by product ID
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
        const { product_id, skip_not_found_error = false } = userInput;

        // Check if product exists
        await ProductDetailsService.checkIfProductExists({ productId: product_id, skip_not_found_error: false, only_product: true });

        // Check if product detail exists
        const productDetails = await ProductDetailsModel.findAll({
            where: { productId: product_id }
        });

        if (!skip_not_found_error && productDetails.length === 0) {
            throw new ClientError('Product details not found');
        }

        await ProductDetailsModel.destroy({
            where: { productId: product_id }
        });

        return {
            message: 'All product details deleted successfully',
        };
    }

    static async findProductDetailsByProductId(userInput) {
        const { id } = userInput;

        // Get product details by product ID
        let productDetails = await ProductDetailsModel.findOne({
            where: { id: id },
            order: [['createdAt', 'DESC']]
        });

        return {
            message: 'Product details fetched successfully',
            productDetails: productDetails?.toJSON() || {}
        };
    }

    static async checkIfProductExists({ productId, skip_not_found_error = true, only_product = true }) {
        // Fetch product details
        const productServiceUrl = await getServiceUrl(config.get("appNameProduct"));
        console.log('productServiceUrl', productServiceUrl);
        let productResponse;

        const productDetailError = new ServerError('Error in fetching product details');

        try {
            const axios = new Axios(productServiceUrl);
            productResponse = await axios.get(`/product/${product_detail_id}?skip_not_found_error=${skip_not_found_error}&only_product=${only_product}`);
        } catch (error) {
            console.log('Error in fetching product details', error);
            throw productDetailError;
        }

        if (productResponse.status != 'success') {
            throw productDetailError;
        }

        return productResponse?.product || {};
    }
}

module.exports = ProductDetailsService;