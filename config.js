//config.js
const { readFileSync } = require('fs');

module.exports = {
  prefix: ".", // your bot prefix
  token: process.env.token || readFileSync('token.txt', 'utf-8'),
  clientId: process.env.CLIENT_I|| readFileSync('CLIENT_ID.txt', 'utf-8'), // add CLIENT_ID in .env / for replit user add CLIENT_ID in Secrets
  ownerId: "", // add owner ID (optional) 
  mongoURL: process.env.mongoURL, // add your mongoURL in .env / for replit users add your mongoURL in Secrets
};