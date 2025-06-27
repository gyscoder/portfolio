fetch('produtos.json')
  .then(response => response.json())
  .then(produtos => {
    const container = document.getElementById('produtos');
    container.innerHTML = ''; // limpa container

    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.className = "bg-slate-800 rounded-xl shadow-md p-4 text-slate-100 transition hover:scale-[1.02]";

      // Usa imagem padrão se estiver vazia ou inválida
      const imgUrl = produto.imagem && produto.imagem.trim() !== ''
        ? produto.imagem
        : 'imagens/default.png';

      card.innerHTML = `
        <div class="w-full h-48 bg-slate-700 rounded overflow-hidden flex items-center justify-center mb-3">
          <img src="${imgUrl}" alt="${produto.nome}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='imagens/default.png';" />
        </div>
        <h2 class="text-xl font-semibold">${produto.nome}</h2>
        <p class="text-slate-300 text-sm mt-1">${produto.descricao}</p>
        <p class="text-indigo-400 font-bold text-lg mt-2">R$ ${produto.preco}</p>
        <a href="https://wa.me/${produto.whatsapp}?text=${encodeURIComponent(produto.mensagem)}"
           class="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
           target="_blank" rel="noopener noreferrer">
           Falar no WhatsApp
        </a>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar produtos:", error);
  });
