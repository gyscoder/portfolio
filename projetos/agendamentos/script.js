const form = document.getElementById("formAgendamento");
const lista = document.getElementById("listaAgendamentos");
const msgConfirmacao = document.getElementById("mensagemConfirmacao");
const btnExportar = document.getElementById("btnExportar");
const agendamentos = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  // Validações
  if (!nome) {
    alert("Por favor, insira o nome do cliente.");
    return;
  }

  if (!/^\d{10,13}$/.test(telefone)) {
    alert("Telefone inválido. Use apenas números, incluindo DDD. Ex: 81999999999");
    return;
  }

  if (!servico) {
    alert("Selecione um serviço.");
    return;
  }

  if (!data) {
    alert("Selecione uma data.");
    return;
  }

  const dataHoje = new Date().toISOString().split("T")[0];
  if (data < dataHoje) {
    alert("A data deve ser hoje ou futura.");
    return;
  }

  if (!hora) {
    alert("Barbearia abre após 07:00");
    return;
  }

    // Verifica se hora é >= 07:00
    const horaSelecionada = parseInt(hora.split(":")[0]);
    if (horaSelecionada < 7) {
      alert("O horário deve ser a partir das 07:00.");
      return;
    }

  const agendamento = { 
    Cliente: nome, 
    Telefone: telefone, 
    Serviço: servico, 
    Data: data, 
    Hora: hora 
  };
  agendamentos.push(agendamento);

  atualizarLista();
  form.reset();
  msgConfirmacao.classList.remove("hidden");

  setTimeout(() => {
    msgConfirmacao.classList.add("hidden");
  }, 3000);
});

function atualizarLista() {
  lista.innerHTML = "";
  agendamentos.forEach((ag) => {
    const li = document.createElement("li");
    li.className = "bg-gray-50 border rounded p-3 shadow-sm";

    li.innerHTML = `
      <strong>${ag.Cliente}</strong> - ${ag.Serviço}<br>
      📅 ${ag.Data} às ${ag.Hora} <br>
      📞 ${ag.Telefone}
    `;
    lista.appendChild(li);
  });
}

function exportarAgendamentos() {
  if (agendamentos.length === 0) {
    alert("Nenhum agendamento para exportar.");
    return;
  }
  
  const blob = new Blob([JSON.stringify(agendamentos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "agendamentos.json";
  a.click();
  URL.revokeObjectURL(url);
}
