async function incluirCliente(event) {
    alert("asdf");
    event.preventDefault();
    


    const cliente = {
        codigo: document.getElementById("codigo").value,
        nome: document.getElementById("nome").value,
        idade: document.getElementById("idade").value,
        telefone: document.getElementById("telefone").value,
        emergencia: document.getElementById("emergencia").value,
        endereco: document.getElementById("endereco").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value
    };

    try {
        const response = await fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Cliente cadastrado com sucesso!");
            document.getElementById("cliente-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cliente.");
    }
}





// Função para listar todos os clientes ou buscar clientes por CPF
async function consultarClientes() {
    const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input

    let url = '/clientes';  // URL padrão para todos os clientes

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const clientes = await response.json();

        const tabela = document.getElementById('tabela-clientes');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (clientes.length === 0) {
            // Caso não encontre clientes, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
        } else {
            clientes.forEach(cliente => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${cliente.codigo}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.idade}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.emergencia}</td>
                    <td>${cliente.endereco}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.cpf}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }
}
// Função para atualizar as informações do cliente
async function alterarCliente() {
    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const telefone = document.getElementById('telefone').value;
    const emergencia = document.getElementById('emergencia').value;
    const endereco = document.getElementById('endereco').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;

    const clienteAtualizado = {
        codigo,
        nome,
        idade, 
        telefone,
        emergencia,
        endereco,
        email,
        cpf
    };

    try {
        const response = await fetch(`/clientes/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar cliente: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
    }
}
async function limpaFormulario() {
    const codigo = document.getElementById('codigo').value;
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    const telefone = document.getElementById('telefone').value;
    const emergencia = document.getElementById('emergencia').value;
    const endereco = document.getElementById('endereco').value;
    document.getElementById('email').value = '';
    const cpf = document.getElementById('cpf').value;
}
