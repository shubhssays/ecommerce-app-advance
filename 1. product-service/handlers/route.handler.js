const routeHandler = (fn) => async (request, response, next) => {
    request.userInput = { ...request.body, ...request.params, ...request.query, ...request.headers }
    Promise.resolve(fn(request, response, next)).catch(next);
};

module.exports = routeHandler;