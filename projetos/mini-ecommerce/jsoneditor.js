const produtos = [];
const jsonInput = document.getElementById("jsonInput");
const btnCarregar = document.getElementById("btnCarregar");
const listaProdutos = document.getElementById("listaProdutos");
const jsonSaida = document.getElementById("jsonSaida");
const form = document.getElementById("formProduto");

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
    alert("Produtos carregados com sucesso!");
  } catch (e) {
    alert("Erro ao carregar JSON: " + e.message);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const preco = document.getElementById("preco").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();

  if (!validarPreco(preco)) {
    alert("Preço inválido. Use o formato 49,90");
    return;
  }

  if (!validarWhatsapp(whatsapp)) {
    alert("Número de WhatsApp inválido. Use apenas números com DDD (ex: 5581999999999)");
    return;
  }

  const produto = {
    nome: document.getElementById("nome").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    preco,
    imagem: document.getElementById("imagem").value.trim(),
    whatsapp,
    mensagem: document.getElementById("mensagem").value.trim(),
  };
  produtos.push(produto);
  atualizarLista();
  atualizarSaida();
  form.reset();
});

function atualizarLista() {
  listaProdutos.innerHTML = "";
  produtos.forEach((produto, index) => {
    const li = document.createElement("li");
    li.className = "border p-3 rounded flex justify-between items-center bg-gray-50";

    // Div com as informações do produto
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

    // Div com os botões editar e remover
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