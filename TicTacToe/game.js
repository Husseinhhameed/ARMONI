const moveSound = new Audio('move.mp3');
const endSound = new Audio('end.mp3');
const tieSound = new Audio('tied.mp3');

const board = document.getElementById('board');
const squares = document.getElementsByClassName('square');
const players = ['X', 'O'];
let currentPlayer = players[0];
const endMessage = document.createElement('h2');
let scoreX = 0;
let scoreO = 0;

document.getElementById('scoreX').textContent = scoreX;
document.getElementById('scoreO').textContent = scoreO;

endMessage.textContent = `X's turn!`;
endMessage.style.marginTop = '30px';
endMessage.style.textAlign = 'center';
board.after(endMessage);
let someoneWon = false;

const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', () => {
        if (someoneWon || squares[i].textContent !== '') return;

        squares[i].textContent = currentPlayer;
        squares[i].classList.add('played', currentPlayer === 'X' ? 'x' : 'o');
        moveSound.play();

        if (checkWin(currentPlayer)) {
            someoneWon = true;
            highlightWinningCombination();
            endMessage.textContent = `Game over! ${currentPlayer} wins!`;
            if (currentPlayer === 'X') scoreX++;
            else scoreO++;
            document.getElementById('scoreX').textContent = scoreX;
            document.getElementById('scoreO').textContent = scoreO;
            endSound.play();
            return;
        }

        if (checkTie()) {
            someoneWon = true;
            endMessage.textContent = `Game is tied!`;
            tieSound.play();
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        endMessage.textContent = `${currentPlayer}'s turn!`;
    });
}

function checkWin(player) {
    return winning_combinations.some(([a, b, c]) => {
        return (
            squares[a].textContent === player &&
            squares[b].textContent === player &&
            squares[c].textContent === player
        );
    });
}

function highlightWinningCombination() {
    winning_combinations.forEach(([a, b, c]) => {
        if (
            squares[a].textContent === currentPlayer &&
            squares[b].textContent === currentPlayer &&
            squares[c].textContent === currentPlayer
        ) {
            [squares[a], squares[b], squares[c]].forEach(square => {
                square.classList.add('winning');
            });
        }
    });
}

function checkTie() {
    return [...squares].every(square => square.textContent !== '');
}

function restartButton() {
    someoneWon = false;
    for (let i = 0; i < squares.length; i++) {
        squares[i].textContent = '';
        squares[i].classList.remove('played', 'x', 'o', 'winning');
    }
    endMessage.textContent = `X's turn!`;
    currentPlayer = players[0];
}
