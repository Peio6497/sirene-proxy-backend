const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
    try {
        const { q, limit = 50 } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Paramètre q manquant' });
        }

        const apiUrl = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&limit=${limit}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur proxy:', error);
        res.status(500).json({ error: 'Erreur lors de la requête' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Proxy SIRENE listening on port ${port}`);
});