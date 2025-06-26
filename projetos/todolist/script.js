const form = document.getElementById("todoForm");
const input = document.getElementById("novaTarefa");
const lista = document.getElementById("listaTarefas");
const contadorGeral = document.getElementById("contadorGeral");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let log = JSON.parse(localStorage.getItem("log")) || [];
let filtroAtual = "todas";
let submenuAbertoId = null;

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  localStorage.setItem("log", JSON.stringify(log));
}

// Função para ler cor HEX e retornar array RGB
function lerRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Função para converter RGB para HEX
function rgbParaHex(r, g, b) {
  const toHex = (c) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Interpola a cor entre corInicial e corFinal conforme percentual (0-100)
function corInterpolada(percentual, corInicialHex, corFinalHex) {
  const corInicial = lerRGB(corInicialHex);
  const corFinal = lerRGB(corFinalHex);

  const r = Math.round(corInicial[0] + (corFinal[0] - corInicial[0]) * (percentual / 100));
  const g = Math.round(corInicial[1] + (corFinal[1] - corInicial[1]) * (percentual / 100));
  const b = Math.round(corInicial[2] + (corFinal[2] - corInicial[2]) * (percentual / 100));

  return rgbParaHex(r, g, b);
}

// Gera cor HEX aleatória suave (tons pastéis)
function corAleatoriaSuave() {
  const r = Math.floor(Math.random() * 128) + 64; // entre 64 e 191
  const g = Math.floor(Math.random() * 128) + 64;
  const b = Math.floor(Math.random() * 128) + 64;
  return rgbParaHex(r, g, b);
}

function calcularProgresso(subtarefas) {
  if (!subtarefas || subtarefas.length === 0) return 0;
  const feitas = subtarefas.filter(st => st.feita).length;
  return Math.round((feitas / subtarefas.length) * 100);
}

function atualizarContador() {
  const total = tarefas.length;
  const concluídas = tarefas.filter(t => t.feita).length;
  contadorGeral.textContent = `Tarefas: ${concluídas} concluídas de ${total} no total`;
}

function atualizarLista() {
  lista.innerHTML = "";

  const filtradas = tarefas.filter(t => {
    if (filtroAtual === "todas") return true;
    if (filtroAtual === "ativas") return !t.feita;
    if (filtroAtual === "concluidas") return t.feita;
  });

  filtradas.forEach(tarefa => {
    const progresso = calcularProgresso(tarefa.subtarefas);

    // Define cores padrão caso não existam (para tarefas antigas)
    if (!tarefa.corInicial) tarefa.corInicial = corAleatoriaSuave();
    if (!tarefa.corFinal) tarefa.corFinal = corAleatoriaSuave();

    const corBarra = corInterpolada(progresso, tarefa.corInicial, tarefa.corFinal);

    // Auto marcar tarefa feita se todas subtarefas feitas
    if (progresso === 100 && !tarefa.feita) {
      tarefa.feita = true;
      log.push(`[CONCLUÍDA AUTOMÁTICA] "${tarefa.texto}" - ${new Date().toLocaleString()}`);
      salvarTarefas();
    } else if (progresso < 100 && tarefa.feita) {
      tarefa.feita = false;
      log.push(`[REABERTA] "${tarefa.texto}" - ${new Date().toLocaleString()}`);
      salvarTarefas();
    }

    const li = document.createElement("li");
    li.className = `${tarefa.feita ? "bg-green-50 line-through text-gray-500" : "bg-white"}`;

    li.innerHTML = `
    <div class="tarefa-cabecalho">
      <span class="tarefa-texto" onclick="alternar('${tarefa.id}')">${tarefa.texto}</span>
      <button class="botao text-blue-600 btn-toggle-submenu" onclick="toggleSubmenu(event, '${tarefa.id}')">Subtarefas</button>
      <button class="botao text-red-600" onclick="remover('${tarefa.id}')">Remover</button>
    </div>
  
    <div class="submenu hidden" id="submenu-${tarefa.id}">
      <div class="barra-progresso-container">
        <div class="barra-progresso" style="width: ${progresso}%; background-color: ${corBarra};"></div>
      </div>
  
      <ul class="subtarefas-lista">
        ${(tarefa.subtarefas || []).map(st => `
          <li>
            <label>
              <input type="checkbox" onchange="toggleSubtarefa('${tarefa.id}', '${st.id}')" ${st.feita ? "checked" : ""} />
              <span class="${st.feita ? "line-through" : ""}">${st.texto}</span>
            </label>
          </li>
        `).join("")}
      </ul>
  
      <form onsubmit="adicionarSubtarefa(event, '${tarefa.id}')" class="flex gap-2">
        <input type="text" placeholder="Nova subtarefa" required />
        <button class="botao bg-green-600 text-white">Adicionar</button>
      </form>
    </div>
  `;

    lista.appendChild(li);

    if (submenuAbertoId === tarefa.id) {
      const submenu = document.getElementById(`submenu-${tarefa.id}`);
      if (submenu) {
        submenu.classList.remove("hidden");
        submenu.setAttribute("aria-expanded", "true");
      }
    }
  });

  salvarTarefas(); // Salva cores novas caso tenham sido criadas agora
  atualizarContador();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const texto = input.value.trim();
  if (!texto) return;

  const nova = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    texto,
    feita: false,
    subtarefas: [],
    corInicial: corAleatoriaSuave(),
    corFinal: corAleatoriaSuave()
  };
  tarefas.push(nova);
  log.push(`[ADICIONADA] "${texto}" - ${new Date().toLocaleString()}`);
  salvarTarefas();
  filtroAtual = "todas";
  atualizarLista();
  input.value = "";
});

