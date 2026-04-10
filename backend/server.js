import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "crud_estudo",
});

app.get("/tarefas", async (req, res) => {   
    const [rows] = await db.query("SELECT * FROM tarefas");
    res.json(rows);
});

app.post("/tarefas", async (req, res) => {
    const { texto } = req.body;
    const [result] = await db.query("INSERT INTO tarefas (texto) VALUES (?)", [texto]);
    
    res.json({
        id: result.insertId,
        texto
    });
});

app.put("/tarefas/:id", async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;
    const [result] = await db.query("UPDATE tarefas SET texto = ? WHERE id = ?", [texto, id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json({
        id,
        texto
    });
});

app.delete("/tarefas/:id", async (req, res) => {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM tarefas WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json({
        mensagem: "Tarefa deletada com sucesso"
    });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
