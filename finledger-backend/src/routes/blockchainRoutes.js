const express = require('express');
const { protect } = require('../middleware/auth');
const blockchainService = require('../blockchain/blockchainService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blockchain
 *   description: Custom JavaScript Blockchain for immutable transactions
 */

/**
 * @swagger
 * /api/blockchain/chain:
 *   get:
 *     summary: Retrieve the full blockchain
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full blockchain array
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 length:
 *                   type: number
 *                 chain:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: number
 *                       timestamp:
 *                         type: string
 *                       data:
 *                         type: object
 *                       previousHash:
 *                         type: string
 *                       hash:
 *                         type: string
 *       401:
 *         description: Not authorized
 */
router.get('/chain', protect, async (req, res, next) => {
  try {
    const chain = await blockchainService.getChain();
    res.status(200).json({
      success: true,
      length: chain.length,
      chain
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blockchain/verify:
 *   get:
 *     summary: Verify blockchain integrity and tamper detection
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blockchain integrity status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isValid:
 *                   type: boolean
 *       401:
 *         description: Not authorized
 */
const BlockModel = require('../models/Block');

router.get('/verify', protect, async (req, res, next) => {
  try {
    const isValid = await blockchainService.verifyIntegrity();
    res.status(200).json({
      success: true,
      isValid,
      t: Date.now()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blockchain/tamper:
 *   post:
 *     summary: Simulate tampering with the blockchain ledger (Admin/Demo only)
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tampering successful
 *       400:
 *         description: No blocks to tamper
 */
router.post('/tamper', protect, async (req, res, next) => {
  try {
    // Find the latest block (excluding genesis block at index 0)
    const latestBlock = await BlockModel.findOne({ index: { $gt: 0 } }).sort({ index: -1 });
    if (!latestBlock) {
      return res.status(400).json({
        success: false,
        message: 'No transaction blocks found to tamper. Please add some transactions first.'
      });
    }

    // Tamper with the block's data directly in MongoDB (alter amount)
    const originalAmount = latestBlock.data.amount || 100;
    latestBlock.data.amount = originalAmount * 10; // Multiply by 10
    
    // Mark the Mixed type path as modified so Mongoose updates the nested object
    latestBlock.markModified('data');
    await latestBlock.save();

    res.status(200).json({
      success: true,
      message: `Database block at index ${latestBlock.index} has been modified successfully to simulate a DB hack!`,
      details: {
        blockIndex: latestBlock.index,
        originalAmount,
        tamperedAmount: latestBlock.data.amount
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
