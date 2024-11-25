const ClientError = require("../errors/client.error");

const schemaValidators = (schema) => (req, res, next) => {
    try {
        schema.parse({
            ...req.body,
            ...req.params,
            ...req.query,
        });
        next();
    } catch (error) {
        const err = new ClientError(error?.errors?.map((error) => error.message).join(", ") || error.message);
        throw err;
    }
};

module.exports = schemaValidators;