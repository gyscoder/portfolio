const campo = document.getElementById('campo-ideias');
const inputIdeia = document.getElementById('input-ideia');
const btnEnviar = document.getElementById('btn-enviar');
const jardim = document.getElementById('jardim');

let ideias = JSON.parse(localStorage.getItem('ideiasPlantadas')) || [];
let ideiasColhidas = JSON.parse(localStorage.getItem('ideiasColhidas')) || [];

const falasColher = ["Até logo!", "Obrigado!", "Volto logo!", "Fui 🌿", "Tchauzinho 👋"];

const plantas = {
    walk: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Walk/Plant1_Walk_full.png",
    run: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Run/Plant1_Run_full.png",
    idle: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Idle/Plant1_Idle_full.png",
    death: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Death/Plant1_Death_full.png",
    hurt: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Hurt/Plant1_Hurt_full.png"
};

const slimes = {
    walk: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Walk/Slime1_Walk_full.png", // substitua depois pelo caminho real
    run: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Run/Slime1_Run_full.png",   // substitua depois
    idle: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Idle/Slime1_Idle_full.png", // substitua depois
    death: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Death/Slime1_Death_full.png", // substitua depois
    hurt: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Hurt/Slime1_Hurt_full.png" // substitua depois
};

function salvarIdeias() {
    localStorage.setItem('ideiasPlantadas', JSON.stringify(ideias));
}

function salvarColhidas() {
    localStorage.setItem('ideiasColhidas', JSON.stringify(ideiasColhidas));
}

function atualizarJardim() {
    jardim.innerHTML = "<h4>🌻 Jardim</h4>";
    ideiasColhidas.forEach(txt => {
        const pote = document.createElement('div');
        pote.className = "vaso";
        pote.innerText = txt;
        pote.addEventListener('click', () => {
            if (!ideias.find(i => i.texto === txt)) {
                ideias.push({ texto: txt });
                salvarIdeias();
                criarPersonagem(txt);
            }
        });
        jardim.appendChild(pote);
    });
}

function criarPersonagem(texto) {
    const sprite = document.createElement('div');
    sprite.className = "sprite";

    // Decide se será slime ou planta
    const tipo = Math.random() < 0.5 ? "planta" : "slime";
    const skin = tipo === "planta" ? plantas : slimes;

    sprite.dataset.walk = skin.walk;
    sprite.dataset.run = skin.run;
    sprite.dataset.death = skin.death;
    sprite.dataset.hurt = skin.hurt;

    sprite.style.backgroundImage = `url('${skin.walk}')`;
    sprite.style.backgroundSize = tipo === "planta" ? "640px 256px" : "800px 256px";

    sprite.style.top = `${Math.random() * (window.innerHeight - 200) + 200}px`;
    sprite.style.left = `${Math.random() * (window.innerWidth - 64)}px`;

    campo.appendChild(sprite);

    let andando = true;
    let plantada = false;
    let fugindo = false;
    let timerPlantar;

    function moverAleatorio() {
        if (!andando) return;
        const nx = Math.random() * (window.innerWidth - 64);
        const ny = Math.random() * (window.innerHeight - 200) + 200;
        sprite.style.transition = 'top 2s linear, left 2s linear';
        sprite.style.left = `${nx}px`;
        sprite.style.top = `${ny}px`;
        setTimeout(moverAleatorio, 4000);
    }

    function iniciarPlantar() {
        andando = false;
        plantada = true;
        sprite.style.animation = `move 1s steps(8) forwards`;
        sprite.style.backgroundImage = sprite.dataset.death;
        sprite.style.backgroundSize = tipo === "planta" ? "512px 256px" : "1000px 256px";
    }

    sprite.addEventListener('mouseenter', () => {
        if (!plantada) {
            fugindo = true;
            andando = false;
            sprite.style.transition = 'top 1s linear, left 1s linear';
            const nx = Math.random() * (window.innerWidth - 64);
            const ny = Math.random() * (window.innerHeight - 200) + 200;
            sprite.style.left = `${nx}px`;
            sprite.style.top = `${ny}px`;
            sprite.style.backgroundImage = sprite.dataset.run;
            sprite.style.backgroundSize = tipo === "planta" ? "512px 256px" : "800px 256px";
            sprite.style.animation = `move 0.8s steps(8) infinite`;
            clearTimeout(timerPlantar);
            timerPlantar = setTimeout(() => {
                fugindo = false;
                andando = true;
                sprite.style.backgroundImage = sprite.dataset.walk;
                sprite.style.backgroundSize = tipo === "planta" ? "640px 256px" : "800px 256px";
                sprite.style.animation = `move 1s steps(10) infinite`;
                moverAleatorio();
            }, 3000);
        }
    });

    sprite.addEventListener('click', () => {
        if (!plantada) return;
        const fala = document.createElement('div');
        fala.classList.add('fala');
        fala.innerText = falasColher[Math.floor(Math.random() * falasColher.length)];
        sprite.appendChild(fala);

        ideias = ideias.filter(ideia => ideia.texto !== texto);
        ideiasColhidas.push(texto);
        salvarIdeias();
        salvarColhidas();
        atualizarJardim();

        setTimeout(() => {
            sprite.remove();
        }, 1500);
    });

    moverAleatorio();
    timerPlantar = setTimeout(iniciarPlantar, 8000);
}

btnEnviar.addEventListener('click', () => {
    const texto = inputIdeia.value.trim();
    if (texto && !ideias.find(i => i.texto === texto)) {
        ideias.push({ texto });
        salvarIdeias();
        criarPersonagem(texto);
        inputIdeia.value = '';
        inputIdeia.focus();
    } else {
        alert('Digite uma ideia única!');
    }
});

ideias.forEach(ideia => {
    criarPersonagem(ideia.texto);
});

atualizarJardim();