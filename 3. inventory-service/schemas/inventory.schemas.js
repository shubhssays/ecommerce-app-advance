const { z } = require("zod");

const addProductToInventorySchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
    product_detail_id: z.string({
        required_error: "product_detail_id is required",
        invalid_type_error: "product_detail_id must be a valid UUID",
    }).uuid(),
    quantity: z.number({
                required_error: "quantity is required",
                invalid_type_error: "quantity must be a number",
                positive_error: "quantity must be a positive number",
            }).int().positive(),
});

const updateProductToInventorySchema = z.object({
    inventory_id: z.string({
        required_error: "inventory_id is required",
        invalid_type_error: "inventory_id must be a valid UUID",
    }).uuid(),
    quantity: z.number({
                required_error: "quantity is required",
                invalid_type_error: "quantity must be a number",
                positive_error: "quantity must be a positive number",
            }).int().positive(),
});

const getProductInventoryDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
    product_detail_id: z.string({
        required_error: "product_detail_id is required",
        invalid_type_error: "product_detail_id must be a valid UUID",
    }).uuid().optional(),
    page: z.string({
        required_error: "page is required",
        invalid_type_error: "page must be a positive number with a minimum value of 1",
    }).transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1) {
            throw new Error("page must be a positive number with a minimum value of 1");
        }
        return parsed;
    }).optional(),
    limit: z.string({
        required_error: "limit is required",
        invalid_type_error: "limit must be a positive number between 1 and 20",
    }).transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 20) {
            throw new Error("limit must be a positive number between 1 and 20");
        }
        return parsed;
    }).optional()
});

const deleteProductInventoryDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
    product_detail_id: z.string({
        required_error: "product_detail_id is required",
        invalid_type_error: "product_detail_id must be a valid UUID",
    }).uuid().optional(),
});

const findProductInInventoryDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
    product_detail_id: z.string({
        required_error: "product_detail_id is required",
        invalid_type_error: "product_detail_id must be a valid UUID",
    }).uuid().optional(),
});

module.exports = {
    addProductToInventorySchema,
    updateProductToInventorySchema,
    getProductInventoryDetailsSchema,
    deleteProductInventoryDetailsSchema,
    findProductInInventoryDetailsSchema
}