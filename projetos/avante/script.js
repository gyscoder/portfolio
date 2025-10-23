particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#0fff00"
          },
          "shape": {
            "type": "polygon",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 1,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#4bd700",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 8.017060304327615,
            "direction": "bottom",
            "random": true,
            "straight": false,
            "out_mode": "bounce",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
  });

  // --- Terminal ---
const input = document.getElementById('command-input');
const output = document.getElementById('terminal-output');

// Lista de comandos simulados
const commands = {
  help: "Comandos disponíveis:\n- help\n- clear\n- time\n- about",
  about: "Terminal de demonstração com Particles.js + ASCII 😎",
  time: () => `Hora atual: ${new Date().toLocaleTimeString()}`,
  clear: () => { output.innerHTML = ''; return ''; }
};

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (!cmd) return;

    // Exibe o comando digitado
    output.innerHTML += `> ${cmd}\n`;

    // Executa o comando
    let response = commands[cmd];
    if (typeof response === 'function') response = response();
    if (!response) response = 'Comando não reconhecido. Digite "help".';

    // Exibe o resultado
    output.innerHTML += response + '\n\n';
    output.scrollTop = output.scrollHeight;

    // Limpa input
    input.value = '';
  }
});