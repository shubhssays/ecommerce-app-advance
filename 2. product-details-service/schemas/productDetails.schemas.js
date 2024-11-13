const { z } = require("zod");

const createProductDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
    details: z.array(
        z.object({
            size: z.number({
                required_error: "size is required",
                invalid_type_error: "size must be a number",
                positive_error: "size must be a positive number",
            }).int().positive().optional(),
            price: z.number({
                required_error: "price is required",
                invalid_type_error: "price must be a number",
                positive_error: "price must be a positive number",
            }).positive(),
            design: z.string({
                required_error: "design is required",
                invalid_type_error: "design must be a string",
                length_error: "design must be between 3 and 255 characters long"
            }).min(3, { message: "design must be at least 3 characters long" })
                .max(255, { message: "design must be at most 255 characters long" }).optional(),
        })
    ),
});

const updateProductDetailsSchema = z.object({
    detail_id: z.string({
        required_error: "detail_id is required",
        invalid_type_error: "detail_id must be a valid UUID",
    }).uuid(),
    size: z.number({
        required_error: "size is required",
        invalid_type_error: "size must be a number",
        positive_error: "size must be a positive number",
    }).int().positive().optional(),
    price: z.number({
        required_error: "price is required",
        invalid_type_error: "price must be a number",
        positive_error: "price must be a positive number",
    }).positive(),
    design: z.string({
        required_error: "design is required",
        invalid_type_error: "design must be a string",
        length_error: "design must be between 3 and 255 characters long"
    }).min(3, { message: "design must be at least 3 characters long" })
        .max(255, { message: "design must be at most 255 characters long" }).optional(),
});

const getProductDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
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

const deleteProductDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
});

module.exports = {
    createProductDetailsSchema,
    updateProductDetailsSchema,
    getProductDetailsSchema,
    deleteProductDetailsSchema,
}