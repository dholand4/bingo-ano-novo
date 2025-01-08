const drawnNumbers = JSON.parse(localStorage.getItem('drawnNumbers')) || [];
const drawButton = document.getElementById('draw-button');
const currentNumberDisplay = document.getElementById('current-number');
const numbersDrawnContainer = document.getElementById('numbers-drawn');
const checkInput = document.getElementById('check-input');
const checkButton = document.getElementById('check-button');
const checkResult = document.getElementById('check-result');
const resetButton = document.getElementById('reset-button');

function getBingoColumn(number) {
    if (number >= 1 && number <= 15) return `B ${number}`;
    if (number >= 16 && number <= 30) return `I ${number}`;
    if (number >= 31 && number <= 45) return `N ${number}`;
    if (number >= 46 && number <= 60) return `G ${number}`;
    if (number >= 61 && number <= 75) return `O ${number}`;
    return number;
}

function updateDrawnNumbers() {
    numbersDrawnContainer.innerHTML = '';
    drawnNumbers.sort((a, b) => a - b).forEach(number => {
        const numberElement = document.createElement('span');
        numberElement.textContent = getBingoColumn(number);
        numbersDrawnContainer.appendChild(numberElement);
    });
}

function drawNumber() {
    if (drawnNumbers.length >= 75) {
        drawButton.disabled = true;
        currentNumberDisplay.textContent = "🏆";
        return;
    }

    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(number));

    drawnNumbers.push(number);
    localStorage.setItem('drawnNumbers', JSON.stringify(drawnNumbers));
    animateNumberDisplay(number);
    updateDrawnNumbers();
}

function animateNumberDisplay(number) {
    currentNumberDisplay.textContent = "🎲";
    currentNumberDisplay.style.animation = "none";

    setTimeout(() => {
        currentNumberDisplay.style.animation = "fadeIn 0.5s ease-in-out";
        currentNumberDisplay.textContent = getBingoColumn(number);
    }, 200);
}

function checkNumbers() {
    const inputNumbers = checkInput.value
        .split(',')
        .map(num => parseInt(num.trim(), 10))
        .filter(num => !isNaN(num));

    if (inputNumbers.length === 0) {
        checkResult.textContent = "Por favor, insira números válidos.";
        return;
    }

    const unmatchedNumbers = inputNumbers.filter(num => !drawnNumbers.includes(num));

    if (unmatchedNumbers.length === 0) {
        checkResult.innerHTML = "🎉 Todos os números foram sorteados! Temos um vencedor!";
        checkResult.style.color = "lightgreen";
    } else {
        checkResult.innerHTML = `❌ Alguns números ainda não foram sorteados: ${unmatchedNumbers
            .map(num => getBingoColumn(num))
            .join(', ')}`;
        checkResult.style.color = "red";
    }
}

function resetBingo() {
    localStorage.removeItem('drawnNumbers');
    drawnNumbers.length = 0;
    updateDrawnNumbers();
    drawButton.disabled = false;
    currentNumberDisplay.textContent = "🎲";
    checkResult.innerHTML = "";
}

drawButton.addEventListener('click', drawNumber);
checkButton.addEventListener('click', checkNumbers);
resetButton.addEventListener('click', resetBingo);

updateDrawnNumbers();
if (drawnNumbers.length >= 75) {
    drawButton.disabled = true;
    currentNumberDisplay.textContent = "🏆";
}
