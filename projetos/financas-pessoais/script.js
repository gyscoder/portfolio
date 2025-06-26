const form = document.getElementById("formTransacao");
const lista = document.getElementById("listaTransacoes");
const totalReceitas = document.getElementById("totalReceitas");
const totalDespesas = document.getElementById("totalDespesas");
const saldoEl = document.getElementById("saldo");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let logs = [];

function atualizarUI() {
  lista.innerHTML = "";
  let receitas = 0;
  let despesas = 0;

  transacoes.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = `bg-${t.tipo === "Receita" ? "green" : "red"}-50`;
    li.innerHTML = `
      <span>${t.categoria} (${t.tipo})</span>
      <span>R$ ${t.valor.toFixed(2)}</span>
      <button onclick="removerTransacao(${index})" class="ml-4 text-sm text-red-600 hover:underline">Remover</button>
    `;
    lista.appendChild(li);

    if (t.tipo === "Receita") receitas += t.valor;
    else despesas += t.valor;
  });

  totalReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
  totalDespesas.textContent = `R$ ${despesas.toFixed(2)}`;
  const saldo = receitas - despesas;
  saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;
  saldoEl.className = `valor ${saldo >= 0 ? "verde" : "vermelho"}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const tipo = form.tipo.value;
  const categoria = form.categoria.value;
  const valor = parseFloat(form.valor.value);
  if (!tipo || !categoria || !valor) return;

  const nova = { tipo, categoria, valor };
  transacoes.push(nova);
  logs.push(`[ADICIONADO] ${tipo} - ${categoria} - R$ ${valor.toFixed(2)} - ${new Date().toLocaleString()}`);

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizarUI();
  form.reset();
});

function removerTransacao(index) {
  const removida = transacoes[index];
  logs.push(`[REMOVIDO] ${removida.tipo} - ${removida.categoria} - R$ ${removida.valor.toFixed(2)} - ${new Date().toLocaleString()}`);

  transacoes.splice(index, 1);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizarUI();
}

function baixarLog() {
  if (logs.length === 0) {
    alert("Nenhuma ação registrada ainda.");
    return;
  }

  const blob = new Blob([logs.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "log_transacoes.txt";
  link.click();
  URL.revokeObjectURL(url);
}

window.removerTransacao = removerTransacao;
window.baixarLog = baixarLog;

atualizarUI();
