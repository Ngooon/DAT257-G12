const { env } = require('process');

const target = 'http://localhost:8000';

const PROXY_CONFIG = [
    {
        context: [
            "/api"
        ],
        target,
        secure: false
    }
]

module.exports = PROXY_CONFIG;
