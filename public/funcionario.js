// Array para armazenar os funcionários
let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];

// Função para incluir um novo funcionário
function incluirFuncionario() {
    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    // Validação simples
    if (!codigo || !nome || !email || !telefone || !endereco) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Verifica se o código já existe
    if (funcionarios.some(func => func.codigo === codigo)) {
        alert('Já existe um funcionário com este código!');
        return;
    }

    // Adiciona o novo funcionário
    const novoFuncionario = {
        codigo,
        nome,
        email,
        telefone,
        endereco
    };

    funcionarios.push(novoFuncionario);
    salvarNoLocalStorage();
    limparFormulario();
    alert('Funcionário cadastrado com sucesso!');
}

// Função para excluir um funcionário
function excluirFuncionario() {
    const codigo = document.getElementById('codigo').value;

    if (!codigo) {
        alert('Por favor, informe o código do funcionário a ser excluído!');
        return;
    }

    const index = funcionarios.findIndex(func => func.codigo === codigo);

    if (index === -1) {
        alert('Funcionário não encontrado!');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir o funcionário ${funcionarios[index].nome}?`)) {
        funcionarios.splice(index, 1);
        salvarNoLocalStorage();
        limparFormulario();
        alert('Funcionário excluído com sucesso!');
    }
}

// Função para alterar um funcionário
function alterarFuncionario() {
    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    if (!codigo) {
        alert('Por favor, informe o código do funcionário a ser alterado!');
        return;
    }

    const funcionario = funcionarios.find(func => func.codigo === codigo);

    if (!funcionario) {
        alert('Funcionário não encontrado!');
        return;
    }

    if (confirm(`Tem certeza que deseja alterar os dados do funcionário ${funcionario.nome}?`)) {
        funcionario.nome = nome;
        funcionario.email = email;
        funcionario.telefone = telefone;
        funcionario.endereco = endereco;
        
        salvarNoLocalStorage();
        alert('Funcionário alterado com sucesso!');
    }
}

// Função para consultar todos os funcionários
function consultarFuncionarios() {
    const tabelaCorpo = document.getElementById('tabelaCorpo');
    tabelaCorpo.innerHTML = '';

    if (funcionarios.length === 0) {
        tabelaCorpo.innerHTML = '<tr><td colspan="6">Nenhum funcionário cadastrado</td></tr>';
    } else {
        funcionarios.forEach(funcionario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${funcionario.codigo}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.email}</td>
                <td>${funcionario.telefone}</td>
                <td>${funcionario.endereco}</td>
                <td>
                    <button onclick="carregarParaEdicao('${funcionario.codigo}')">Editar</button>
                    <button onclick="confirmarExclusao('${funcionario.codigo}')">Excluir</button>
                </td>
            `;
            tabelaCorpo.appendChild(row);
        });
    }

    document.getElementById('tabelaConsulta').style.display = 'block';
}

// Função para carregar dados para edição
function carregarParaEdicao(codigo) {
    const funcionario = funcionarios.find(func => func.codigo === codigo);
    
    if (funcionario) {
        document.getElementById('codigo').value = funcionario.codigo;
        document.getElementById('nome').value = funcionario.nome;
        document.getElementById('email').value = funcionario.email;
        document.getElementById('telefone').value = funcionario.telefone;
        document.getElementById('endereco').value = funcionario.endereco;
        
        document.getElementById('tabelaConsulta').style.display = 'none';
    }
}

// Função para confirmar exclusão da tabela
function confirmarExclusao(codigo) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        const index = funcionarios.findIndex(func => func.codigo === codigo);
        
        if (index !== -1) {
            funcionarios.splice(index, 1);
            salvarNoLocalStorage();
            consultarFuncionarios(); // Atualiza a tabela
            alert('Funcionário excluído com sucesso!');
        }
    }
}

// Função para fechar a consulta
function fecharConsulta() {
    document.getElementById('tabelaConsulta').style.display = 'none';
}

// Função para abrir a página de cargo
function abrirCargo() {
    window.open('cargo.html', '_blank');
}

// Função para voltar
function voltar() {
    window.location.href = 'escolha.html';
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('formFuncionario').reset();
}

// Função para salvar no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

// Carrega os funcionários ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    // Pode adicionar mais lógica de inicialização aqui se necessário
});