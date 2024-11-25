const { Eureka } = require('eureka-js-client');
const Axios = require('./axios');
const config = require('config');

const instanceId = config.get('appName');
const vipAddress = `${instanceId}-vip`;

// Configure the Eureka eurekaClient instance
const eurekaClient = new Eureka({
    instance: {
        app: instanceId, // Name of your service
        instanceId, // Unique ID for the instance
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${config.get("port")}/health`, // URL for the health/status page
        port: {
            '$': config.get("port"), // Port your service is running on
            '@enabled': true,
        },
        vipAddress, // Virtual IP address used for discovery
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn', // Name of your data center, use "MyOwn" if self-hosted
        },
    },
    eureka: {
        // Eureka server configuration
        host: config.get("eureka.host"), // Host where Eureka server is running
        port: config.get("eureka.port"), // Port where Eureka server is running
        servicePath: '/eureka/apps/', // Default service path
    },
});

// Start the Eureka eurekaClient to register the app with Eureka
eurekaClient.start((error) => {
    console.log('Node.js Eureka eurekaClient started');
    if (error) {
        console.error('Error starting Eureka eurekaClient:', error);
    }
});

async function getServiceUrl(serviceName, pickOne = true) {
    const axios = new Axios(`http://${config.get("eureka.host")}:${config.get("eureka.port")}`);
    const response = await axios.get(`/eureka/apps/${serviceName}`);
    if(pickOne) {
        return `http://${response.application.instance[0].hostName}:${response.application.instance[0].port['$']}`;
    }
    return response;
}

module.exports = getServiceUrl;