class GeneralError extends Error {
    constructor(msg, statusCode = 404, data) {
        super(msg || 'error');
        this.statusCode = statusCode;
        this.name = "GeneralError";
        this.data = data || null;
    }
}

module.exports = GeneralError