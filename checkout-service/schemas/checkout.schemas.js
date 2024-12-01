const { z } = require("zod");

const checkoutSchema = z.object({
    user_id: z.string({
        required_error: "user_id is required",
        invalid_type_error: "user_id must be a valid UUID",
    }).uuid(),
    cart_ids: z.array(z.string({
        required_error: "cart_ids is required",
        invalid_type_error: "cart_ids must be an array of valid UUIDs",
    }).uuid()).transform((val) => val.map((v) => {
        return v
    })).optional(),
});

module.exports = {
    checkoutSchema
}