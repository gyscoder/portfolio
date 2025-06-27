const produtos = [];
const form = document.getElementById("formProduto");
const saida = document.getElementById("jsonSaida");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const produto = {
    nome: document.getElementById("nome").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    preco: document.getElementById("preco").value.trim(),
    imagem: document.getElementById("imagem").value.trim(),
    whatsapp: document.getElementById("whatsapp").value.trim(),
    mensagem: document.getElementById("mensagem").value.trim(), // novo campo
  };

  produtos.push(produto);
  atualizarSaida();

  form.reset();
});

function atualizarSaida() {
  saida.textContent = JSON.stringify(produtos, null, 2);
}
