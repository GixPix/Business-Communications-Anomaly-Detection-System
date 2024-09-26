const express = require('express');
const bodyParser = require('body-parser');
const embeddings = require('./embedding');
const mongodb = require('./mongodb');
const fs = require('fs');
const path = require('path');
var cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

mongodb.connectMongoDB();

app.get('/api/messages', async (req, res) => {
    res.status(200).json({ message: 'Message saved' });
});

app.post('/api/messages', async (req, res) => {
    try {
        const message = req.body.message;
        const vector = await embeddings.generateEmbedding(message);
        const isDangerous = await mongodb.checkAnomaly(vector);
        if (isDangerous) {
            await mongodb.saveMessage(vector, true);
            res.status(200).json({ message: 'Dangerous message detected', risk: true });
        } else {
            res.status(200).json({ message: 'Message saved as normal' });
        }
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/populate', async (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'sample_data.json'));
        const messages = JSON.parse(data);
        
        for (let message of messages) {
            const vector = await embeddings.generateEmbedding(message);
            await mongodb.saveMessage(vector, true);
        }
        res.status(200).json({ message: 'Database populated' });
    } catch (error) {
        console.error('Error populating database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
