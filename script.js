const fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "x";
let gameEnded = false;

function render() {
  const container = document.getElementById("container");
  let html = "<table>";

  for (let i = 0; i < 3; i++) {
    html += "<tr>";

    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = "";

      if (fields[index] === "o") {
        symbol = '<span class="circle">O</span>';
      } else if (fields[index] === "x") {
        symbol = '<span class="cross">X</span>';
      }

      html += `<td onclick="play(${index})">${symbol}</td>`;
    }

    html += "</tr>";
  }

  html += "</table>";
  container.innerHTML = html;
}

function play(index) {
  if (fields[index] !== null || gameEnded) {
    return;
  }

  fields[index] = currentPlayer;
  render();
  checkWin();
  currentPlayer = currentPlayer === "x" ? "o" : "x";
}

function checkWin() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];

    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      endGame(winningConditions[i]);
      return;
    }
  }

  if (fields.every((field) => field !== null)) {
    endGame([]);
  }
}
function endGame(winningRow) {
  gameEnded = true;

  if (winningRow.length > 0) {
    const message = document.getElementById("message");
    message.innerText = `${currentPlayer.toUpperCase()} wins!`;

    const line = document.createElement("div");
    line.classList.add("winning-line");

    const firstIndex = winningRow[0];
    const secondIndex = winningRow[1];
    const thirdIndex = winningRow[2];

    const firstCell = document.querySelector(`[onclick="play(${firstIndex})"]`);
    const secondCell = document.querySelector(
      `[onclick="play(${secondIndex})"]`
    );
    const thirdCell = document.querySelector(`[onclick="play(${thirdIndex})"]`);

    const rect1 = firstCell.getBoundingClientRect();
    const rect2 = secondCell.getBoundingClientRect();
    const rect3 = thirdCell.getBoundingClientRect();

    line.style.top = `${(rect1.top + rect1.bottom) / 2}px`;
    line.style.left = `${(rect1.left + rect1.right) / 2}px`;

    if (Math.abs(rect2.left - rect1.left) < 0.1) {
      line.classList.add("vertical");
      line.style.height = `${rect2.top - rect1.top + rect2.height}px`;
    } else if (Math.abs(rect2.top - rect1.top) < 0.1) {
      line.classList.add("horizontal");
      line.style.width = `${
        Math.sqrt(
          Math.pow(rect2.left - rect1.left, 2) +
            Math.pow(rect2.top - rect1.top, 2)
        ) + rect2.width
      }px`;
      line.style.transform = `rotate(${Math.atan2(
        rect2.top - rect1.top,
        rect2.left - rect1.left
      )}rad)`;
    } else {
      line.classList.add("diagonal");
      line.style.width = `${
        Math.sqrt(
          Math.pow(rect2.left - rect1.left, 2) +
            Math.pow(rect2.top - rect1.top, 2)
        ) + rect2.width
      }px`;
      line.style.transform = `rotate(${Math.atan2(
        rect2.top - rect1.top,
        rect2.left - rect1.left
      )}rad)`;
    }

    document.body.appendChild(line);
  } else {
    const message = document.getElementById("message");
    message.innerText = "Dumm gelaufen!";
  }
}

function restart() {
  fields.fill(null);
  currentPlayer = "x";
  gameEnded = false;

  const message = document.getElementById("message");
  message.innerText = "";

  const cells = document.querySelectorAll("td");
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("winning-cell");
  }

  const winningLine = document.querySelector(".winning-line");
  if (winningLine) {
    winningLine.remove();
  }

  render();
}

render();
