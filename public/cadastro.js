// Array para armazenar os clientes
let clientes = [];

// Função para incluir um novo cliente
function incluirCliente() {
    const form = document.getElementById('formCliente');
    if (!form.checkValidity()) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const cliente = {
        codigo: document.getElementById('codigo').value,
        nome: document.getElementById('nome').value,
        idade: document.getElementById('idade').value,
        telefone: document.getElementById('telefone').value,
        emergencia: document.getElementById('emergencia').value,
        endereco: document.getElementById('endereco').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value
    };

    // Verifica se o código já existe (para atualização)
    const index = clientes.findIndex(c => c.codigo === cliente.codigo);
    if (index === -1) {
        clientes.push(cliente);
        alert("Cliente cadastrado com sucesso!");
    } else {
        clientes[index] = cliente;
        alert("Cliente atualizado com sucesso!");
    }

    limparFormulario();
}

// Função para excluir um cliente
function excluirCliente() {
    const codigo = document.getElementById('codigo').value;
    if (!codigo) {
        alert("Por favor, informe o código do cliente a ser excluído.");
        return;
    }

    const index = clientes.findIndex(c => c.codigo === codigo);
    if (index !== -1) {
        if (confirm(`Tem certeza que deseja excluir o cliente ${clientes[index].nome}?`)) {
            clientes.splice(index, 1);
            alert("Cliente excluído com sucesso!");
            limparFormulario();
        }
    } else {
        alert("Cliente não encontrado.");
    }
}

// Função para alterar um cliente
function alterarCliente() {
    const codigo = document.getElementById('codigo').value;
    if (!codigo) {
        alert("Por favor, informe o código do cliente a ser alterado.");
        return;
    }

    const cliente = clientes.find(c => c.codigo === codigo);
    if (cliente) {
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('idade').value = cliente.idade;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('emergencia').value = cliente.emergencia;
        document.getElementById('endereco').value = cliente.endereco;
        document.getElementById('email').value = cliente.email;
        document.getElementById('cpf').value = cliente.cpf;
    } else {
        alert("Cliente não encontrado.");
    }
}

// Função para consultar/visualizar a lista de clientes
function consultarClientes() {
    const sectionCadastro = document.getElementById('cliente');
    const sectionLista = document.getElementById('lista-clientes');
    
    if (clientes.length === 0) {
        alert("Nenhum cliente cadastrado ainda.");
        return;
    }

    sectionCadastro.style.display = 'none';
    sectionLista.style.display = 'block';

    const tabela = document.getElementById('corpo-tabela');
    tabela.innerHTML = '';

    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.codigo}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.idade}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.cpf}</td>
            <td class="acoes">
                <button class="editar" onclick="carregarParaEdicao('${cliente.codigo}')">Editar</button>
                <button class="excluir" onclick="confirmarExclusao('${cliente.codigo}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

// Função auxiliar para carregar cliente para edição
function carregarParaEdicao(codigo) {
    voltarParaCadastro();
    const cliente = clientes.find(c => c.codigo === codigo);
    if (cliente) {
        document.getElementById('codigo').value = cliente.codigo;
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('idade').value = cliente.idade;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('emergencia').value = cliente.emergencia;
        document.getElementById('endereco').value = cliente.endereco;
        document.getElementById('email').value = cliente.email;
        document.getElementById('cpf').value = cliente.cpf;
    }
}

// Função auxiliar para confirmar exclusão
function confirmarExclusao(codigo) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        clientes = clientes.filter(c => c.codigo !== codigo);
        consultarClientes(); // Atualiza a tabela
    }
}

// Função para voltar para o formulário de cadastro
function voltarParaCadastro() {
    document.getElementById('cliente').style.display = 'block';
    document.getElementById('lista-clientes').style.display = 'none';
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('formCliente').reset();
}

// Validação de CPF (opcional)
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
        return false;
        
    // Valida 1o digito
    let add = 0;
    for (let i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
        
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
        
    return true;
}

// Adiciona validação de CPF ao formulário
document.getElementById('cpf').addEventListener('blur', function() {
    if (!validarCPF(this.value)) {
        alert("CPF inválido!");
        this.value = '';
        this.focus();
    }
});

