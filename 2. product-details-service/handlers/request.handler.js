

const statusCodeMapper = {
    'GET': 200,
    'POST': 201,
    'PUT': 202,
    'DELETE': 202
}

class RequestHandler {
    static successHandler(request, response, data) {
        let successCode = statusCodeMapper[request.method] || 200;
        let message = data?.message || undefined;
        delete data?.message;
        const responseData = { status: 'success', message, data, };
        return response.status(successCode).send(responseData);
    }

    static errorHandler({ request, response, data = null, error, code }) {
        const responseData = { status: 'failed', message: error.message, data, };
        return response.status(code).send(responseData);
    }

    static validationHandler({ request, response, data = null, error, code }) {
        const responseData = { status: 'failed', message: error?.message || error.toString(), data, };
        return response.status(code || 400).send(responseData);
    }
}

module.exports = RequestHandler;