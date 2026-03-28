// firebase-loja.js

import { db } from "./firebase.js"; // Importa a instância do Firestore
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export async function carregarGravatas(categoria) {
  const produtosContainer = document.getElementById("produtos");
  const loadingSpinner = document.getElementById("loading-spinner");
  let produtosListagem = document.getElementById("produtos-listagem");

  if (!produtosListagem) {
    produtosListagem = document.createElement("div");
    produtosListagem.id = "produtos-listagem";
    produtosListagem.style.display = 'grid';
    produtosListagem.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px,1fr))';
    produtosListagem.style.gap = '20px';
    produtosListagem.style.maxWidth = '1000px';
    produtosListagem.style.margin = 'auto';
    produtosContainer.appendChild(produtosListagem);
  }

  if (!produtosContainer || !loadingSpinner) {
    console.error("Elemento 'produtos' ou 'loading-spinner' não encontrado.");
    return;
  }

  produtosListagem.innerHTML = '';
  loadingSpinner.style.display = 'block';

  try {
    const q = query(collection(db, "gravatas"), where("categoria", "==", categoria));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      produtosListagem.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
    } else {
      querySnapshot.forEach((doc) => {
        const produto = doc.data();
        const produtoDiv = document.createElement("div");
        produtoDiv.classList.add("produto"); // Correção da classe "produto-card" para "produto"

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
