import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/equipment", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/equipment", async (req, res) => {
  const { name, type, status, last_cleaned } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO equipment (name, type, status, last_cleaned) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, type, status, last_cleaned]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/equipment/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, status, last_cleaned } = req.body;
  try {
    const result = await pool.query(
      "UPDATE equipment SET name=$1, type=$2, status=$3, last_cleaned=$4 WHERE id=$5 RETURNING *",
      [name, type, status, last_cleaned, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/equipment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM equipment WHERE id = $1", [id]);
    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
