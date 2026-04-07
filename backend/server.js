const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection ({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "crud_praticar"
});

db.connect(err => {
    if (err) {
        console.log("Erro ao conectar", err);
    } else {
        console.log("Conectado ao MYSQL");
    }
});

app.get("/tarefas", (req, res) => {
    db.query("SELECT * FROM tarefas", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/tarefas", (req, res) => {
    const { texto } = req.body;
    db.query("INSERT INTO tarefas (texto) VALUES (?)", [texto], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Tarefa criada");
    });
});

app.put("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;

    db.query("UPDATE tarefas SET texto = ? WHERE id = ?", [texto, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Atualizado");
    });
});

app.delete("/tarefas/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tarefas WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Deletado");
    });
});

app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});