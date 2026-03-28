// script.js

// --- Lógica do Carrinho ---
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Salva o estado atual do carrinho no LocalStorage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContador(); // Atualiza o contador do carrinho
}

// Adiciona um produto ao carrinho ou aumenta sua quantidade
// Agora aceita idProduto como o primeiro argumento
function adicionarCarrinho(idProduto, nome, preco, imagem) {
    let item = carrinho.find(p => p.id === idProduto); // Busca pelo ID único
    if(item){
        item.quantidade++;
    } else {
        carrinho.push({
            id: idProduto, // Armazena o ID único
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }
    salvarCarrinho();
}

// Remove um produto do carrinho
// Agora aceita idProduto como argumento
function removerDoCarrinho(idProduto) {
    carrinho = carrinho.filter(item => item.id !== idProduto); // Filtra pelo ID único
    salvarCarrinho();
    renderizarCarrinho(); // Renderiza o carrinho novamente após a remoção
}

// Atualiza a quantidade de um item no carrinho
// Agora aceita idProduto como o primeiro argumento
function atualizarQuantidade(idProduto, novaQuantidade) {
    let item = carrinho.find(p => p.id === idProduto); // Busca pelo ID único
    if (item) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(idProduto); // Chama removerDoCarrinho com o ID
        } else {
            item.quantidade = novaQuantidade;
            salvarCarrinho();
            renderizarCarrinho();
        }
    }
}

// Renderiza os itens do carrinho na página carrinho.html
function renderizarCarrinho() {
    const listaCarrinho = document.getElementById("listaCarrinho");
    const totalElement = document.getElementById("total");
    if (!listaCarrinho || !totalElement) return; // Garante que estamos na página correta

    listaCarrinho.innerHTML = '';
    let totalGeral = 0;

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<p style="text-align: center; margin-top: 20px;">Seu carrinho está vazio.</p>';
        totalElement.innerText = 'Total: R$ 0,00';
        return;
    }

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.innerHTML = `
            <div class="produtoInfo">
                <img src="${item.imagem}" alt="${item.nome}" class="imagemProduto">
                <div>
                    <b>${item.nome}</b><br>
                    <span class="preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <div class="controle">
                <button onclick="atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                <span>${item.quantidade}</span>
                <button onclick="atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                <span class="subtotal">Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="remover" onclick="removerDoCarrinho('${item.id}')">Remover</button>
        `;
        listaCarrinho.appendChild(itemDiv);
    });

    totalElement.innerText = `Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
}

// Finaliza a compra e direciona para o WhatsApp
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const seuNumeroWhatsApp = "5581984376945"; // Seu número de WhatsApp completo
    let mensagemWhatsApp = "Olá! Gostaria de finalizar a compra dos seguintes itens:\n\n";
    let totalGeral = 0;

    carrinho.forEach(item => {
        const subtotalItem = item.preco * item.quantidade;
        mensagemWhatsApp += `* ${item.nome} (x${item.quantidade}) - R$ ${item.preco.toFixed(2).replace('.', ',')} cada = R$ ${subtotalItem.toFixed(2).replace('.', ',')}\n`;
        // Se quiser incluir o link da imagem, descomente as linhas abaixo
        // if (item.imagem) {
        //     mensagemWhatsApp += `  Link da Imagem: ${item.imagem}\n`;
        // }
        totalGeral += subtotalItem;
    });

    mensagemWhatsApp += `\nTotal da Compra: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n`;
    mensagemWhatsApp += "\nAguardando seu contato para combinar o pagamento e a entrega!";


    const mensagemCodificada = encodeURIComponent(mensagemWhatsApp);
    const urlWhatsApp = `https://wa.me/${seuNumeroWhatsApp}?text=${mensagemCodificada}`;

    window.open(urlWhatsApp, '_blank'); // Abre em uma nova aba

    // Mantém o carrinho e a página como estão, sem limpar ou redirecionar a página atual, conforme solicitado.
}

// --- Funções de Navegação e Outras ---

// Atualiza o contador de itens no ícone do carrinho
function atualizarContador() {
    let contador = document.getElementById("contador");
    if(!contador) return; // Pode não existir em todas as páginas
    let total = carrinho.reduce((acc, p) => acc + p.quantidade, 0);
    contador.innerText = total;
}

// Abre a página do carrinho
function abrirCarrinho() {
    window.location.href = "carrinho.html";
}

// Voltar para a página anterior do histórico do navegador
function voltarPagina(){
    window.history.back();
}

// Abre a página de administração (login)
function abrirAdmin(){
    window.location.href = "admin.html";
}


// --- Torna funções globais para acesso via HTML inline ---
// Estas linhas são CRÍTICAS para que as funções possam ser chamadas diretamente do HTML (onclick)
window.adicionarCarrinho = adicionarCarrinho;
window.salvarCarrinho = salvarCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidade = atualizarQuantidade;
window.renderizarCarrinho = renderizarCarrinho;
window.finalizarCompra = finalizarCompra;
window.atualizarContador = atualizarContador;
window.abrirCarrinho = abrirCarrinho;
window.voltarPagina = voltarPagina;
window.abrirAdmin = abrirAdmin;


// Inicializa o contador do carrinho quando a página é carregada
// Garante que o contador apareça em todas as páginas que carregam script.js e tenham um #contador
document.addEventListener("DOMContentLoaded", atualizarContador);
