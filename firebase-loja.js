// firebase-loja.js

import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export async function carregarGravatas(categoria) {
  const produtosContainer = document.getElementById("produtos"); // Este é o <section class="catalogo" id="produtos">
  const loadingSpinner = document.getElementById("loading-spinner");
  let produtosListagem = document.getElementById("produtos-listagem");

  if (!produtosContainer || !loadingSpinner) {
    console.error("Elemento 'produtos' ou 'loading-spinner' não encontrado.");
    return;
  }

  // Se produtosListagem ainda não existe, cria um div dentro de produtosContainer para os produtos
  if (!produtosListagem) {
    produtosListagem = document.createElement("div");
    produtosListagem.id = "produtos-listagem";
    // --- NOVOS ESTILOS PARA SCROLL HORIZONTAL ---
    produtosListagem.style.display = 'flex'; // Usar flexbox
    produtosListagem.style.flexWrap = 'nowrap'; // IMPEDIR QUE OS ITENS QUEBREM A LINHA
    produtosListagem.style.gap = '20px'; // Manter o gap entre os produtos
    produtosListagem.style.overflowX = 'auto'; // Habilitar o scroll horizontal
    produtosListagem.style.paddingLeft = '30px'; // Adicionar padding nas laterais
    produtosListagem.style.paddingRight = '30px'; // para que os itens não fiquem colados nas bordas
    produtosListagem.style.paddingBottom = '20px'; // Espaço para a barra de rolagem
    // --- FIM DOS NOVOS ESTILOS ---

    // Removemos os estilos de grid que estavam aqui, pois agora usamos flexbox
    // e o max-width/margin para centralizar será gerenciado pelo .catalogo no CSS

    produtosContainer.appendChild(produtosListagem);
  }

  produtosListagem.innerHTML = ''; // Limpa o conteúdo existente da listagem
  loadingSpinner.style.display = 'block'; // Mostra o spinner

  try {
    const q = query(collection(db, "gravatas"), where("categoria", "==", categoria));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Ajusta o padding para a mensagem de nenhum produto
      produtosListagem.innerHTML = '<p style="padding: 20px; text-align: center;">Nenhum produto encontrado nesta categoria.</p>';
      produtosListagem.style.justifyContent = 'center'; // Centraliza a mensagem
    } else {
      produtosListagem.style.justifyContent = 'flex-start'; // Volta ao normal
      querySnapshot.forEach((doc) => {
        const produto = doc.data();
        const produtoDiv = document.createElement("div");
        produtoDiv.classList.add("produto");
        // --- NOVOS ESTILOS PARA GARANTIR QUE OS ITENS NÃO ENCOLHAM ---
        produtoDiv.style.minWidth = '200px'; // Garante uma largura mínima para cada card
        produtoDiv.style.flexShrink = '0'; // Impede que o item encolha abaixo do min-width
        // --- FIM DOS NOVOS ESTILOS ---

        produtoDiv.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" class="foto">
          <h3>${produto.nome}</h3>
          <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
          <button class="comprar" onclick="adicionarCarrinho('${doc.id}', '${produto.nome}', ${produto.preco}, '${produto.imagem}')">
            Adicionar ao Carrinho
          </button>
        `;
        produtosListagem.appendChild(produtoDiv);
      });
    }
  } catch (e) {
    console.error("Erro ao carregar gravatas: ", e);
    produtosListagem.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>';
  } finally {
    loadingSpinner.style.display = 'none';
  }
}
