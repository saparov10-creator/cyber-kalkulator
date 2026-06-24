const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const historyLogList = document.getElementById('historyLogList');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let isCalculationDone = false;

// Сандарды кошуу
function appendNumber(number) {
    if (isCalculationDone) {
        currentInput = number;
        isCalculationDone = false;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Амалдарды кошуу (+, -, *, /)
function appendOperator(op) {
    if (isCalculationDone) {
        isCalculationDone = false;
    }

    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    historyDisplay.innerText = `${previousInput} ${getOperatorSymbol(op)}`;
    shouldResetDisplay = true;
}

function getOperatorSymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
}

// Эсептөө жана тарыхка (Историяга) жазуу
function calculate() {
    if (operator === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if (current === 0) {
                alert("Нөлгө бөлүүгө болбойт!");
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%': result = (prev * current) / 100; break;
        default: return;
    }

    const finalResult = parseFloat(result.toFixed(4)).toString();
    const fullEquation = `${previousInput} ${getOperatorSymbol(operator)} ${current} = ${finalResult}`;

    // Экрандагы учурдагы тарыхты жаңыртуу
    historyDisplay.innerText = `${previousInput} ${getOperatorSymbol(operator)} ${current} =`;
    
    // ЖАНЫ: Жогорку "Логдор" тилкесине эсеп тарыхын кошуу
    addLogToHistory(fullEquation);

    currentInput = finalResult;
    operator = null;
    isCalculationDone = true;
    updateDisplay();
}

// Тарыхка жаңы эсеп кошуу функциясы
function addLogToHistory(equation) {
    // "Тарых бош..." деген жазууну алып салуу
    const emptyMsg = historyLogList.querySelector('.empty-log');
    if (emptyMsg) emptyMsg.remove();

    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.innerText = equation;

    // Жаңы эсепти эң өйдө жагына кошуу
    historyLogList.insertBefore(logItem, historyLogList.firstChild);

    // Тарых ашыкча толуп кетпеши үчүн акыркы 20 эсепти гана сактайт
    if (historyLogList.children.length > 20) {
        historyLogList.lastChild.remove();
    }
}

// Тазалоо
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    isCalculationDone = false;
    historyDisplay.innerText = '';
    updateDisplay();
}

// Өчүрүү
function deleteLast() {
    if (isCalculationDone) return;
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentInput;
}