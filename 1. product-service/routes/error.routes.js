const RequestHandler = require("../handlers/request.handler");
const ClientError = require("../errors/client.error");
const ServerError = require("../errors/server.error");
const SequelizeDatabaseError = require('sequelize').DatabaseError;
const config = require("config");
const ServiceLogger = require("../utils/logger");
const logger = new ServiceLogger(config.get("appName"));

function errorRoutes(app) {
    app.use((error, request, response, next) => {
        console.error(error);

        logger.error('Unhandled error', {
            ...logger.addRequestContext(req),
            error: {
                message: error.message,
                stack: error.stack
            }
        });

        if (error instanceof ClientError) {
            return RequestHandler.validationHandler({
                request,
                response,
                data: error.data,
                error: error,
                code: error?.statusCode
            });
        } if (error instanceof ServerError || error instanceof SequelizeDatabaseError) {
            return RequestHandler.validationHandler({
                request,
                response,
                data: {},
                error: { message: 'Internal server error' },
                code: 500
            });
        } else {
            return RequestHandler.errorHandler({
                request,
                response,
                data: error.data,
                error: error,
                code: error?.statusCode
            });
        }
    });
}

module.exports = errorRoutes;