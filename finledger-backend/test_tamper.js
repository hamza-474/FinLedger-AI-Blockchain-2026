require('dotenv').config();
const mongoose = require('mongoose');
const blockchainService = require('./src/blockchain/blockchainService');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const isValid = await blockchainService.verifyIntegrity();
  console.log('Is Chain Valid:', isValid);
  process.exit(0);
}
test();
