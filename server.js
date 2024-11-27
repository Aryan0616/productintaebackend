const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;  // Using environment variable for port

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,   // Using environment variable for DB host
    user: process.env.DB_USER,   // Using environment variable for DB user
    password: process.env.DB_PASSWORD,  // Using environment variable for DB password
    database: process.env.DB_NAME,  // Using environment variable for DB name
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database.");
});

// Define your routes here...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
