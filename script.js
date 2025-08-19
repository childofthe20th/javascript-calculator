const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';
let operator = '';
let previousInput = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const number = button.dataset.number;

        if (number) {
            handleNumberInput(number);
        } else if (action) {
            handleActionInput(action);
        }
    });
});

function handleNumberInput(number) {
    currentInput += number;
    updateDisplay(currentInput);
}

function handleActionInput(action) {
    switch (action) {
        case 'clear':
            clearCalculator();
            break;
        case 'backspace':
            backspace();
            break;
        case 'equals':
            calculateResult();
            break;
        default:
            setOperator(action);
            break;
    }
}


function updateDisplay(value) {
    // If value is a decimal and too lengthy, round it
    if (typeof value === 'number' || (!isNaN(value) && value.toString().includes('.'))) {
        let num = Number(value);
        if (num % 1 !== 0) {
            // Round to 8 decimal places, remove trailing zeros
            value = parseFloat(num.toFixed(8));
        }
    }
    display.textContent = value;
}

function clearCalculator() {
    currentInput = '';
    operator = '';
    previousInput = '';
    updateDisplay('0');
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

function setOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculateResult();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = '';
}

function calculateResult() {
    if (currentInput === '' || previousInput === '' || operator === '') return;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;

    switch (operator) {
        case 'add':
            result = prev + curr;
            break;
        case 'subtract':
            result = prev - curr;
            break;
        case 'multiply':
            result = prev * curr;
            break;
        case 'divide':
            result = prev / curr;
            break;
        default:
            return;
    }

    updateDisplay(result);
    currentInput = result.toString();
    operator = '';
    previousInput = '';
}
function initCalculator() {
    clearCalculator();
}

