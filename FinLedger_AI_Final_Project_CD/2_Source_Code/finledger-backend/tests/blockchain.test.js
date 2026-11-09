const Block = require('../src/blockchain/Block');
const Blockchain = require('../src/blockchain/Blockchain');

describe('Custom JS Blockchain Unit Tests', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test('should create genesis block automatically', () => {
    const chain = blockchain.getChain();
    expect(chain.length).toBe(1);
    expect(chain[0].index).toBe(0);
    expect(chain[0].previousHash).toBe('0');
    expect(chain[0].data.message).toBe('Genesis Block');
  });

  test('should add blocks and calculate correct linkage hashes', () => {
    const data = { title: 'Office Supplies', amount: 500, type: 'expense' };
    const newBlock = blockchain.addBlock(data);

    expect(blockchain.getChain().length).toBe(2);
    expect(newBlock.index).toBe(1);
    expect(newBlock.data).toEqual(data);
    expect(newBlock.previousHash).toBe(blockchain.chain[0].hash);
    expect(newBlock.hash).toBe(newBlock.calculateHash());
  });

  test('should verify chain validation on healthy data', () => {
    blockchain.addBlock({ title: 'Rent Payment', amount: 5000, type: 'expense' });
    blockchain.addBlock({ title: 'Invoice Payment', amount: 12000, type: 'income' });

    expect(blockchain.isChainValid()).toBe(true);
  });

  test('should detect tampering if block data is modified', () => {
    blockchain.addBlock({ title: 'Rent Payment', amount: 5000, type: 'expense' });
    blockchain.addBlock({ title: 'Invoice Payment', amount: 12000, type: 'income' });

    expect(blockchain.isChainValid()).toBe(true);

    // Tamper with the amount in block 1
    blockchain.chain[1].data.amount = 99999;

    expect(blockchain.isChainValid()).toBe(false);
  });

  test('should detect tampering if hash linkage is broken', () => {
    blockchain.addBlock({ title: 'Rent Payment', amount: 5000, type: 'expense' });
    blockchain.addBlock({ title: 'Invoice Payment', amount: 12000, type: 'income' });

    expect(blockchain.isChainValid()).toBe(true);

    // Tamper with the previous hash linkage in block 2
    blockchain.chain[2].previousHash = 'fake-corrupted-hash';

    expect(blockchain.isChainValid()).toBe(false);
  });
});
