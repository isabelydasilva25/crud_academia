  async function incluirfrequencia(event) {
     event.preventDefault();



     const frequencia = {
         codigo: document.getElementById("codigo").value,
         nome: document.getElementById("nome").value,
  treinos_feitos:document.getElementById("treinos").value,
         faltas: document.getElementById("faltas").value,
     };

     try {
         const response = await fetch('/frequecia', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(frequencia)
         });

         const result = await response.json();
         if (response.ok) {
             alert("Frequencia cadastrada com sucesso!");
             document.getElementById("formFrequencia").reset();
         } else {
             alert(`Erro: ${result.message}`);
         }
     } catch (err) {
         console.error("Erro na solicitação:", err);
         alert("Erro ao cadastrar frequencia.");
     }
 }



 // Função para listar todos os clientes ou buscar clientes por CPF
 async function consultarClientes() {
     const codigo = document.getElementById('codigo').value.trim();  // Pega o valor do CPF digitado no input

     let url = '/frequencia';  // URL padrão para todos os clientes

     if (codigo) {
         // Se CPF foi digitado, adiciona o parâmetro de consulta
         url += `?codigo=${codigo}`;
     }

     try {
         const response = await fetch(url);
         const frequencia = await response.json();

         const tabela = document.getElementById('tabela-frequencia');
         tabela.innerHTML = ''; // Limpa a tabela antes de preencher

         if (frequencia.length === 0) {
             // Caso não encontre clientes, exibe uma mensagem
             tabela.innerHTML = '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
         } else {
             frequencia.forEach(frequencia => {
                 const linha = document.createElement('tr');
                 linha.innerHTML = `
                     <td>${frequencia.codigo}</td>
                     <td>${frequencia.nome}</td>
                     <td>${frequencia.treinos_feitos}</td>
                     <td>${frequencia.faltas}</td>
                 `;
                 tabela.appendChild(linha);
             });
         }
     } catch (error) {
         console.error('Erro ao listar frequencia:', error);
     }
 }
 // Função para atualizar as informações do cliente
 async function alterarCliente() {
     const codigo = document.getElementById('codigo').value;
     const nome = document.getElementById('nome').value;
     const idade = document.getElementById('treinos_feitos').value;
     const telefone = document.getElementById('faltas').value;
     

     const clienteAtualizado = {
         codigo,
         nome,
         treinos_feitos, 
         faltas,
     };

     try {
         const response = await fetch(`/clientes/cpf/${cliente}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(frequenciaAtualizado)
         });

         if (response.ok) {
             alert('frequencia atualizada com sucesso!');
         } else {
             const errorMessage = await response.text();
             alert('Erro ao atualizar frequencia: ' + errorMessage);
         }
     } catch (error) {
         console.error('Erro ao atualizar frequencia:', error);
         alert('Erro ao atualizar frequencia.');
     }
 }
 async function limpaFormulario() {
     document.getElementById('codigo').value ='';
     document.getElementById('nome').value = '';
     document.getElementById('treinos_feitos').value = '';
     document.getElementById('faltas').value = '';
     
 }
