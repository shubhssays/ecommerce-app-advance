// logger.js
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { v4: uuidv4 } = require('uuid');
const config = require('config');

class ServiceLogger {
    constructor(serviceName) {
        if (!serviceName) {
            throw new Error('Service name is required for logging setup');
        }

        this.serviceName = serviceName;

        // Define log format
        const logFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.metadata({
                fillExcept: ['timestamp', 'level', 'message'],
                fillWith: { service: serviceName }
            })
        );

        // Elasticsearch options
        const esTransportOpts = {
            level: 'info',
            clientOpts: {
                node: config.get("elasticSearch.url") || 'http://localhost:9200',
                maxRetries: 5,
                requestTimeout: 10000,
                sniffOnStart: false
            },
            indexPrefix: serviceName.toLowerCase(),
            indexSuffixPattern: 'YYYY.MM.DD',
            source: serviceName,
            ensureMappingTemplate: true,
            flushInterval: 2000
        };

        this.logger = winston.createLogger({
            level: config.get("logger.level") || 'info',
            format: logFormat,
            defaultMeta: { service: serviceName },
            transports: [
                // Console transport for development
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                        winston.format.printf(({ level, message, timestamp, ...meta }) => {
                            return `${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
                        })
                    )
                }),
                // Elasticsearch transport
                new ElasticsearchTransport(esTransportOpts)
            ]
        });

        // Handle errors
        this.logger.on('error', (error) => {
            console.error('Error in logger: ', error);
        });
    }

    addRequestContext(req) {
        const requestId = req.headers['x-request-id'] || uuidv4();

        return {
            service: this.serviceName,
            requestId,
            method: req.method,
            url: req.url,
            path: req.path,
            query: req.query,
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            timestamp: new Date().toISOString()
        };
    }

    info(message, meta = {}) {
        this.logger.info(message, { ...meta, service: this.serviceName });
    }

    error(message, meta = {}) {
        this.logger.error(message, { ...meta, service: this.serviceName });
    }

    warn(message, meta = {}) {
        this.logger.warn(message, { ...meta, service: this.serviceName });
    }

    debug(message, meta = {}) {
        this.logger.debug(message, { ...meta, service: this.serviceName });
    }
}

module.exports = ServiceLogger;