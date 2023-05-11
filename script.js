// Array, um das Spielfeld zu speichern (jedes Feld hat anfangs den Wert null)
const fields = [null, null, null, null, null, null, null, null, null];
// Der Spieler, der anfängt (wird später abwechselnd zu "x" oder "o")
let currentPlayer = "x";
// Wird auf true gesetzt, wenn das Spiel zu Ende ist
let gameEnded = false;

// Funktion zum Rendern des Spielfelds
function render() {
  // Holt das Container-Element aus dem HTML-Dokument
  const container = document.getElementById("container");
  // Leere HTML-Zeichenkette, in die später das Spielfeld gerendert wird
  let html = "<table>";

  // Schleife für jede Zeile im Spielfeld (es gibt 3)
  for (let i = 0; i < 3; i++) {
    // Neue Zeile in der HTML-Zeichenkette
    html += "<tr>";

    // Schleife für jede Spalte in der aktuellen Zeile (es gibt 3)
    for (let j = 0; j < 3; j++) {
      // Index des aktuellen Felds im Array berechnen
      const index = i * 3 + j;
      // Symbol für das aktuelle Feld (leer, Kreuz oder Kreis)
      let symbol = "";

      // Wenn das Feld "o" enthält, ist das Symbol ein Kreis
      if (fields[index] === "o") {
        symbol = '<span class="circle">O</span>';
        // Wenn das Feld "x" enthält, ist das Symbol ein Kreuz
      } else if (fields[index] === "x") {
        symbol = '<span class="cross">X</span>';
      }

      // HTML-Code für das aktuelle Feld hinzufügen (ruft die Funktion play() auf, wenn das Feld geklickt wird)
      html += `<td onclick="play(${index})">${symbol}</td>`;
    }

    // Schließen der aktuellen Zeile in der HTML-Zeichenkette
    html += "</tr>";
  }

  // Schließen der Tabelle in der HTML-Zeichenkette
  html += "</table>";
  // Fügt das gerenderte Spielfeld in das Container-Element im HTML-Dokument ein
  container.innerHTML = html;
}

// Funktion, die aufgerufen wird, wenn ein Feld im Spielfeld geklickt wird
function play(index) {
  // Wenn das Feld bereits besetzt ist oder das Spiel zu Ende ist, wird die Funktion abgebrochen
  if (fields[index] !== null || gameEnded) {
    return;
  }

  // Das Feld wird mit dem Symbol des aktuellen Spielers besetzt
  fields[index] = currentPlayer;
  // Das Spielfeld wird neu gerendert
  render();
  // Überprüft, ob ein Spieler gewonnen hat oder das Spiel unentschieden steht
  checkWin();
  // Wechselt den aktuellen Spieler (von "x" zu "o" oder umgekehrt)
  currentPlayer = currentPlayer === "x" ? "o" : "x";
}
// Diese Funktion überprüft, ob einer der Spieler gewonnen hat oder ob es ein Unentschieden gibt
function checkWin() {
  // Die Bedingungen für einen Gewinn, in Form von Feldindizes
  const winningConditions = [
    [0, 1, 2], // erste Zeile
    [3, 4, 5], // zweite Zeile
    [6, 7, 8], // dritte Zeile
    [0, 3, 6], // erste Spalte
    [1, 4, 7], // zweite Spalte
    [2, 5, 8], // dritte Spalte
    [0, 4, 8], // erste Diagonale
    [2, 4, 6], // zweite Diagonale
  ];

  // Überprüfen, ob eine der Gewinnbedingungen erfüllt ist
  for (let i = 0; i < winningConditions.length; i++) {
    // aktuelle Gewinnbedingung
    const [a, b, c] = winningConditions[i];

    // Überprüfen, ob die Felder a, b und c den gleichen Wert haben (x oder o)
    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      // Falls ja, das Spiel beenden und die Gewinnbedingung zurückgeben
      endGame(winningConditions[i]);
      return;
    }
  }

  // Überprüfen, ob alle Felder gefüllt sind und kein Gewinner ermittelt werden konnte
  if (fields.every((field) => field !== null)) {
    // Falls ja, das Spiel beenden und eine leere Gewinnbedingung zurückgeben
    endGame([]);
  }
}

function endGame(winningRow) {
  // Setzt gameEnded auf true, um anzuzeigen, dass das Spiel beendet ist
  gameEnded = true;

  // Wenn es eine Gewinnreihe gibt (winningRow ist nicht leer)
  if (winningRow.length > 0) {
    // Ändert den Text des message-Elements, um den Gewinner anzuzeigen
    const message = document.getElementById("message");
    message.innerText = `${currentPlayer.toUpperCase()} gewinnt!`;

    // Erstellt ein neues div-Element, um die Gewinnreihe zu markieren
    const line = document.createElement("div");
    line.classList.add("winning-line");

    // Speichert die Indizes der Zellen, die die Gewinnreihe bilden
    const firstIndex = winningRow[0];
    const secondIndex = winningRow[1];
    const thirdIndex = winningRow[2];

    // Sucht die HTML-Elemente der Zellen anhand ihrer onclick-Attribute
    const firstCell = document.querySelector(`[onclick="play(${firstIndex})"]`);
    const secondCell = document.querySelector(
      `[onclick="play(${secondIndex})"]`
    );
    const thirdCell = document.querySelector(`[onclick="play(${thirdIndex})"]`);

    // Speichert die Positionen der Zellen
    const rect1 = firstCell.getBoundingClientRect();
    const rect2 = secondCell.getBoundingClientRect();
    const rect3 = thirdCell.getBoundingClientRect();

    // Positioniert das div-Element über der Gewinnreihe
    line.style.top = `${(rect1.top + rect1.bottom) / 2}px`;
    line.style.left = `${(rect1.left + rect1.right) / 2}px`;

    // Wenn die Zellen vertikal ausgerichtet sind
    if (Math.abs(rect2.left - rect1.left) < 0.1) {
      line.classList.add("vertical");
      line.style.height = `${rect2.top - rect1.top + rect2.height}px`;
    }
    // Wenn die Zellen horizontal ausgerichtet sind
    else if (Math.abs(rect2.top - rect1.top) < 0.1) {
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
    }
    // Wenn die Zellen diagonal ausgerichtet sind
    else {
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

    // Fügt das div-Element zum Dokument hinzu
    document.body.appendChild(line);
  }
  // Wenn es keine Gewinnreihe gibt
  else {
    // Ändert den Text des message-Elements, um eine Nachricht anzuzeigen
    const message = document.getElementById("message");
    message.innerText = "Dumm gelaufen!";
  }
}
function restart() {
  // Setzt alle Felder auf null zurück
  fields.fill(null);
  // Setzt den aktuellen Spieler auf "x"
  currentPlayer = "x";
  // Setzt das Spielende auf "false"
  gameEnded = false;

  // Löscht die Nachricht
  const message = document.getElementById("message");
  message.innerText = "";

  // Entfernt alle Gewinnerzellen-Klassen
  const cells = document.querySelectorAll("td");
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("winning-cell");
  }

  // Entfernt die Gewinnlinie
  const winningLine = document.querySelector(".winning-line");
  if (winningLine) {
    winningLine.remove();
  }

  // Zeigt das Spielbrett in seinem aktuellen Zustand an
  render();
}

// Zeigt das Spielbrett an
render();
