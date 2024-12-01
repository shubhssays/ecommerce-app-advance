// middleware/logging.js
const { v4: uuidv4 } = require('uuid');

const createLoggingMiddleware = (logger) => {
    return (req, res, next) => {
        // Add request ID if not exists
        req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
        res.setHeader('x-request-id', req.headers['x-request-id']);

        const start = Date.now();

        // Log request
        logger.info('Incoming request', {
            ...logger.addRequestContext(req),
            body: req.body // Be careful with sensitive data
        });

        // Log response
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info('Request completed', {
                ...logger.addRequestContext(req),
                statusCode: res.statusCode,
                duration,
                responseTime: `${duration}ms`
            });
        });

        next();
    };
};

module.exports = createLoggingMiddleware;