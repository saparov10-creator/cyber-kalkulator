const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const historyLogList = document.getElementById('historyLogList');
const calcContainer = document.getElementById('calcContainer');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let isCalculationDone = false;
let memoryValue = 0;

// ЖАНЫ: Эч кандай аудио файлсыз, браузердин өзүнөн үн чыгаруучу санариптик синтезатор
function playFeedback() {
    try {
        // Браузердин аудио контекстин чакыруу
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Осциллятор (үн толкунун жаратуучу)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine'; // Жумшак жана таза электрондук үн толкуну
        osc.frequency.setValueAtTime(1200, ctx.currentTime); // Үндүн бийиктиги (Гц)
        
        // Үндүн бат басылып, "чык" деп кыска угулушу үчүн убакытты жөндөө
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.05); // 0.05 секунддан кийин үндү өчүрүү
    } catch (e) {
        console.log("Браузердин аудио системасы иштебей калды:", e);
    }

    // Телефондо кыска титирөө (вибрация) эффекти
    if (navigator.vibrate) {
        navigator.vibrate(12);
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
                triggerGlitchEffect();
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

function triggerGlitchEffect() {
    calcContainer.classList.add('glitch-shake');
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    setTimeout(() => {
        calcContainer.classList.remove('glitch-shake');
    }, 500);
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

function clearHistoryLog() {
    playFeedback();
    historyLogList.innerHTML = '<span class="empty-log">Тарых бош...</span>';
}

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