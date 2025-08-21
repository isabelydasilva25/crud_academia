async function incluirCliente(event) {
    event.preventDefault();



    const funcionario = {
        codigo: document.getElementById("codigo").value,
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
        idade: document.getElementById("idade").value
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
            document.getElementById("formfuncionario").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cliente.");
    }
}





// Função para listar todos os funcionarios ou buscar funcionarios por CPF
async function consultarFuncionario() {
    const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input

    let url = '/funcionario';  // URL padrão para todos os funcionarios

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const funcionario = await response.json();

        const tabela = document.getElementById('tabela-funcionario');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (clientes.length === 0) {
            // Caso não encontre funcionario, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionario encontrado.</td></tr>';
        } else {
            clientes.forEach(funcionario => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcionario.codigo}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cpf}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.telefone}</td>
                    <td>${funcionario.endereco}</td>
                    <td>${funcionario.idade}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionarios:', error);
    }
}
// Função para atualizar as informações do funcionario
async function alterarfuncionario() {
        const codigo: document.getElementById("codigo").value,
        const nome: document.getElementById("nome").value,
        const cpf: document.getElementById("cpf").value
        const email: document.getElementById("email").value,
        const telefone: document.getElementById("telefone").value,
        const endereco: document.getElementById("endereco").value,
        const idade: document.getElementById("idade").value

    const funcionarioAtualizado = {
        codigo,
        nome,
        cpf, 
        email,
        telefone,
        endereco,
        idade
    };

    try {
        const response = await fetch(`/funcionario/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (response.ok) {
            alert('Funcionariio atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar funcionario: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionario:', error);
        alert('Erro ao atualizar funcionario.');
    }
}
async function limpaFormulario() {
    document.getElementById('codigo').value ='';
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('idade').value = '';
}
