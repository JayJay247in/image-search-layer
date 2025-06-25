// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../server'); // Adjust path if your server.js is elsewhere

module.exports.handler = serverless(app);