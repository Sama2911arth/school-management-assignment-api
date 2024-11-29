module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    router.post('/', async (req, res) => {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
            await db.execute(query, [name, address, parseFloat(latitude), parseFloat(longitude)]);
            res.status(201).json({ message: 'School added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};
