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
        throw new ClientError(error.errors.map((error) => error.message).join(", "));
    }
};

module.exports = schemaValidators;