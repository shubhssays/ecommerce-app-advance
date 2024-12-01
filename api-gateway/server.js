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
    const checkoutServiceUrl = await getServiceUrl(config.get('appNameCheckout'));
    const notificationServiceUrl = await getServiceUrl(config.get('appNameNotification'));

    console.log('Product Service URL:', productServiceUrl);
    console.log('Product Details Service URL:', productDetailsServiceUrl);
    console.log('Inventory Service URL:', inventoryServiceUrl);
    console.log('Cart Service URL:', cartServiceUrl);
    console.log('Checkout Service URL:', checkoutServiceUrl);
    console.log('Notification Service URL:', notificationServiceUrl);

    // Proxy for Product Service
    app.use('/product', createProxyMiddleware({
        target: productServiceUrl.replace("localhost", config.get("appNameProduct")),
        changeOrigin: true,
        pathRewrite: { '^/product': '' },
    }));

    // Proxy for Product Details Service
    app.use('/product-details', createProxyMiddleware({
        target: productDetailsServiceUrl.replace("localhost", config.get("appNameProductDetails")),
        changeOrigin: true,
        pathRewrite: { '^/product-detail': '' },
    }));

    // Proxy for Inventory Service
    app.use('/inventory', createProxyMiddleware({
        target: inventoryServiceUrl.replace("localhost", config.get("appNameInventory")),
        changeOrigin: true,
        pathRewrite: { '^/inventory': '' },
    }));

    // Proxy for Cart Service
    app.use('/cart', createProxyMiddleware({
        target: cartServiceUrl.replace("localhost", config.get("appNameCart")),
        changeOrigin: true,
        pathRewrite: { '^/cart': '' },
    }));

    // Proxy for Checkout Service
    app.use('/checkout', createProxyMiddleware({
        target: checkoutServiceUrl.replace("localhost", config.get("appNameCheckout")),
        changeOrigin: true,
        pathRewrite: { '^/checkout': '' },
    }));

    // Proxy for Notification Service
    app.use('/notification', createProxyMiddleware({
        target: notificationServiceUrl.replace("localhost", config.get("appNameNotification")),
        changeOrigin: true,
        pathRewrite: { '^/notification': '' },
    }));

    app.get('/', (req, res) => {
        res.send('API Gateway is running');
    });

    // Start the server after proxies are set up
    app.listen(PORT, () => {
        console.log(`API Gateway running on http://localhost:${PORT}`);
    });
}

setupProxy().catch(err => {
    console.error('Failed to set up proxies:', err);
});