require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const crypto = require('crypto'); // Built-in Node.js module for hashing

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Check Database Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message);
    } else {
        console.log('Connected to MySQL database.');
        connection.release();
    }
});

// Helper function to create SHA-256 hash
const generateHash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

// API Routes

// 1. Get all departments
app.get('/api/departments', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM departments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Add a new department
app.post('/api/departments', async (req, res) => {
    const { name, budget_limit } = req.body;
    try {
        const [result] = await promisePool.query(
            'INSERT INTO departments (name, budget_limit) VALUES (?, ?)',
            [name, budget_limit]
        );
        res.status(201).json({ id: result.insertId, name, budget_limit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT e.id, e.amount, e.description, e.date, e.status, d.name AS department_name
            FROM expenses e
            JOIN departments d ON e.dept_id = d.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Add a new expense and record it in the blockchain ledger
app.post('/api/expenses', async (req, res) => {
    const { dept_id, amount, description, date } = req.body;
    
    // We'll use a transaction since we are inserting into multiple tables
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert into expenses table
        const [expenseResult] = await connection.query(
            'INSERT INTO expenses (dept_id, amount, description, date) VALUES (?, ?, ?, ?)',
            [dept_id, amount, description, date || new Date()]
        );
        const expenseId = expenseResult.insertId;

        // Get previous block hash from ledger
        const [ledgerRows] = await connection.query(
            'SELECT current_hash FROM blockchain_ledger ORDER BY id DESC LIMIT 1'
        );
        
        let previousHash = '0'; // Default genesis hash
        if (ledgerRows.length > 0) {
            previousHash = ledgerRows[0].current_hash;
        }

        // Generate current hash
        const hashData = \`\${expenseId}-\${previousHash}-\${amount}-\${dept_id}-\${new Date().toISOString()}\`;
        const currentHash = generateHash(hashData);

        // Insert into blockchain_ledger
        await connection.query(
            'INSERT INTO blockchain_ledger (expense_id, previous_hash, current_hash) VALUES (?, ?, ?)',
            [expenseId, previousHash, currentHash]
        );

        await connection.commit();
        res.status(201).json({
            message: 'Expense added and secured in ledger.',
            expenseId,
            ledger: { previousHash, currentHash }
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// 5. Get the blockchain ledger
app.get('/api/ledger', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM blockchain_ledger');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
