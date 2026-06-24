const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const historyLogList = document.getElementById('historyLogList');
const clickSound = document.getElementById('clickSound');
const calcContainer = document.getElementById('calcContainer');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let isCalculationDone = false;
let memoryValue = 0; // Сактоо (Memory) үчүн өзгөрмө

// Үн чыгаруу жана кыска вибрация эффекти
function playFeedback() {
    // Үндү башынан ойнотуу
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {}); // Кээ бир браузерлер блоктоп койбошу үчүн

    // Телефондордо кыска кибер-вибрация (эгер колдосо)
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
}

function appendNumber(number) {
    playFeedback();
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

function appendOperator(op) {
    playFeedback();
    if (isCalculationDone) isCalculationDone = false;

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

function calculate() {
    playFeedback();
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
                triggerGlitchEffect(); // Нөлгө бөлгөндө глитч анимациясы иштейт
                clearDisplay();
                display.innerText = "SYS_ERROR";
                return;
            }
            result = prev / current;
            break;
        case '%': result = (prev * current) / 100; break;
        default: return;
    }

    const finalResult = parseFloat(result.toFixed(4)).toString();
    const fullEquation = `${previousInput} ${getOperatorSymbol(operator)} ${current} = ${finalResult}`;

    historyDisplay.innerText = `${previousInput} ${getOperatorSymbol(operator)} ${current} =`;
    addLogToHistory(fullEquation);

    currentInput = finalResult;
    operator = null;
    isCalculationDone = true;
    updateDisplay();
}

// Жаңы кошулган Глитч (Экрандын титирөөсү) эффекти
function triggerGlitchEffect() {
    calcContainer.classList.add('glitch-shake');
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setTimeout(() => {
        calcContainer.classList.remove('glitch-shake');
    }, 600);
}

function addLogToHistory(equation) {
    const emptyMsg = historyLogList.querySelector('.empty-log');
    if (emptyMsg) emptyMsg.remove();

    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.innerText = equation;

    historyLogList.insertBefore(logItem, historyLogList.firstChild);

    if (historyLogList.children.length > 20) {
        historyLogList.lastChild.remove();
    }
}

// Тарыхты тазалоочу функция
function clearHistoryLog() {
    playFeedback();
    historyLogList.innerHTML = '<span class="empty-log">Тарых бош...</span>';
}

// САКТОО (MEMORY) ФУНКЦИЯЛАРЫ
function memorySave() {
    playFeedback();
    memoryValue = parseFloat(currentInput) || 0;
    historyDisplay.innerText = `M+ STORED: ${memoryValue}`;
    shouldResetDisplay = true;
}

function memoryRecall() {
    playFeedback();
    currentInput = memoryValue.toString();
    updateDisplay();
}

function memoryClear() {
    playFeedback();
    memoryValue = 0;
    historyDisplay.innerText = "M- CLEARED";
}

function clearDisplay() {
    playFeedback();
    currentInput = '0';
    previousInput = '';
    operator = null;
    isCalculationDone = false;
    historyDisplay.innerText = '';
    updateDisplay();
}

function deleteLast() {
    playFeedback();
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