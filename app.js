require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


const dbConfig = new URL(process.env.DATABASE_URL);
// Create a connection pool
const db = mysql.createPool({
    host: dbConfig.hostname,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.pathname.slice(1),
    port: dbConfig.port,
});

module.exports = db;
const app = express();
app.use(bodyParser.json());

// Routes
const addSchoolRoute = require('./routes/addSchool');
const listSchoolsRoute = require('./routes/listSchools');

app.use('/addSchool', addSchoolRoute(db));
app.use('/listSchools', listSchoolsRoute(db));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
