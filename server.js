const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "@Misfits13", 
    database: "productinate",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database.");
});


db.query(
    `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        status ENUM('pending', 'done') DEFAULT 'pending'
    )`,
    (err) => {
        if (err) {
            console.error("Error creating tasks table:", err);
        } else {
            console.log("Tasks table ready.");
        }
    }
);


db.query(
    `CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
    )`,
    (err) => {
        if (err) {
            console.error("Error creating notes table:", err);
        } else {
            console.log("Notes table ready.");
        }
    }
);


app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            res.status(500).send("Error fetching tasks");
        } else {
            res.json(results);
        }
    });
});

app.post("/tasks", (req, res) => {
    const { description, status } = req.body;
    db.query(
        "INSERT INTO tasks (description, status) VALUES (?, ?)",
        [description, status || "pending"],
        (err, result) => {
            if (err) {
                console.error("Error adding task:", err);
                res.status(500).send("Error adding task");
            } else {
                res.json({ id: result.insertId, description, status: status || "pending" });
            }
        }
    );
});

app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query(
        "UPDATE tasks SET status = ? WHERE id = ?",
        [status, id],
        (err) => {
            if (err) {
                console.error("Error updating task:", err);
                res.status(500).send("Error updating task");
            } else {
                res.sendStatus(200);
            }
        }
    );
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) {
            console.error("Error deleting task:", err);
            res.status(500).send("Error deleting task");
        } else {
            res.sendStatus(200);
        }
    });
});


app.get("/notes", (req, res) => {
    db.query("SELECT * FROM notes", (err, results) => {
        if (err) {
            console.error("Error fetching notes:", err);
            res.status(500).send("Error fetching notes");
        } else {
            res.json(results);
        }
    });
});


app.post("/notes", (req, res) => {
    const { title, content } = req.body;
    db.query(
        "INSERT INTO notes (title, content) VALUES (?, ?)",
        [title, content],
        (err, result) => {
            if (err) {
                console.error("Error adding note:", err);
                res.status(500).send("Error adding note");
            } else {
                res.json({ id: result.insertId, title, content });
            }
        }
    );
});


app.get("/notes/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM notes WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching note:", err);
            res.status(500).send("Error fetching note");
        } else {
            if (result.length === 0) {
                res.status(404).send("Note not found");
            } else {
                res.json(result[0]);
            }
        }
    });
});


app.delete("/notes/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM notes WHERE id = ?", [id], (err) => {
        if (err) {
            console.error("Error deleting note:", err);
            res.status(500).send("Error deleting note");
        } else {
            res.sendStatus(200); 
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
