const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const getServiceUrl = require('./utils/eurekaHelper');
const config = require('config');

const app = express();
const PORT = config.get('port');

async function setupProxy() {
    // Fetch URLs asynchronously
    const productServiceUrl = await getServiceUrl(config.get('appNameProduct'));
    const productDetailsServiceUrl = await getServiceUrl(config.get('appNameProductDetails'));
    const inventoryServiceUrl = await getServiceUrl(config.get('appNameInventory'));
    const cartServiceUrl = await getServiceUrl(config.get('appNameCart'));
    // const checkoutServiceUrl = await getServiceUrl(config.get('appNameCheckout'));
    // const notificationServiceUrl = await getServiceUrl(config.get('appNameNotification'));

    // Proxy for Product Service
    app.use('/product', createProxyMiddleware({
        target: productServiceUrl,
        changeOrigin: true,
        pathRewrite: { '^/product': '' },
    }));

    // Proxy for Product Details Service
    app.use('/product-details', createProxyMiddleware({
        target: productDetailsServiceUrl,
        changeOrigin: true,
        pathRewrite: { '^/product-detail': '' },
    }));

    // Proxy for Inventory Service
    app.use('/inventory', createProxyMiddleware({
        target: inventoryServiceUrl,
        changeOrigin: true,
        pathRewrite: { '^/inventory': '' },
    }));

    // Proxy for Cart Service
    app.use('/cart', createProxyMiddleware({
        target: cartServiceUrl,
        changeOrigin: true,
        pathRewrite: { '^/cart': '' },
    }));

    // // Proxy for Checkout Service
    // app.use('/checkout', createProxyMiddleware({
    //     target: checkoutServiceUrl,
    //     changeOrigin: true,
    //     pathRewrite: { '^/checkout': '' },
    // }));

    // // Proxy for Notification Service
    // app.use('/notification', createProxyMiddleware({
    //     target: notificationServiceUrl,
    //     changeOrigin: true,
    //     pathRewrite: { '^/notification': '' },
    // }));

    // Start the server after proxies are set up
    app.listen(PORT, () => {
        console.log(`API Gateway running on http://localhost:${PORT}`);
    });
}

setupProxy().catch(err => {
    console.error('Failed to set up proxies:', err);
});