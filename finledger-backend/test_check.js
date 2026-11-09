require('dotenv').config();
const mongoose = require('mongoose');
const BlockModel = require('./src/models/Block');
const blockchainService = require('./src/blockchain/blockchainService');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Verify before tamper
  console.log('Before tamper isValid:', await blockchainService.verifyIntegrity());
  
  // Find latest block
  const latestBlock = await BlockModel.findOne({ index: { $gt: 0 } }).sort({ index: -1 });
  if (!latestBlock) {
    console.log('No blocks');
    process.exit(0);
  }
  console.log('Original data:', JSON.stringify(latestBlock.data));
  console.log('Original hash:', latestBlock.hash);

  // Tamper
  const originalAmount = latestBlock.data.amount || 100;
  latestBlock.data.amount = originalAmount * 10;
  latestBlock.markModified('data');
  await latestBlock.save();

  // Load from DB directly to verify the DB was updated
  const updatedBlock = await BlockModel.findOne({ _id: latestBlock._id });
  console.log('Updated data from DB:', JSON.stringify(updatedBlock.data));
  console.log('Updated hash from DB (should be same as original):', updatedBlock.hash);

  // Verify after tamper
  const isValidAfter = await blockchainService.verifyIntegrity();
  console.log('After tamper isValid:', isValidAfter);

  process.exit(0);
}
test();
