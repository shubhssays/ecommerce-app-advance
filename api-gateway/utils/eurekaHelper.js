
const Axios = require('./axios');
const config = require('config');

async function getServiceUrl(serviceName, pickOne = true) {
    const axios = new Axios(`http://${config.get("eureka.host")}:${config.get("eureka.port")}`);
    const response = await axios.get(`/eureka/apps/${serviceName}`);
    if(pickOne) {
        return `http://${response.application.instance[0].hostName}:${response.application.instance[0].port['$']}`;
    }
    return response;
}

module.exports = getServiceUrl