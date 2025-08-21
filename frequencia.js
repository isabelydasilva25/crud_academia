document.addEventListener('DOMContentLoaded', function() {
    // Initialize SQL.js database
    let db;
    const initSqlJs = window.initSqlJs;
    const config = {
        locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
    };

    initSqlJs(config).then(function(SQL) {
        // Create a new database
        db = new SQL.Database();
        
        // Create the movimento_mes table if it doesn't exist
        db.run(`
            CREATE TABLE if not exists movimento_mes (
                id_movimento INTEGER primary key AUTOINCREMENT,
                cliente varchar(50) not NULL,
                treinos_feitos varchar(10) NOT NULL,
                faltas varchar(10) NOT NULL 
            );
        `);
        
        // Insert sample data if needed
        // db.run(`INSERT INTO movimento_mes (cliente, treinos_feitos, faltas) VALUES ('mariana', '44', '122');`);
        
        // Load existing data into the table
        loadData();
    });

    // DOM elements
    const form = document.getElementById('frequenciaForm');
    const btnIncluir = document.getElementById('btnIncluir');
    const btnExcluir = document.getElementById('btnExcluir');
    const btnAlterar = document.getElementById('btnAlterar');
    const btnConsultar = document.getElementById('btnConsultar');
    const tabelaCorpo = document.getElementById('tabelaCorpo');

    // Event listeners
    btnIncluir.addEventListener('click', incluirRegistro);
    btnExcluir.addEventListener('click', excluirRegistro);
    btnAlterar.addEventListener('click', alterarRegistro);
    btnConsultar.addEventListener('click', consultarRegistro);

    // Function to load data into the table
    function loadData() {
        if (!db) return;
        
        const result = db.exec("SELECT * FROM movimento_mes");
        if (result.length === 0) return;
        
        const data = result[0].values;
        tabelaCorpo.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            
            row.forEach((cell, index) => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            
            tabelaCorpo.appendChild(tr);
        });
    }

    // Function to include a new record
    function incluirRegistro() {
        if (!db) return;
        
        const cliente = document.getElementById('cliente').value;
        const treinos = document.getElementById('treinos').value;
        const faltas = document.getElementById('faltas').value;
        
        if (!cliente || !treinos || !faltas) {
            alert('Preencha todos os campos!');
            return;
        }
        
        try {
            db.run(
                "INSERT INTO movimento_mes (cliente, treinos_feitos, faltas) VALUES (?, ?, ?)",
                [cliente, treinos, faltas]
            );
            
            alert('Registro incluído com sucesso!');
            form.reset();
            loadData();
        } catch (error) {
            alert('Erro ao incluir registro: ' + error.message);
        }
    }

    // Function to delete a record
    function excluirRegistro() {
        if (!db) return;
        
        const codigo = document.getElementById('codigo').value;
        
        if (!codigo) {
            alert('Informe o código do registro a ser excluído!');
            return;
        }
        
        try {
            db.run("DELETE FROM movimento_mes WHERE id_movimento = ?", [codigo]);
            alert('Registro excluído com sucesso!');
            form.reset();
            loadData();
        } catch (error) {
            alert('Erro ao excluir registro: ' + error.message);
        }
    }

    // Function to update a record
    function alterarRegistro() {
        if (!db) return;
        
        const codigo = document.getElementById('codigo').value;
        const cliente = document.getElementById('cliente').value;
        const treinos = document.getElementById('treinos').value;
        const faltas = document.getElementById('faltas').value;
        
        if (!codigo || !cliente || !treinos || !faltas) {
            alert('Preencha todos os campos!');
            return;
        }
        
        try {
            db.run(
                "UPDATE movimento_mes SET cliente = ?, treinos_feitos = ?, faltas = ? WHERE id_movimento = ?",
                [cliente, treinos, faltas, codigo]
            );
            
            alert('Registro alterado com sucesso!');
            form.reset();
            loadData();
        } catch (error) {
            alert('Erro ao alterar registro: ' + error.message);
        }
    }

    // Function to query a record
    function consultarRegistro() {
        if (!db) return;
        
        const codigo = document.getElementById('codigo').value;
        
        if (!codigo) {
            alert('Informe o código do registro a ser consultado!');
            return;
        }
        
        try {
            const result = db.exec("SELECT * FROM movimento_mes WHERE id_movimento = ?", [codigo]);
            
            if (result.length === 0 || result[0].values.length === 0) {
                alert('Registro não encontrado!');
                return;
            }
            
            const data = result[0].values[0];
            document.getElementById('cliente').value = data[1];
            document.getElementById('treinos').value = data[2];
            document.getElementById('faltas').value = data[3];
            
        } catch (error) {
            alert('Erro ao consultar registro: ' + error.message);
        }
    }
});