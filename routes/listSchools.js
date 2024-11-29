const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    router.get('/', async (req, res) => {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        try {
            const [rows] = await db.query('SELECT * FROM schools');
            const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

            const schoolsWithDistance = rows.map((school) => ({
                ...school,
                distance: haversineDistance(userLocation, { latitude: school.latitude, longitude: school.longitude }),
            }));

            schoolsWithDistance.sort((a, b) => a.distance - b.distance);

            res.status(200).json(schoolsWithDistance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};
