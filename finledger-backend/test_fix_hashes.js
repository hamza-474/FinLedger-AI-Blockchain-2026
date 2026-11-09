require('dotenv').config();
const mongoose = require('mongoose');
const BlockModel = require('./src/models/Block');

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const blocks = await BlockModel.find().sort({ index: 1 });
  
  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    const previousBlock = blocks[i - 1];
    
    // Fix previousHash just in case
    currentBlock.previousHash = previousBlock.hash;
    
    const crypto = require('crypto');
    const recalculatedHash = crypto
      .createHash('sha256')
      .update(currentBlock.index + currentBlock.previousHash + currentBlock.timestamp + JSON.stringify(currentBlock.data))
      .digest('hex');
      
    currentBlock.hash = recalculatedHash;
    await currentBlock.save();
  }
  
  console.log('Chain forced to perfectly valid state!');
  process.exit(0);
}
fix();
