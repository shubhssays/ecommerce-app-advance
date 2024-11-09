const { z } = require("zod");

const createProductSchema = z.object({
    name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be a string",
        length_error: "name must be between 3 and 255 characters long"
    }).min(3, { message: "name must be at least 3 characters long" })
        .max(255, { message: "name must be at most 255 characters long" }),
    description: z.string({
        required_error: "description is required",
        invalid_type_error: "description must be a string",
        length_error: "description must be between 3 and 1000 characters long"
    }).min(3, { message: "description must be at least 3 characters long" })
        .max(1000, { message: "description must be at most 1000 characters long" }).optional(),
    category: z.string({
        required_error: "category is required",
        invalid_type_error: "category must be a string",
        length_error: "category must be between 3 and 255 characters long"
    }).min(3, { message: "category must be at least 3 characters long" })
        .max(255, { message: "category must be at most 255 characters long" }).optional(),
});

const updateProductSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
    name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be a string",
        length_error: "name must be between 3 and 255 characters long"
    }).min(3, { message: "name must be at least 3 characters long" })
        .max(255, { message: "name must be at most 255 characters long" }),
    description: z.string({
        required_error: "description is required",
        invalid_type_error: "description must be a string",
        length_error: "description must be between 3 and 1000 characters long"
    }).min(3, { message: "description must be at least 3 characters long" })
        .max(1000, { message: "description must be at most 1000 characters long" }).optional(),
    category: z.string({
        required_error: "category is required",
        invalid_type_error: "category must be a string",
        length_error: "category must be between 3 and 255 characters long"
    }).min(3, { message: "category must be at least 3 characters long" })
        .max(255, { message: "category must be at most 255 characters long" }).optional(),
});

const getProductDetailsSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
});

const deleteProductSchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a valid UUID",
    }).uuid(),
});

const getProductsSchema = z.object({
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

module.exports = {
    createProductSchema,
    updateProductSchema,
    getProductDetailsSchema,
    deleteProductSchema,
    getProductsSchema,
}