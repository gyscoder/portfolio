const campo = document.getElementById('campo-ideias');
const inputIdeia = document.getElementById('input-ideia');
const btnEnviar = document.getElementById('btn-enviar');
const jardim = document.getElementById('jardim');

let ideias = JSON.parse(localStorage.getItem('ideiasPlantadas')) || [];
let ideiasColhidas = JSON.parse(localStorage.getItem('ideiasColhidas')) || [];

const plantas = {
    walk: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Walk/Plant1_Walk_full.png",
    run: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Run/Plant1_Run_full.png",
    idle: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Idle/Plant1_Idle_full.png",
    death: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Death/Plant1_Death_full.png",
    hurt: "sprites/craftpix-net-922184-free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/Hurt/Plant1_Hurt_full.png"
};

const slimes = {
    walk: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Walk/Slime1_Walk_full.png",
    run: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Run/Slime1_Run_full.png",
    idle: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Idle/Slime1_Idle_full.png",
    death: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Death/Slime1_Death_full.png",
    hurt: "sprites/craftpix-net-879657-free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/Hurt/Slime1_Hurt_full.png"
};

function salvarIdeias() {
    localStorage.setItem('ideiasPlantadas', JSON.stringify(ideias));
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

    const tipo = Math.random() < 0.5 ? "planta" : "slime";
    const skin = tipo === "planta" ? plantas : slimes;

    const frameWidth = 128;
    const frameHeight = 128;
    let totalFrames = 8;

    if (tipo === "planta"){
        totalFrames = 6;
    } else {
        totalFrames = 8;
    }

    let currentFrame = 0;
    let offsetY = 0;

    sprite.style.width = `${frameWidth}px`;
    sprite.style.height = `${frameHeight}px`;
    sprite.style.backgroundImage = `url('${skin.walk}')`;
    sprite.style.backgroundSize = `${frameWidth * totalFrames}px ${frameHeight * 4}px`;
    sprite.style.backgroundPositionX = `0px`;
    sprite.style.backgroundPositionY = `0px`;
    sprite.style.position = "absolute";

    let posX = Math.random() * (window.innerWidth - frameWidth);
    let posY = Math.random() * (window.innerHeight - 200) + 100;

    sprite.style.left = `${posX}px`;
    sprite.style.top = `${posY}px`;

    campo.appendChild(sprite);

    const animInterval = setInterval(() => {
        currentFrame = (currentFrame + 1) % totalFrames;
        const offsetX = -currentFrame * frameWidth;
        sprite.style.backgroundPositionX = `${offsetX}px`;
        sprite.style.backgroundPositionY = `-${offsetY}px`;
    }, 120);

    function moverAleatorio() {
        const newX = Math.random() * (window.innerWidth - frameWidth);
        const newY = Math.random() * (window.innerHeight - 200) + 100;

        const dx = newX - posX;
        const dy = newY - posY;

        // Definir offsetY conforme sprite
        if (tipo === "slime") {
            if (Math.abs(dx) > Math.abs(dy)) {
                offsetY = dx > 0 ? frameHeight * 2 : frameHeight * 1; // direita ou esquerda
            } else {
                offsetY = dy > 0 ? frameHeight * 0 : frameHeight * 3; // baixo ou cima
            }
        } else if (tipo === "planta") {
            // Na planta CraftPix, a ordem geralmente é:
            // 0 = baixo, 1 = esquerda, 2 = direita, 3 = cima
            if (Math.abs(dx) > Math.abs(dy)) {
                offsetY = dx > 0 ? frameHeight * 2 : frameHeight * 1;
            } else {
                offsetY = dy > 0 ? frameHeight * 0 : frameHeight * 3;
            }
        }

        sprite.style.transition = 'top 4s linear, left 4s linear';
        sprite.style.left = `${newX}px`;
        sprite.style.top = `${newY}px`;

        posX = newX;
        posY = newY;

        setTimeout(moverAleatorio, 4000);
    }

    moverAleatorio();

    sprite.addEventListener('mouseenter', () => {
        sprite.style.backgroundImage = `url('${skin.run}')`;
        sprite.style.backgroundSize = `${frameWidth * totalFrames}px ${frameHeight * 4}px`;
        setTimeout(() => {
            sprite.style.backgroundImage = `url('${skin.walk}')`;
            sprite.style.backgroundSize = `${frameWidth * totalFrames}px ${frameHeight * 4}px`;
        }, 3000);
    });

    sprite.addEventListener('click', () => {
        sprite.style.backgroundImage = `url('${skin.hurt}')`;
        sprite.style.backgroundSize = `${frameWidth * totalFrames}px ${frameHeight * 4}px`;
        setTimeout(() => {
            sprite.style.backgroundImage = `url('${skin.walk}')`;
            sprite.style.backgroundSize = `${frameWidth * totalFrames}px ${frameHeight * 4}px`;
        }, 1000);
    });
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
