// include required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const port = 3000;

// database config
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => console.log(`Server started on port ${port}`));

/* R = Read all rows */
app.get('/kpopidols', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM defaultdb.KPOPIdols'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Read error' });
    }
});

/* C = Create row */
app.post('/addkpopidols', async (req, res) => {
    const { idol_name, idol_pic } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO defaultdb.KPOPIdols (idol_name, idol_pic) VALUES (?, ?)',
            [idol_name, idol_pic]
        );
        res.status(201).json({ message: 'Created' });
    } catch (err) {
        res.status(500).json({ message: 'Create error' });
    }
});

/* U = Update row */
app.put('/updatekpopidols/:id', async (req, res) => {
    const { id } = req.params;
    const { idol_name, idol_pic } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE defaultdb.KPOPIdols SET idol_name = ?, idol_pic = ? WHERE id = ?',
            [idol_name, idol_pic, id]
        );
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ message: 'Update error' });
    }
});

/* D = Delete row */
app.delete('/deletekpopidols/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM defaultdb.KPOPIdols WHERE id = ?',
            [id]
        );
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete error' });
    }
});
