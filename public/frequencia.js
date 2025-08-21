
      // Função para buscar o relatório com filtros
function buscarRelatorio() {
    const cpf = document.getElementById("codigo").value;
    const produto = document.getElementById("nome_cliente").value;
    const dataInicio = document.getElementById("treinos_feitos").value;
    const dataFim = document.getElementById("faltas").value;

    try {
        const response = await fetch('/frequencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frequencia)
        });

        const result = await response.json();
            if (response.ok) {
                alert("frequencia cadastrada com sucesso!");
                document.getElementById("formfrequencia").reset();
            } else {
                alert(`Erro: ${result.message}`);
            }
        } catch (err) {
            console.error("Erro na solicitação:", err);
            alert("Erro ao cadastrar a frequencia.");
        }
            // Limpar a tabela
            const tabelaVendas = document.getElementById("tabela-vendas");
            tabelaVendas.innerHTML = '';

            // Preencher a tabela com os dados
            data.forEach(venda => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${venda.id}</td>
                    <td>${venda.cliente_nome}</td>
                    <td>${venda.produto_nome}</td>
                    <td>${venda.quantidade}</td>
                    <td>${new Date(venda.data).toLocaleString()}</td>
                `;
                tabelaVendas.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
        });
}
