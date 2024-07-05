const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/auth/',
        createProxyMiddleware({
            target: 'http://localhost:5000',  // Your Express server's port
            changeOrigin: true,
            pathRewrite: {
                '^/': '/'  // Replace '/auth' with the actual route on your backend
            }
        })
    );
};
