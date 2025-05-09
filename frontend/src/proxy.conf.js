const { env } = require('process');

//const target = 'http://localhost:8000';
const target = 'http://127.0.0.1:8000';

const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/auth",
        ],
        target,
        secure: false
    }
]

module.exports = PROXY_CONFIG;
