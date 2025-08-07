document.addEventListener('DOMContentLoaded', function() {
    // Initialize SQL.js database
    let db;
    const initSqlJs = window.initSqlJs;
    const config = {
        locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
    };

    // Load SQL.js and initialize database
    initSqlJs(config).then(function(SQL) {
        db = new SQL.Database();
        
        // Create the movimento table if it doesn't exist
        db.run(`
            CREATE TABLE if not exists movimento (
                id_movimento INTEGER primary key AUTOINCREMENT,
                cliente varchar(50) not NULL,
                horario_entrada varchar(10) NOT NULL,
                horario_saida varchar(10) NOT NULL UNIQUE
            );
        `);
        
        // Insert sample data if the table is empty
        const check = db.exec("SELECT COUNT(*) as count FROM movimento");
        if (check[0].values[0][0] === 0) {
            db.run(
                "INSERT INTO movimento (cliente, horario_entrada, horario_saida) VALUES (?, ?, ?)",
                ['mariana', '13:20', '14:40']
            );
        }
        
        // Load existing data into the table
        loadData();
    }).catch(function(error) {
        console.error("Error initializing SQL.js:", error);
        alert("Erro ao carregar o banco de dados. Por favor, recarregue a página.");
    });

    // DOM elements
    const form = document.querySelector('.Cadastro');
    const btnIncluir = document.querySelector('.botao');
    const btnExcluir = document.querySelector('.botao2');
    const btnAlterar = document.querySelector('.botao3');
    const btnConsultar = document.querySelector('.botao4');
    const btnVoltar = document.querySelector('.botao5');

    // Remove the href behavior and add click handlers
    [btnIncluir, btnExcluir, btnAlterar, btnConsultar].forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
        };
    });

    // Event listeners
    btnIncluir.addEventListener('click', incluirRegistro);
    btnExcluir.addEventListener('click', excluirRegistro);
    btnAlterar.addEventListener('click', alterarRegistro);
    btnConsultar.addEventListener('click', consultarRegistro);
    btnVoltar.addEventListener('click', () => {
        window.location.href = 'escolha.html';
    });

    // Create table structure
    function createTableStructure() {
        const agendaSection = document.querySelector('#agenda');
        
        // Remove existing table if it exists
        const existingTable = document.querySelector('.movimento-table');
        if (existingTable) {
            existingTable.remove();
        }
        
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'movimento-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="tabelaCorpo"></tbody>
        `;
        
        tableContainer.appendChild(table);
        agendaSection.appendChild(tableContainer);
    }

    // Function to load and display data
    function loadData() {
        if (!db) return;
        
        // Create table structure if it doesn't exist
        if (!document.querySelector('.movimento-table')) {
            createTableStructure();
        }
        
        const tabelaCorpo = document.getElementById('tabelaCorpo');
        tabelaCorpo.innerHTML = '';
        
        try {
            const result = db.exec("SELECT * FROM movimento ORDER BY id_movimento DESC");
            if (result.length > 0) {
                const data = result[0].values;
                
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.dataset.id = row[0]; // Store ID in data attribute
                    
                    // Add cells for each column
                    row.forEach((cell, index) => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    
                    // Add action buttons
                    const actionTd = document.createElement('td');
                    
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.className = 'btn-editar';
                    editBtn.addEventListener('click', () => carregarParaEdicao(row[0]));
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Excluir';
                    deleteBtn.className = 'btn-excluir';
                    deleteBtn.addEventListener('click', () => confirmarExclusao(row[0]));
                    
                    actionTd.appendChild(editBtn);
                    actionTd.appendChild(deleteBtn);
                    tr.appendChild(actionTd);
                    
                    tabelaCorpo.appendChild(tr);
                });
            }
        } catch (error) {
            console.error("Error loading data:", error);
            alert("Erro ao carregar os dados da agenda.");
        }
    }

    // Load record for editing
    function carregarParaEdicao(id) {
        if (!db) return;
        
        try {
            const result = db.exec("SELECT * FROM movimento WHERE id_movimento = ?", [id]);
            
            if (result.length > 0 && result[0].values.length > 0) {
                const registro = result[0].values[0];
                
                document.getElementById('codigo cliente').value = registro[1]; // cliente
                document.getElementById('horario entrada').value = registro[2]; // entrada
                document.getElementById('horario de saida').value = registro[3]; // saida
                
                // Scroll to form
                document.querySelector('.Cadastro').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error loading record:", error);
            alert("Erro ao carregar registro para edição.");
        }
    }

    // Confirm deletion
    function confirmarExclusao(id) {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            excluirPorId(id);
        }
    }

    // Delete by ID
    function excluirPorId(id) {
        if (!db) return;
        
        try {
            db.run("DELETE FROM movimento WHERE id_movimento = ?", [id]);
            loadData();
            alert('Registro excluído com sucesso!');
        } catch (error) {
            console.error("Error deleting record:", error);
            alert("Erro ao excluir registro.");
        }
    }

    // Function to include a new record
    function incluirRegistro(e) {
        e.preventDefault();
        if (!db) return;
        
        const codigoCliente = document.getElementById('codigo cliente').value;
        const horarioEntrada = document.getElementById('horario entrada').value;
        const horarioSaida = document.getElementById('horario de saida').value;
        
        if (!codigoCliente || !horarioEntrada || !horarioSaida) {
            alert('Preencha todos os campos!');
            return;
        }
        
        // Validate time format (simple validation)
        if (!/^\d{2}:\d{2}$/.test(horarioEntrada) || !/^\d{2}:\d{2}$/.test(horarioSaida)) {
            alert('Formato de horário inválido. Use HH:MM');
            return;
        }
        
        try {
            db.run(
                "INSERT INTO movimento (cliente, horario_entrada, horario_saida) VALUES (?, ?, ?)",
                [codigoCliente, horarioEntrada, horarioSaida]
            );
            
            alert('Registro incluído com sucesso!');
            form.reset();
            loadData();
        } catch (error) {
            console.error("Error inserting record:", error);
            if (error.message.includes('UNIQUE constraint failed')) {
                alert('Já existe um registro com este horário de saída!');
            } else {
                alert('Erro ao incluir registro: ' + error.message);
            }
        }
    }

    // Function to delete a record
    function excluirRegistro(e) {
        e.preventDefault();
        if (!db) return;
        
        const codigoCliente = document.getElementById('codigo cliente').value;
        
        if (!codigoCliente) {
            alert('Informe o código do cliente para excluir!');
            return;
        }
        
        try {
            const result = db.exec("DELETE FROM movimento WHERE cliente = ?", [codigoCliente]);
            
            if (result[0].changes === 0) {
                alert('Nenhum registro encontrado com este código de cliente!');
            } else {
                alert('Registro(s) excluído(s) com sucesso!');
                form.reset();
                loadData();
            }
        } catch (error) {
            console.error("Error deleting record:", error);
            alert('Erro ao excluir registro: ' + error.message);
        }
    }

    // Function to update a record
    function alterarRegistro(e) {
        e.preventDefault();
        if (!db) return;
        
        const codigoCliente = document.getElementById('codigo cliente').value;
        const horarioEntrada = document.getElementById('horario entrada').value;
        const horarioSaida = document.getElementById('horario de saida').value;
        
        if (!codigoCliente || !horarioEntrada || !horarioSaida) {
            alert('Preencha todos os campos!');
            return;
        }
        
        try {
            const result = db.exec(
                "UPDATE movimento SET horario_entrada = ?, horario_saida = ? WHERE cliente = ?",
                [horarioEntrada, horarioSaida, codigoCliente]
            );
            
            if (result[0].changes === 0) {
                alert('Nenhum registro encontrado com este código de cliente!');
            } else {
                alert('Registro alterado com sucesso!');
                form.reset();
                loadData();
            }
        } catch (error) {
            console.error("Error updating record:", error);
            if (error.message.includes('UNIQUE constraint failed')) {
                alert('Já existe um registro com este horário de saída!');
            } else {
                alert('Erro ao alterar registro: ' + error.message);
            }
        }
    }

    // Function to query a record
    function consultarRegistro(e) {
        e.preventDefault();
        if (!db) return;
        
        const codigoCliente = document.getElementById('codigo cliente').value;
        
        if (!codigoCliente) {
            alert('Informe o código do cliente para consultar!');
            return;
        }
        
        try {
            const result = db.exec("SELECT * FROM movimento WHERE cliente = ?", [codigoCliente]);
            
            if (result.length === 0 || result[0].values.length === 0) {
                alert('Nenhum registro encontrado com este código de cliente!');
                return;
            }
            
            const data = result[0].values[0];
            document.getElementById('horario entrada').value = data[2];
            document.getElementById('horario de saida').value = data[3];
            
        } catch (error) {
            console.error("Error querying record:", error);
            alert('Erro ao consultar registro: ' + error.message);
        }
    }
});