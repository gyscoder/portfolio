const produtos = [];
const jsonInput = document.getElementById("jsonInput");
const btnCarregar = document.getElementById("btnCarregar");
const listaProdutos = document.getElementById("listaProdutos");
const jsonSaida = document.getElementById("jsonSaida");
const form = document.getElementById("formProduto");

const imgPreview = document.getElementById("preview");
const imgInput = document.getElementById("imagem");

imgInput.addEventListener("input", () => {
  const url = imgInput.value.trim();
  if (!url) {
    imgPreview.innerHTML =
      "<div class='animate-pulse w-full h-full bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 rounded'></div>";
    return;
  }
  imgPreview.innerHTML =
    `<img src="${url}" class="h-full w-full object-contain rounded" alt="Prévia da imagem">`;
});

function validarPreco(valor) {
  return /^\d+(\,\d{1,2})?$/.test(valor);
}

function validarWhatsapp(numero) {
  return /^\d{10,13}$/.test(numero);
}

btnCarregar.addEventListener("click", () => {
  try {
    const data = JSON.parse(jsonInput.value);
    if (!Array.isArray(data)) throw new Error("JSON inválido: Deve ser um array.");
    produtos.length = 0;
    produtos.push(...data);
    atualizarLista();
    atualizarSaida();
    showToast("Produtos carregados com sucesso!", "success");
  } catch (e) {
    showToast("Erro ao carregar JSON: " + e.message, "error");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const preco = document.getElementById("preco").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  let imagem = document.getElementById("imagem").value.trim();

  if (!validarPreco(preco)) {
    showToast("Preço inválido. Use o formato 49,90", "warning");
    return;
  }

  if (!validarWhatsapp(whatsapp)) {
    showToast("Número de WhatsApp inválido. Use apenas números com DDD (ex: 5581999999999)", "warning");
    return;
  }

  const imagemValida = await verificarImagem(imagem);
  if (!imagemValida) {
    showToast("Imagem inválida. Será usada a imagem padrão.", "warning");
    imagem = "imagens/default.png";
  }

  const produto = {
    nome: document.getElementById("nome").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    preco,
    imagem,
    whatsapp,
    mensagem: document.getElementById("mensagem").value.trim(),
  };

  produtos.push(produto);
  atualizarLista();
  atualizarSaida();
  form.reset();
  imgPreview.textContent = "Pré-visualização da imagem";

  showToast("Produto adicionado com sucesso!", "success");
});

function atualizarLista() {
  listaProdutos.innerHTML = "";
  produtos.forEach((produto, index) => {
    const li = document.createElement("li");
    li.className = "border p-3 rounded flex justify-between items-center bg-slate-700 text-slate-100";

    const divInfo = document.createElement("div");
    const nome = document.createElement("strong");
    nome.textContent = produto.nome;
    const preco = document.createTextNode(` - R$ ${produto.preco}`);
    const br = document.createElement("br");
    const descricao = document.createElement("small");
    descricao.textContent = produto.descricao;

    divInfo.appendChild(nome);
    divInfo.appendChild(preco);
    divInfo.appendChild(br);
    divInfo.appendChild(descricao);

    const divBtns = document.createElement("div");
    divBtns.className = "space-x-2";

    const btnEditar = document.createElement("button");
    btnEditar.className = "editar bg-yellow-400 px-2 py-1 rounded text-sm hover:bg-yellow-500";
    btnEditar.textContent = "Editar";

    const btnRemover = document.createElement("button");
    btnRemover.className = "remover bg-red-500 px-2 py-1 rounded text-sm text-white hover:bg-red-600";
    btnRemover.textContent = "Remover";

    btnEditar.onclick = () => {
      document.getElementById("nome").value = produto.nome;
      document.getElementById("descricao").value = produto.descricao;
      document.getElementById("preco").value = produto.preco;
      document.getElementById("imagem").value = produto.imagem;
      document.getElementById("whatsapp").value = produto.whatsapp;
      document.getElementById("mensagem").value = produto.mensagem;
      produtos.splice(index, 1);
      atualizarLista();
      atualizarSaida();
    };

    btnRemover.onclick = () => {
      produtos.splice(index, 1);
      atualizarLista();
      atualizarSaida();
      showToast("Produto removido.", "info");
    };

    divBtns.appendChild(btnEditar);
    divBtns.appendChild(btnRemover);

    li.appendChild(divInfo);
    li.appendChild(divBtns);

    listaProdutos.appendChild(li);
  });
}


function atualizarSaida() {
  jsonSaida.textContent = JSON.stringify(produtos, null, 2);
  jsonInput.value = jsonSaida.textContent;
}

function baixarJSON() {
  const blob = new Blob([JSON.stringify(produtos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "produtos.json";
  a.click();
  URL.revokeObjectURL(url);
}

function verificarImagem(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function copiarJSON() {
  const json = document.getElementById("jsonSaida").textContent;
  navigator.clipboard.writeText(json).then(() => {
    showToast("JSON copiado para a área de transferência!", "success");
  }).catch(err => {
    showToast("Erro ao copiar JSON: " + err, "error");
  });
}

/* Funções de toast */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');

  const colors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-600'
  };

  const toast = document.createElement('div');
  toast.className = `
    toast-show
    ${colors[type] || colors.info}
    text-white
    px-4 py-2 rounded shadow-lg
    cursor-pointer
    max-w-xs
    select-none
    flex items-center
  `;
  toast.textContent = message;

  toast.onclick = () => {
    hideToast(toast);
  };

  container.appendChild(toast);

  setTimeout(() => {
    hideToast(toast);
  }, duration);
}

function hideToast(toast) {
  toast.classList.remove('toast-show');
  toast.classList.add('toast-hide');

  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}
