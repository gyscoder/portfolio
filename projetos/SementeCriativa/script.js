const campo = document.getElementById('campo-ideias');
const inputIdeia = document.getElementById('input-ideia');
const btnEnviar = document.getElementById('btn-enviar');
const jardim = document.getElementById('jardim');

let ideias = JSON.parse(localStorage.getItem('ideiasPlantadas')) || [];
let ideiasColhidas = JSON.parse(localStorage.getItem('ideiasColhidas')) || [];

const falasColher = ["Até logo!", "Obrigado!", "Volto logo!", "Fui 🌿", "Tchauzinho 👋"];

function salvarIdeias() {
    localStorage.setItem('ideiasPlantadas', JSON.stringify(ideias));
}

function salvarColhidas() {
    localStorage.setItem('ideiasColhidas', JSON.stringify(ideiasColhidas));
}

function atualizarJardim() {
    jardim.innerHTML = '';
    ideiasColhidas.forEach(txt => {
        const pote = document.createElement('div');
        pote.className = "vaso";
        pote.innerHTML = `🌱<br>${txt}`;
        pote.addEventListener('click', () => {
            if (!ideias.find(i => i.texto === txt)) {
                ideias.push({ texto: txt });
                salvarIdeias();
                criarPlanta(txt);
            }
        });
        jardim.appendChild(pote);
    });
}

function criarPlanta(texto) {
    const personagem = document.createElement('div');
    personagem.classList.add('personagem');
    personagem.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/620/620851.png')";

    personagem.style.left = `${Math.random() * (campo.clientWidth - 60)}px`;
    personagem.style.top = `${Math.random() * (campo.clientHeight - 220)}px`;

    campo.appendChild(personagem);

    setTimeout(() => {
        personagem.classList.add('crescendo');
    }, 100);

    let andando = true;
    let plantada = false;
    let timerPlantar;

    function moverAleatorio() {
        if (!andando) return;
        const maxX = campo.clientWidth - 60;
        const maxY = campo.clientHeight - 220;
        const novoX = Math.random() * maxX;
        const novoY = Math.random() * maxY;

        personagem.style.left = `${novoX}px`;
        personagem.style.top = `${novoY}px`;

        // Continua andando enquanto não plantar
        setTimeout(moverAleatorio, 3000);
    }

    function iniciarPlantar() {
        andando = false;
        plantada = true;
        personagem.style.transform = 'scale(1.1)';
        setTimeout(() => {
            personagem.style.transform = 'scale(1)';
        }, 800);
    }

    personagem.addEventListener('mouseenter', () => {
        if (!plantada) {
            const maxX = campo.clientWidth - 60;
            const maxY = campo.clientHeight - 220;
            const novoX = Math.random() * maxX;
            const novoY = Math.random() * maxY;

            personagem.style.transform = 'scale(1.3)';
            setTimeout(() => {
                personagem.style.left = `${novoX}px`;
                personagem.style.top = `${novoY}px`;
                personagem.style.transform = 'scale(1)';
            }, 300);

            clearTimeout(timerPlantar);
            timerPlantar = setTimeout(iniciarPlantar, 5000);
        }
    });

    personagem.addEventListener('click', () => {
        if (!plantada) return;

        const fala = document.createElement('div');
        fala.classList.add('fala');
        fala.innerText = falasColher[Math.floor(Math.random() * falasColher.length)];
        personagem.appendChild(fala);

        ideias = ideias.filter(ideia => ideia.texto !== texto);
        ideiasColhidas.push(texto);
        salvarIdeias();
        salvarColhidas();
        atualizarJardim();

        setTimeout(() => {
            personagem.remove();
        }, 1500);
    });

    moverAleatorio();
    timerPlantar = setTimeout(iniciarPlantar, 8000); // Planta sozinho depois de 8s parado
}

btnEnviar.addEventListener('click', () => {
    const texto = inputIdeia.value.trim();
    if (texto && !ideias.find(i => i.texto === texto)) {
        ideias.push({ texto });
        salvarIdeias();
        criarPlanta(texto);
        inputIdeia.value = '';
        inputIdeia.focus();
    } else {
        alert('Digite uma ideia única!');
    }
});

ideias.forEach(ideia => {
    criarPlanta(ideia.texto);
});

atualizarJardim();
