const Blockchain = require('./Blockchain');
const BlockModel = require('../models/Block');
const Block = require('./Block');

class BlockchainService {
  constructor() {
    this.blockchain = new Blockchain();
    this.isLoaded = false;
  }

  async loadChainFromDB() {
    try {
      const blocks = await BlockModel.find().sort({ index: 1 });
      
      if (blocks.length === 0) {
        // Save genesis block to DB if empty
        const genesisBlock = this.blockchain.chain[0];
        await this.saveBlockToDB(genesisBlock);
      } else {
        // Reconstruct chain from DB
        this.blockchain.chain = blocks.map(b => {
          const block = new Block(b.index, b.timestamp, b.data, b.previousHash);
          block.hash = b.hash; // Preserve the original hash from DB
          return block;
        });
      }
      this.isLoaded = true;
      console.log(`Blockchain loaded with ${this.blockchain.chain.length} blocks.`);
    } catch (error) {
      console.error('Error loading blockchain from DB:', error);
    }
  }

  async saveBlockToDB(block) {
    try {
      await BlockModel.create({
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash
      });
    } catch (error) {
      console.error('Error saving block to DB:', error);
      throw error;
    }
  }

  async addTransaction(transactionData) {
    if (!this.isLoaded) {
      await this.loadChainFromDB();
    }
    const newBlock = this.blockchain.addBlock(transactionData);
    await this.saveBlockToDB(newBlock);
    return newBlock;
  }

  async verifyIntegrity() {
    await this.loadChainFromDB();
    return this.blockchain.isChainValid();
  }

  async getChain() {
    if (!this.isLoaded) {
      await this.loadChainFromDB();
    }
    return this.blockchain.getChain();
  }
}

// Export a single instance (singleton pattern)
const blockchainService = new BlockchainService();
module.exports = blockchainService;
