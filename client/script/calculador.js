const formulario = document.querySelector('.purgaForm');
const btnFormulario = document.querySelector('.btnFormulario');
const resultado = document.querySelector('.resultado');

//pega dados do formulario, e avisa caso algum campo não tenha sido preenchido
btnFormulario.addEventListener('click', () => {
  const comprimento = formulario.elements['comprimento'].value;
  const diametro = formulario.elements['diametro'].value;
  const vazao = formulario.elements['vazao'].value;
  if (comprimento && diametro && vazao) {
    //caso todos estejam preenchido
    formulario.reset();
    formulario.querySelector('.aviso').classList.remove('ativo');
    const tempo = calculoPurga(comprimento, diametro, vazao);
    // coloca resultado na tela
    mostrarResultado(tempo, diametro);
  } else {
    //caso algum esteja vazio
    formulario.querySelector('.aviso').classList.add('ativo');
  }
});

//calculo do tempo
function calculoPurga(comprimento, diametro, vazao) {
  // transformando diamentro(polegada)em metros
  const convertDiamentro = diametro / 39.37;
  // Calcular o volume do tubo em metros cúbicos
  const convertComprimento =
    Math.PI * Math.pow(convertDiamentro / 2, 2) * comprimento;

  //convertendo vazão para metros cubicos por minuto
  const convertVazao = vazao / 1000;
  //calculo do tempo usado fator de segurança de 5(o faotr 5 e uma norma de segurança da solda)
  const fatorDeSeguranca = 5;
  let tempoPurga = (fatorDeSeguranca * convertComprimento) / convertVazao;

  // sempre manter pelo menos 5 minutos de purga
  if (tempoPurga < 5) {
    tempoPurga = 5;
  }

  return tempoPurga;
}

// testando função add animação
function mostrarResultado(tempo, diamentro) {
  resultado.classList.add('mostrarResultado');
  const tempoHtml = resultado.querySelector('.tempo span');
  const vazaoHtml = resultado.querySelector('.vazao span');
  tempoHtml.innerText = tempo.toFixed(2) + ' min';
  if (diamentro <= 1) {
    vazaoHtml.innerHTML = '2 a 10L/min';
  } else if (diamentro >= 2 && diamentro <= 6) {
    vazaoHtml.innerHTML = '15 a 25L/min';
  } else if (diamentro > 6) {
    vazaoHtml.innerHTML = '20 a 40L/min';
  }
}
// CRONOMETRO

const avisoCalculo = document.querySelector('.cronometro .aviso');
const startStopBtn = document.querySelector('#startStopBtn');
const resetBtn = document.querySelector('#resetBtn');
const timer = document.querySelector('#minutes');

let timerInterval;
let timerRunning = false;
let milissegundos = 0;

//contagem de tempo, quando chega no tempo calculado aparece um modal
function atualizarCronometro(tempoPurga) {
  const segundos = Math.floor(milissegundos / 1000);
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  const milissegundosRestantes = Math.floor((milissegundos % 1000) / 10);

  timer.innerText = `${minutos.toString().padStart(2, '0')}:${segundosRestantes
    .toString()
    .padStart(2, '0')}:${milissegundosRestantes.toString().padStart(2, '0')}`;
  if (minutos === parseInt(tempoPurga)) {
    pararCronometro();
    modal.classList.add('ativo');
  }
}

// alterar o nome do btn inicia e pausa o tempo
function alternarCronometro() {
  let tempoPurga = document.querySelector('.tempo span').innerText;

  //se não calcular o tempo não inicia cronometro
  if (!tempoPurga) {
    avisoCalculo.classList.add('ativo');
    return;
  }
  btnFormulario.disabled = true;
  avisoCalculo.classList.remove('ativo');

  if (!timerRunning) {
    iniciarCronometro(tempoPurga);
    startStopBtn.innerText = 'Pausar';
  } else {
    pararCronometro();
    startStopBtn.innerText = 'Iniciar ';
  }
}

//iniciar contagem de tempo
function iniciarCronometro(tempoPurga) {
  timerRunning = true;

  timerInterval = setInterval(() => {
    milissegundos += 10;
    atualizarCronometro(tempoPurga);
  }, 10);
}

//pausa contagem de tempo
function pararCronometro() {
  clearInterval(timerInterval);
  timerRunning = false;
}
//reseta cronometro reativa botão de calculo
function resetarCronometro() {
  clearInterval(timerInterval);
  timerRunning = false;
  milissegundos = 0;
  timer.innerText = '00:00:00';
  startStopBtn.innerText = 'Iniciar';
  btnFormulario.disabled = false;
  // apagar campos do resultado
}

startStopBtn.addEventListener('click', alternarCronometro);

resetBtn.addEventListener('click', resetarCronometro);

// FECHAR MODAL
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.iconX');

closeModal.addEventListener('click', (close) => {
  modal.classList.remove('ativo');
  resetarCronometro();
});
