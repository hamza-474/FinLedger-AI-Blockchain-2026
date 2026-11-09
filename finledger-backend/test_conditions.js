require('dotenv').config();
const mongoose = require('mongoose');
const BlockModel = require('./src/models/Block');
const blockchainService = require('./src/blockchain/blockchainService');

async function fixAndTest() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // 1. Fix the tampered block
  const blocks = await BlockModel.find().sort({ index: 1 });
  let fixed = false;
  
  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    // Check if the current hash doesn't match the recalculated hash (meaning it's tampered)
    const recalculatedHash = require('crypto')
      .createHash('sha256')
      .update(currentBlock.index + currentBlock.previousHash + currentBlock.timestamp + JSON.stringify(currentBlock.data))
      .digest('hex');
      
    if (currentBlock.hash !== recalculatedHash) {
      console.log(`Block ${currentBlock.index} is tampered. Fixing it...`);
      // Revert the amount (divide by 10) since the tamper multiplies by 10
      currentBlock.data.amount = currentBlock.data.amount / 10;
      currentBlock.markModified('data');
      await currentBlock.save();
      fixed = true;
    }
  }
  
  if (!fixed) {
    console.log('No tampered blocks found.');
  }

  // Reload and check
  const isValid = await blockchainService.verifyIntegrity();
  console.log('--- CONDITION 1: TAMPERING NOT DETECTED (VALID STATE) ---');
  console.log('Integrity Check Result:', isValid ? 'VALID (True)' : 'INVALID (False)');
  
  // 2. Tamper it again to show Condition 2
  const latestBlock = await BlockModel.findOne({ index: { $gt: 0 } }).sort({ index: -1 });
  if (latestBlock) {
    latestBlock.data.amount = latestBlock.data.amount * 10;
    latestBlock.markModified('data');
    await latestBlock.save();
    
    const isTamperedValid = await blockchainService.verifyIntegrity();
    console.log('--- CONDITION 2: TAMPERING DETECTED (HACKED STATE) ---');
    console.log('Integrity Check Result:', isTamperedValid ? 'VALID (True)' : 'INVALID (False)');
    
    // Fix it one more time so the user's DB is clean when we finish
    latestBlock.data.amount = latestBlock.data.amount / 10;
    latestBlock.markModified('data');
    await latestBlock.save();
  }

  process.exit(0);
}
fixAndTest();
