// Arquivo JavaScript da fase 2.
// Aqui ficam as rotinas que deixam a página mais dinâmica e interativa.

const relogio = document.getElementById('relogio');
const dataAgendamento = document.getElementById('dataAgendamento');
const horaAgendamento = document.getElementById('horaAgendamento');
const grupoEnderecoColeta = document.getElementById('grupoEnderecoColeta');
const enderecoColeta = document.getElementById('enderecoColeta');
const resumoAgendamento = document.getElementById('resumoAgendamento');
const listaAgendamentos = document.getElementById('listaAgendamentos');

const formCadastro = document.getElementById('formCadastro');
const formAgendamento = document.getElementById('formAgendamento');

const camposResumo = [
  'nomeCliente',
  'nomePet',
  'servico',
  'dataAgendamento',
  'horaAgendamento',
  'enderecoColeta'
];

// Mostra data e hora atual em tempo real.
function atualizarRelogio() {
  const agora = new Date();
  relogio.textContent = `Data e hora atuais: ${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
}

// Define a data mínima do agendamento como hoje.
function definirDataMinima() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  dataAgendamento.min = `${ano}-${mes}-${dia}`;
}

// Exibe ou oculta o campo de endereço de coleta.
function atualizarFormaAtendimento() {
  const teleBuscaSelecionada = document.getElementById('teleBusca').checked;

  grupoEnderecoColeta.classList.toggle('d-none', !teleBuscaSelecionada);
  enderecoColeta.required = teleBuscaSelecionada;

  if (!teleBuscaSelecionada) {
    enderecoColeta.value = '';
  }

  atualizarResumo();
}

// Monta o resumo lateral conforme o usuário digita.
function atualizarResumo() {
  const nomeCliente = document.getElementById('nomeCliente').value || '—';
  const nomePet = document.getElementById('nomePet').value || '—';
  const servico = document.getElementById('servico').value || '—';
  const data = dataAgendamento.value || '—';
  const hora = horaAgendamento.value || '—';
  const forma = document.querySelector('input[name="formaAtendimento"]:checked')?.value || '—';
  const coleta = enderecoColeta.value || 'Não se aplica';

  resumoAgendamento.innerHTML = `
    <p><strong>Cliente:</strong> ${nomeCliente}</p>
    <p><strong>Pet:</strong> ${nomePet}</p>
    <p><strong>Serviço:</strong> ${servico}</p>
    <p><strong>Forma de atendimento:</strong> ${forma}</p>
    <p><strong>Data:</strong> ${data}</p>
    <p><strong>Horário:</strong> ${hora}</p>
    <p><strong>Endereço de coleta:</strong> ${coleta}</p>
  `;
}

// Valida se a data/hora não ficou no passado.
function horarioValido() {
  if (!dataAgendamento.value || !horaAgendamento.value) return false;

  const dataHoraEscolhida = new Date(`${dataAgendamento.value}T${horaAgendamento.value}`);
  return dataHoraEscolhida >= new Date();
}

// Salva agendamento no localStorage para simular persistência no navegador.
function salvarAgendamento(event) {
  event.preventDefault();

  // Aplica estilo visual de validação do Bootstrap.
  formCadastro.classList.add('was-validated');
  formAgendamento.classList.add('was-validated');

  const cadastroValido = formCadastro.checkValidity();
  const agendamentoValido = formAgendamento.checkValidity();

  if (!cadastroValido || !agendamentoValido || !horarioValido()) {
    if (!horarioValido() && dataAgendamento.value && horaAgendamento.value) {
      alert('Escolha uma data e horário atuais ou futuros para o atendimento.');
    }
    return;
  }

  const agendamento = {
    cliente: document.getElementById('nomeCliente').value,
    pet: document.getElementById('nomePet').value,
    servico: document.getElementById('servico').value,
    forma: document.querySelector('input[name="formaAtendimento"]:checked').value,
    data: dataAgendamento.value,
    hora: horaAgendamento.value,
    coleta: enderecoColeta.value || 'Entrega no local'
  };

  const agendamentos = JSON.parse(localStorage.getItem('petplanet_agendamentos') || '[]');
  agendamentos.push(agendamento);
  localStorage.setItem('petplanet_agendamentos', JSON.stringify(agendamentos));

  renderizarAgendamentos();
  atualizarResumo();
  alert('Agendamento salvo com sucesso!');
}

// Renderiza a lista de agendamentos já salvos.
function renderizarAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem('petplanet_agendamentos') || '[]');
  listaAgendamentos.innerHTML = '';

  if (agendamentos.length === 0) {
    listaAgendamentos.innerHTML = '<li class="list-group-item">Nenhum agendamento salvo.</li>';
    return;
  }

  agendamentos.forEach((item, indice) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <strong>${indice + 1}. ${item.pet}</strong> — ${item.servico}<br>
      Tutor(a): ${item.cliente}<br>
      ${item.data} às ${item.hora} • ${item.forma}
    `;
    listaAgendamentos.appendChild(li);
  });
}

// Limpa os agendamentos salvos no navegador.
function limparAgendamentos() {
  localStorage.removeItem('petplanet_agendamentos');
  renderizarAgendamentos();
}

// Eventos dos inputs para atualizar o resumo em tempo real.
[
  document.getElementById('nomeCliente'),
  document.getElementById('nomePet'),
  document.getElementById('servico'),
  dataAgendamento,
  horaAgendamento,
  enderecoColeta
].forEach((campo) => {
  campo.addEventListener('input', atualizarResumo);
  campo.addEventListener('change', atualizarResumo);
});

document.getElementById('teleBusca').addEventListener('change', atualizarFormaAtendimento);
document.getElementById('entregaLocal').addEventListener('change', atualizarFormaAtendimento);

formAgendamento.addEventListener('submit', salvarAgendamento);
document.getElementById('limparAgendamentos').addEventListener('click', limparAgendamentos);

setInterval(atualizarRelogio, 1000);
atualizarRelogio();
definirDataMinima();
atualizarFormaAtendimento();
atualizarResumo();
renderizarAgendamentos();
