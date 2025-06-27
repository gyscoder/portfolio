fetch('produtos.json')
  .then(response => response.json())
  .then(produtos => {
    const container = document.getElementById('produtos');
    container.innerHTML = ''; // limpa container

    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.className = "bg-white rounded-lg shadow-md p-4";
    
      const imgUrl = produto.imagem && produto.imagem.trim() !== ''
        ? `<img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover rounded" />` 
        : `<div class="placeholder-img"></div>`;
    
      card.innerHTML = `
        ${imgUrl}
        <h2 class="mt-4 text-xl font-semibold">${produto.nome}</h2>
        <p class="text-gray-600">${produto.descricao}</p>
        <p class="text-indigo-600 font-bold text-lg mt-2">R$ ${produto.preco}</p>
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
