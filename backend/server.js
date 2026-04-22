import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { autenticar } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.post("/register", async (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ erro: "Email ou senha vazio" })
    }
    
    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        await db.query("INSERT INTO usuarios (email, senha) VALUES (?, ?)", [email, senhaHash]);

    res.json({
        mensagem: "Usuario registrado com sucesso"
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao registrar usuário" });
    }
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email ou senha vazio" });
    }
    
    try {
        const [rows] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

app.get("/tarefas", autenticar, async (req, res) => {   
    const userId = req.userId;

    try {    
        const [rows] = await db.query("SELECT * FROM tarefas WHERE user_id = ?", [userId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao buscar tarefas" });
    }
});

app.post("/tarefas", autenticar, async (req, res) => {
    const { texto } = req.body;
    const userId = req.userId;

    if (!texto) {
        return res.status(400).json({ erro: "Texto da tarefa é obrigatório" });
    }

    try {
    
        const [result] = await db.query("INSERT INTO tarefas (texto, user_id) VALUES (?, ?)", [texto, userId]);
    
        res.status(201).json({
            id: result.insertId,
            texto,
            user_id: userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
});

app.put("/tarefas/:id", autenticar, async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;
    const userId = req.userId;

    if (!texto) {
        return res.status(400).json({ erro: "Texto da tarefa é obrigatório" })
    }

    try {
        const [result] = await db.query("UPDATE tarefas SET texto = ? WHERE id = ? AND user_id = ?", [texto, id, userId]);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }
        res.json({
            id,
            texto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
});

app.delete("/tarefas/:id", autenticar, async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    
    try {
        const [result] = await db.query("DELETE FROM tarefas WHERE id = ? AND user_id = ?", [id, userId]);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }
        res.json({
            mensagem: "Tarefa deletada com sucesso"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao deletar tarefa" });
    }
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
