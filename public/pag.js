function buscarRelatorio() {
    const codigo = document.getElementById("codigo").value;
    const valor = document.getElementById("valor").value;
    const dataPagamento = document.getElementById("dataPagamento").value;
    const formaPagamento = document.getElementById("dataFim").value;

    // Construir a URL com os parâmetros de filtro
    let url = `/relatorios?`;
    if (codigo) url += `codigo=${codigo}&`;
    if (valor) url += `valor=${valor}&`;
    if (dataPagamento) url += `dataPagamento=${dataPagamento}&`;
    if (formaPagamento) url += `formaPagamento=${formaPagamento}&`;

    // Remover o último "&" se presente
    url = url.slice(0, -1);

    // Fazer a requisição para o servidor
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpar a tabela
            const tabelaPagamento = document.getElementById("tabela-pagamento");
            tabelaVendas.innerHTML = '';

            // Preencher a tabela com os dados
            data.forEach(pagamento => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${venda.id}</td>
                    <td>${venda.cliente_nome}</td>
                    <td>${venda.valor}</td>
                    <td>${new Date(pagamento.data).toLocaleString()}</td>
                `;
                tabelaPagamento.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
        });
}
