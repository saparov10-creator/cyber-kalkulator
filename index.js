const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Санды экранга чыгаруу
function appendNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        // Бир нече чекит коюлуп калуусунун алдын алуу
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Операторду кошуу (+, -, *, /)
function appendOperator(op) {
    if (operator !== null) calculate();
    previousInput = currentInput;
    operator = op;
    historyDisplay.innerText = `${previousInput} ${getOperatorSymbol(op)}`;
    shouldResetDisplay = true;
}

// Математикалык символдорду сулуу көрсөтүү
function getOperatorSymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
}

// Эсептөө функциясы (=)
function calculate() {
    if (operator === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Нөлгө бөлүүгө болбойт!");
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        default:
            return;
    }

    // Жыйынтыкты өтө узун кылбай, 4 санга чейин тегеректөө
    currentInput = parseFloat(result.toFixed(4)).toString();
    historyDisplay.innerText = `${previousInput} ${getOperatorSymbol(operator)} ${current} =`;
    operator = null;
    updateDisplay();
}

// Экранды толук тазалоо (C)
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    historyDisplay.innerText = '';
    updateDisplay();
}

// Акыркы бир эле санды өчүрүү (Backspace)
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Экранды жаңылоо
function updateDisplay() {
    display.innerText = currentInput;
}