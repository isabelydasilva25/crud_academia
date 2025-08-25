 // Função para buscar o relatório com filtros
     function buscarRelatorio() {
         const codigo = document.getElementById("codigo").value;
         const nome = document.getElementById("nome").value;
         const treinos = document.getElementById("treinos").value;
         const faltas = document.getElementById("faltas").value;

         // Construir a URL com os parâmetros de filtro
         let url = `/relatorios?`;
         if (codigo) url += `codigo=${codigo}&`;
         if (nome) url += `nome=${nome}&`;
         if (treinos) url += `treinos=${treinos}&`;
         if (faltas) url += `faltas=${faltas}&`;

         // Remover o último "&" se presente
         url = url.slice(0, -1);

         // Fazer a requisição para o servidor
         fetch(url)
             .then(response => response.json())
             .then(data => {
                 // Limpar a tabela
                 const tabelaVendas = document.getElementById("tabela-vendas");
                 tabelaVendas.innerHTML = '';

                 // Preencher a tabela com os dados
                 data.forEach(frequencia => {
                     const tr = document.createElement("tr");
                     tr.innerHTML = `
                         <td>${frequencia.id}</td>
                         <td>${frequencia.nome}</td>
                         <td>${frequencia.treinos_feitos}</td>
                         <td>${frequencia.faltas}</td>
                         <td>${new Date(frequencia.data).toLocaleString()}</td>
                     `;
                     tabelafrequencia.appendChild(tr);
                 });
             })
     }
