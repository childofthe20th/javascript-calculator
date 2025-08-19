const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';
let operator = '';
let previousInput = '';
let justCalculated = false;

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
    if (number === '.') {
        // Prevent more than one decimal in the current number
        if (currentInput.includes('.')) {
            return;
        }
        if (currentInput === '' || justCalculated) {
            currentInput = '0.';
            justCalculated = false;
            updateDisplay(currentInput);
            return;
        }
    }
    if (justCalculated) {
        // Replace display with new number after clear or equals
        currentInput = (number === '.') ? '0.' : number;
        justCalculated = false;
    } else {
        currentInput += number;
    }
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

// Keyboard support
// Only one listener, outside of handleActionInput
if (!window._calculatorKeyboardListener) {
    document.addEventListener('keydown', function(e) {
        let key = e.key;
        let handled = false;
        // Handle shift+key for operators and numbers
        if (e.shiftKey) {
            // Shift+1 = !, Shift+2 = @, etc. Only allow valid calculator keys
            if (key === '+') {
                handleActionInput('add');
                handled = true;
            } else if (key === '_') {
                // Shift+- is _ (not used)
            } else if (key === '*') {
                handleActionInput('multiply');
                handled = true;
            } else if (key === '=') {
                // Shift+= is +
                handleActionInput('add');
                handled = true;
            } else if (key === '"') {
                // Shift+' is " (not used)
            } else if (key === ':') {
                // Shift+; is : (not used)
            } else if (key === '<' || key === '>') {
                // Shift+, or . (not used)
            }
        }
        // Handle normal keys
        if (key >= '0' && key <= '9') {
            handleNumberInput(key);
            handled = true;
            // Visually show button press
            const btn = document.querySelector('.btn[data-number="' + key + '"]');
            if (btn) {
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 150);
            }
        } else if (key === '.') {
            handleNumberInput('.');
            handled = true;
            const btn = document.querySelector('.btn[data-number="."]');
            if (btn) {
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 150);
            }
        } else if (key === '+') {
            handleActionInput('add');
            handled = true;
        } else if (key === '-') {
            handleActionInput('subtract');
            handled = true;
        } else if (key === '*' || key === 'x') {
            handleActionInput('multiply');
            handled = true;
        } else if (key === '/' || key === '÷') {
            handleActionInput('divide');
            handled = true;
        } else if (key === '=' || (key === '+' && e.shiftKey)) {
            // '=' and shift+'=' (which is '+')
            if (e.shiftKey && key === '=') {
                handleActionInput('add');
            } else {
                handleActionInput('equals');
            }
            handled = true;
        } else if (key === 'Enter') {
            handleActionInput('equals');
            handled = true;
        } else if (key === 'Backspace') {
            handleActionInput('backspace');
            handled = true;
        } else if (key === 'Escape' || (key === 'c')) {
            handleActionInput('clear');
            handled = true;
        }
        // Only prevent default for unhandled keys
        if (!handled && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
        }
    });
    window._calculatorKeyboardListener = true;
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
    // Always show negative sign if result is negative
    if (typeof value === 'number' && value < 0) {
        display.textContent = value;
        display.classList.add('negative');
    } else if (!isNaN(value) && value.toString().startsWith('-')) {
        display.textContent = value;
        display.classList.add('negative');
    } else {
        display.textContent = value;
        display.classList.remove('negative');
    }
}

function clearCalculator() {
    currentInput = '';
    operator = '';
    previousInput = '';
    justCalculated = false;
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
            if (curr === 0) {
                updateDisplay("Nice try. Can't divide by zero!");
                currentInput = '';
                operator = '';
                previousInput = '';
                justCalculated = true;
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }

    updateDisplay(result);
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    justCalculated = true;
}
function initCalculator() {
    clearCalculator();
}

