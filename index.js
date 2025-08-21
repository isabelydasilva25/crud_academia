const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER primary key AUTOINCREMENT,
            codigo VARCHAR(10),
            nome VARCHAR(100) NOT NULL,
            idade INTEGER,
            telefone VARCHAR(15),
            emergencia VARCHAR(15),
            endereco TEXT,
            email VARCHAR(100),
            cpf VARCHAR(14) NOT NULL UNIQUE
        )
    `);

    db.run(`
    CREATE TABLE if not exists funcionario (
  id INTEGER primary key AUTOINCREMENT,
  cargo VARCHAR(100) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  endereco TEXT,
  telefone VARCHAR(15),
  idade INTEGER
  )
  `);
    

    console.log("Tabelas criadas com sucesso.");
});

///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////


// Cadastrar cliente
app.post("/clientes", (req, res) => {
    const { codigo, nome, idade, telefone, emergencia, endereco, email, cpf } =
        req.body;

    if (!nome || !cpf) {
        return res.status(400).send("Nome e CPF são obrigatórios.");
    }

    const query = `INSERT INTO clientes (codigo, nome, idade, telefone, emergencia, endereco, email, cpf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
        query,
        [codigo, nome, idade, telefone, emergencia, endereco, email, cpf],
        function (err) {
            if (err) {
                return res.status(500).send("Erro ao cadastrar cliente.");
            }
            res.status(201).send({
                id: this.lastID,
                message: "Cliente cadastrado com sucesso.",
            });
        },
    );
});

// Listar clientes
// Endpoint para listar todos os clientes ou buscar por CPF
app.get("/clientes", (req, res) => {
    const cpf = req.query.cpf || ""; // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM clientes WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna todos os clientes
        });
    }
});

// Atualizar cliente
app.put("/clientes/cpf/:cpf", (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, endereco } = req.body;

    const query = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, endereco, cpf], function (err) {
        if (err) {
            return res.status(500).send("Erro ao atualizar cliente.");
        }
        if (this.changes === 0) {
            return res.status(404).send("Cliente não encontrado.");
        }
        res.send("Cliente atualizado com sucesso.");
    });
});

///////////////////////////// Rotas para Funcionario /////////////////////////////
///////////////////////////// Rotas para Funcionario /////////////////////////////
///////////////////////////// Rotas para Funcionario /////////////////////////////


// Cadastrar funcionario
app.post('/funcionario', (req, res) => {
    const { nome, cpf, email, telefone, endereco, idade } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send('Nome e CPF são obrigatórios.');
    }

    const query = `INSERT INTO funcionario (nome, cpf, email, telefone, endereco, idade) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, email, telefone, endereco, idade], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar funcionario.');
        }
        res.status(201).send({ id: this.lastID, message: 'Funcionario cadastrado com sucesso.' });
    });
});

// Listar funcionario
// Endpoint para listar todos os funcionarios ou buscar por CPF
app.get('/funcionario', (req, res) => {
    const cpf = req.query.cpf || '';  // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca funcionarios que possuam esse CPF ou parte dele
        const query = `SELECT * FROM funcionario WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar funcionarios.' });
            }
            res.json(rows);  // Retorna os funcionarios encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os funcionarios
        const query = `SELECT * FROM funcionario`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar funcionarios.' });
            }
            res.json(rows);  // Retorna todos os funcionarios
        });
    }
});



// Atualizar funcionario
app.put('/funcionario/cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, endereco, idade } = req.body;

    const query = `UPDATE funcionario SET nome = ?, email = ?, telefone = ?, endereco = ?, idade = ?, WHERE cpf = ?`;
    db.run(query, [nome, cpf, email, telefone, endereco, idade], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar funcionario.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Funcionario não encontrado.');
        }
        res.send('Funcionario atualizado com sucesso.');
    });
});


// Teste para verificar se o servidor está rodando
app.get("/", (req, res) => {
    res.send("Servidor está rodando e tabelas criadas!");
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