function alternar(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;
  tarefa.feita = !tarefa.feita;
  log.push(`[ALTERADA] "${tarefa.texto}" para ${tarefa.feita ? "Concluída" : "Ativa"} - ${new Date().toLocaleString()}`);
  salvarTarefas();
  filtroAtual = "todas";
  submenuAbertoId = null;
  atualizarLista();
}

function remover(id) {
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) return;
  log.push(`[REMOVIDA] "${tarefas[index].texto}" - ${new Date().toLocaleString()}`);
  tarefas.splice(index, 1);
  salvarTarefas();
  if (submenuAbertoId === id) submenuAbertoId = null;
  atualizarLista();
}

function filtrar(tipo) {
  filtroAtual = tipo;
  submenuAbertoId = null;
  atualizarLista();
}

function toggleSubmenu(event, id) {
  event.stopPropagation();

  if (submenuAbertoId && submenuAbertoId !== id) {
    const submenuAnterior = document.getElementById(`submenu-${submenuAbertoId}`);
    if (submenuAnterior) {
      submenuAnterior.classList.add("hidden");
      submenuAnterior.setAttribute("aria-expanded", "false");
    }
  }

  const submenu = document.getElementById(`submenu-${id}`);
  if (!submenu) return;

  const estaAberto = !submenu.classList.contains("hidden");

  if (estaAberto) {
    submenu.classList.add("hidden");
    submenu.setAttribute("aria-expanded", "false");
    submenuAbertoId = null;
  } else {
    submenu.classList.remove("hidden");
    submenu.setAttribute("aria-expanded", "true");
    submenuAbertoId = id;
  }
}

function toggleSubtarefa(tarefaId, subtarefaId) {
  const tarefa = tarefas.find(t => t.id === tarefaId);
  if (!tarefa) return;
  const subtarefa = tarefa.subtarefas.find(st => st.id === subtarefaId);
  if (!subtarefa) return;
  subtarefa.feita = !subtarefa.feita;
  log.push(`[SUBTAREFA] "${subtarefa.texto}" de "${tarefa.texto}" marcada como ${subtarefa.feita ? "Feita" : "Não feita"} - ${new Date().toLocaleString()}`);
  salvarTarefas();
  atualizarLista();
}

function adicionarSubtarefa(event, tarefaId) {
  event.preventDefault();
  const inputSub = event.target.querySelector("input[type=text]");
  const texto = inputSub.value.trim();
  if (!texto) return;
  const tarefa = tarefas.find(t => t.id === tarefaId);
  if (!tarefa) return;
  const novaSub = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    texto,
    feita: false
  };
  tarefa.subtarefas.push(novaSub);
  log.push(`[SUBTAREFA ADICIONADA] "${texto}" em "${tarefa.texto}" - ${new Date().toLocaleString()}`);
  salvarTarefas();
  atualizarLista();
  inputSub.value = "";
}

// Fecha o submenu se clicar fora
document.addEventListener("click", (event) => {
  if (!submenuAbertoId) return;

  const submenu = document.getElementById(`submenu-${submenuAbertoId}`);
  if (!submenu) return;

  const clicouDentro = submenu.contains(event.target);
  const clicouNoBotao = event.target.closest(".btn-toggle-submenu");

  if (!clicouDentro && !clicouNoBotao) {
    submenu.classList.add("hidden");
    submenu.setAttribute("aria-expanded", "false");
    submenuAbertoId = null;
  }
});

// Função para baixar log em txt
function baixarLog() {
  if (log.length === 0) {
    alert("Nenhum log para baixar.");
    return;
  }
  const conteudo = log.join("\n");
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "log_tarefas.txt";
  a.click();
  URL.revokeObjectURL(url);
}

window.filtrar = filtrar;
window.remover = remover;
window.alternar = alternar;
window.toggleSubmenu = toggleSubmenu;
window.toggleSubtarefa = toggleSubtarefa;
window.adicionarSubtarefa = adicionarSubtarefa;
window.baixarLog = baixarLog;

atualizarLista();
