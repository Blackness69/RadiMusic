//config.js
module.exports = {
  prefix: ".", // your bot prefix
  token: process.env.token,
  clientId: process.env.CLIENT_ID, // add CLIENT_ID in .env / for replit user add CLIENT_ID in Secrets
  ownerId: "", // add owner ID (optional) 
  mongoURL: process.env.mongoURL, // add your mongoURL in .env / for replit users add your mongoURL in Secrets
};