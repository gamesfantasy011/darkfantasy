const textElement = document.getElementById("text");
const choicesElement = document.getElementById("choices");
const diceContainer = document.getElementById("dice-container");
const diceButton = document.getElementById("roll-dice");
const diceResult = document.getElementById("dice-result");

let currentScene = 0;

// Cenas do jogo
const scenes = [
  {
    text: "Você acorda em meio à poeira de um campo de batalha esquecido. O céu está vermelho como sangue coagulado. Vozes antigas murmuram em sua mente.",
    choices: [
      { text: "Seguir o som dos sussurros", next: 1 },
      { text: "Vasculhar os corpos ao redor", next: 2 }
    ]
  },
  {
    text: "Os sussurros te levam até um altar negro escondido entre as ruínas. Você sente um chamado pulsando.",
    choices: [
      { text: "Tocar o altar", next: 3, roll: true },
      { text: "Recuar e observar", next: 4 }
    ]
  },
  {
    text: "Você encontra um medalhão antigo gravado com o símbolo do Olho Cego. Ele pulsa em sua mão.",
    choices: [
      { text: "Colocar o medalhão no pescoço", next: 5 },
      { text: "Guardar o medalhão", next: 4 }
    ]
  },
  {
    text: "Você toca o altar. Sua visão escurece. Rolando o dado para resistir ao chamado...",
    rollSuccess: "Você controla a energia e vislumbra o caminho oculto.",
    rollFail: "Sua alma é corrompida. O altar consome sua memória.",
    successNext: 6,
    failNext: 7
  },
  {
    text: "Ao longe, uma criatura de sombras espreita. Seus olhos brilham com ódio.",
    choices: [
      { text: "Confrontar a criatura", next: 8 },
      { text: "Fugir pelas ruínas", next: 9 }
    ]
  },
  {
    text: "O medalhão queima sua pele. Uma voz dentro de você desperta. É o Olho Cego. Ele exige obediência.",
    choices: [
      { text: "Aceitar o pacto", next: 6 },
      { text: "Tentar resistir (rolar D20)", next: 3, roll: true }
    ]
  },
  {
    text: "Você é guiado para além do mundo visível. Uma porta feita de ossos se abre. Final: Herdeiro do Vazio.",
    choices: []
  },
  {
    text: "Sua mente se despedaça. Seu corpo permanece, mas você já não é você. Final: O Esquecido.",
    choices: []
  },
  {
    text: "Você enfrenta a criatura. Rolando o dado para determinar o resultado do confronto...",
    rollSuccess: "Você fere a criatura e ela recua para as trevas.",
    rollFail: "Você é lançado ao chão, seu sangue irriga a terra amaldiçoada.",
    successNext: 6,
    failNext: 7
  },
  {
    text: "Você corre, mas algo o segue. Um grito ecoa, e tudo se apaga. Final: Preso no Eco.",
    choices: []
  }
];

// Função de digitação do texto
function typeText(text, callback) {
  let i = 0;
  textElement.textContent = "";
  const interval = setInterval(() => {
    textElement.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      callback();
    }
  }, 40);
}

// Apagar texto letra por letra
function deleteText(callback) {
  const text = textElement.textContent;
  let i = text.length - 1;
  const interval = setInterval(() => {
    textElement.textContent = text.slice(0, i);
    i--;
    if (i < 0) {
      clearInterval(interval);
      callback();
    }
  }, 20);
}

function showScene(index) {
  currentScene = index;
  const scene = scenes[index];
  deleteText(() => {
    typeText(scene.text, () => {
      showChoices(scene);
    });
  });
}

function showChoices(scene) {
  choicesElement.innerHTML = "";
  diceContainer.style.display = "none";
  diceResult.textContent = "";

  if (scene.choices && scene.choices.length > 0) {
    scene.choices.forEach(choice => {
      const button = document.createElement("button");
      button.textContent = choice.text;
      button.onclick = () => {
        if (choice.roll) {
          startDiceRoll(scene, choice.next);
        } else {
          showScene(choice.next);
        }
      };
      choicesElement.appendChild(button);
    });
  }
}

function startDiceRoll(scene, nextIndex) {
  diceContainer.style.display = "block";
  diceButton.onclick = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    diceResult.textContent = `Você rolou: ${roll}`;

    let success = roll >= 12;

    deleteText(() => {
      typeText(success ? scene.rollSuccess : scene.rollFail, () => {
        setTimeout(() => {
          showScene(success ? scene.successNext : scene.failNext);
        }, 1500);
      });
    });

    diceContainer.style.display = "none";
  };
}

window.onload = () => {
  showScene(0);
};
