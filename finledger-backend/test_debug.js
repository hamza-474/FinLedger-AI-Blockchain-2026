require('dotenv').config();
const mongoose = require('mongoose');
const BlockModel = require('./src/models/Block');
const blockchainService = require('./src/blockchain/blockchainService');

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI);
  await blockchainService.loadChainFromDB();
  
  const chain = blockchainService.blockchain.chain;
  let invalidFound = false;
  
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    if (currentBlock.hash !== currentBlock.calculateHash()) {
      console.log(`Block ${i} HASH MISMATCH!`);
      console.log('Expected:', currentBlock.hash);
      console.log('Calculated:', currentBlock.calculateHash());
      console.log('Data:', JSON.stringify(currentBlock.data));
      invalidFound = true;
    }

    if (currentBlock.previousHash !== previousBlock.hash) {
      console.log(`Block ${i} PREV HASH MISMATCH!`);
      invalidFound = true;
    }
  }
  
  if (!invalidFound) console.log('CHAIN IS PERFECTLY VALID!');
  process.exit(0);
}
debug();
