const e = 2.71828182846;
const pi = 3.14159265359;

function add(a,b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}

const numdecs = document.querySelectorAll('.numdeclist');
const operators = document.querySelectorAll('#operator');
const equal = document.querySelectorAll('#operate');
const reset = document.querySelector('#AC');
const pinkButtons = document.querySelectorAll('.pink-buttons');
const greenButtons = document.querySelectorAll('.green-buttons');
const del = document.querySelector('#DEL');

addDisplayUpdateAbility(numdecs);
addOperatorStoringAbility(operators);
addOperateAbility(equal);
addResetAbility(reset);
addDeleteAbility(del);

let firstOperand = 0;
let operator = null;

function addDisplayUpdateAbility(buttonsList) {
    buttonsList.forEach((buttons) => {
        for (let i = 0; i < buttons.children.length; i++) {
            const button = buttons.children[i];
            button.addEventListener('click', handleNumdecClick);
        }
    })
}

function removeDisplayUpdateAbility(buttonsList) {
    buttonsList.forEach((buttons) => {
        for (let i = 0; i < buttons.children.length; i++) {
            const button = buttons.children[i];
            button.removeEventListener('click', handleNumdecClick);
        }
    })
}

function handleNumdecClick(event) {
    if(isNewDisplayValid(event.target.textContent)) {
        console.log(`the textcontent of what you pressed: ${event.target.textContent}`)
        addNewDigit(event.target.textContent);
    } else {
        console.log(`what you pressed was: ${event.target.textContent}, but it is invalid`)
    }
}

function addNewDigit(digitString) {
    const textBox = getTextBox();
    console.log(`this is the new digit that will be added to display ${digitString}`)

    textBox.textContent += digitString;
}

function isNewDisplayValid(digitString) {
    let oldDisplay = getTextBox().textContent;
    let PotentialNewDisplay = getTextBox().textContent + digitString;

    console.log(`This is the potential: ${PotentialNewDisplay}`);

    if (oldDisplay.includes("e") || oldDisplay.includes("π")) {
        return false;
    } else if (oldDisplay.length >= 12) {
        return false;
    } else if (findNumOccurence(".", PotentialNewDisplay) > 1) {
        return false;
    } else if (oldDisplay.slice(-1) == "e" || oldDisplay.slice(-1) == "π") {
        return false;
    } else if (oldDisplay.slice(-1) == "." && (digitString == "e" || digitString == "π")){
        return false;
    } else {
        return true;
    }
}

function findNumOccurence(substr, str) {
    return str.split(substr).length - 1;
}

function addOperatorStoringAbility(operators) {
    operators.forEach((buttons) => {
        for (let i = 0; i < buttons.children.length; i++) {
            const button = buttons.children[i];
            button.addEventListener('click', handleOperatorClick);
        }
    })
}

function handleOperatorClick(event) {
    const chosenOperator = matchButtonToOperator(event.target.textContent);
    console.log(`this os the operator you just chose: ${chosenOperator}`)

    if (operator != null) {
        let result = roundto12(operator(firstOperand, getDisplayValue()));

        firstOperand = result;
        operator = chosenOperator

        getTextBox().textContent = result.toString();

        addChangeOnceListenerBL(numdecs);
        
    } else {

        firstOperand = storeAndResetDisplay();
        operator = chosenOperator;    
    }
}

function roundto12(num) {
    let numString; 

    if (num < 0.0000000001 && num > -0.000000001) {
        numString = '0';
    } else if (num > 999999999999) {
        numString = 'Infinity';
    } else {
        numString = num.toString();
    }

    let chars12NumString = numString.slice(0, 12);
    return parseFloat(chars12NumString);
}

function addOperateAbility(buttonsList) {
    buttonsList.forEach((buttons) => {
        for (let i = 0; i < buttons.children.length; i++) {
            const button = buttons.children[i];
            button.addEventListener('click', handleOperateClick);
        }
    })
}

function handleOperateClick() {
    let result;
    
    if (operator != null) {
        result = roundto12(operator(firstOperand, getDisplayValue()));
    } else {
        result = roundto12(getDisplayValue());
    }
    resetCalculation()

    firstOperand = result;

    getTextBox().textContent = result.toString();

}

function addResetAbility(button) {
    button.addEventListener('click', resetCalculation);
}

function addDeleteAbility(button) {
    button.addEventListener('click', handleDeleteClick);
}

function handleDeleteClick() {
    if (getTextBox().textContent.length <= 1) {
        resetToDefaultDisplay();
    } else {
        let newText = getTextBox().textContent.slice(0, -1);

        getTextBox().textContent = newText;
    }
}

function getTextBox() {
    const calculatorDisplayContainer = document.querySelector('#calculator-display');
    const calculatorDisplay = calculatorDisplayContainer.querySelector('div');
    const textBox = calculatorDisplay.querySelector('span');

    return textBox;
}

function getDisplayValue() {
    let currentDisplay = getTextBox().textContent;
    let lastDigit = currentDisplay.slice(-1);
    
    if (lastDigit == "e") {
        if (currentDisplay.length <= 1) {
            return e;
        }
        return parseFloat(currentDisplay.slice(0, -1)) * e;

    } else if (lastDigit == "π") {
        if (currentDisplay.length <= 1){
            return pi;
        }
        return parseFloat(currentDisplay.slice(0, -1)) * pi;
    } else {
        return parseFloat(currentDisplay);
    }

}

function resetToDefaultDisplay() {
    getTextBox().textContent = "0";

    addChangeOnceListenerBL(numdecs);
}

function addChangeOnceListenerBL(buttonsList) {
    removeDisplayUpdateAbility(numdecs);
    buttonsList.forEach((buttons) => {
        for (let i = 0; i < buttons.children.length; i++) {
            const button = buttons.children[i];
            button.addEventListener('click', addChangeOnceListenerB, { once: true});
        }
    })
}

function addChangeOnceListenerB(event) {

    getTextBox().textContent = event.target.textContent;

    console.log(`this is the display value after change: ${getTextBox().textContent}`)

    removeAllEventListener(document.querySelectorAll('.numdeclist'), 
    ['click', addChangeOnceListenerB, {once: true}])
    addDisplayUpdateAbility(numdecs);
}

function removeAllEventListener (buttonsList, eventListener) {
    buttonsList.forEach((buttons) => {
        for (let i = 0; i < buttons.children.length; i++) {
            const button = buttons.children[i];
            button.removeEventListener(...eventListener);
        }
    })
}

function matchButtonToOperator(value) {
    if (value == "×") {
        return multiply;
    } else if (value == "/") {
        return divide;
    } else if (value == "-") {
        return subtract;
    } else {
        return add;
    }
}

function storeAndResetDisplay() {
    let currentValue = getDisplayValue();

    resetToDefaultDisplay();
    return currentValue
}

function resetCalculation() {
    resetToDefaultDisplay()
    firstOperand = 0;
    operator = null;
}


resetToDefaultDisplay()
