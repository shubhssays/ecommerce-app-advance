class ServerError extends Error {
    constructor(msg, data) {
        super(msg || "Internal Server Error");
        this.statusCode = 500;
        this.name = "ServerError";
        this.data = data || null;
    }
}

module.exports = ServerError;