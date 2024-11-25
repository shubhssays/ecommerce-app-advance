const { z } = require("zod");

const addToCartSchema = z.object({
    user_id: z.string({
        required_error: "user_id is required",
        invalid_type_error: "user_id must be a valid UUID",
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


const updateQuantityInCartSchema = z.object({
    cart_id: z.string({
        required_error: "cart_id is required",
        invalid_type_error: "cart_id must be a valid UUID",
    }).uuid(),
    quantity: z.number({
        required_error: "quantity is required",
        invalid_type_error: "quantity must be a number",
        positive_error: "quantity must be a positive number",
    }).int().positive(),
});

const getCartSchema = z.object({
    user_id: z.string({
        required_error: "user_id is required",
        invalid_type_error: "user_id must be a valid UUID",
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
    }).optional(),
    skip_limit: z.string()
        .transform((value) => value === 'true')
        .refine((val) => typeof val === 'boolean', {
            message: 'Invalid boolean value',
        }).optional(),
    skip_not_found_error: z.string()
        .transform((value) => value === 'true')
        .refine((val) => typeof val === 'boolean', {
            message: 'Invalid boolean value',
        }).optional(),
});

const removeItemFromCartSchema = z.object({
    cart_ids: z.string({
        required_error: "cart_ids is required",
        invalid_type_error: "cart_ids must be a comma-separated string of valid UUIDs",
    }).transform((val) => val.split(',').map((v) => v.trim())).refine((val) => val.every((id) => z.string().uuid().safeParse(id).success), {
        message: "cart_ids must be a comma-separated string of valid UUIDs",
    }),
    user_id: z.string({
        required_error: "user_id is required",
        invalid_type_error: "user_id must be a valid UUID",
    }).uuid(),
});

module.exports = {
    addToCartSchema,
    updateQuantityInCartSchema,
    getCartSchema,
    removeItemFromCartSchema
}