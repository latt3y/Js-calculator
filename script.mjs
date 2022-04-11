const calculator = document.querySelector('.calculator');
const display = document.querySelector('.calculator__result');
const numbers = document.querySelectorAll('.calculator__buttons button');
const operators = document.querySelectorAll('.calculator__operators button');
const helpers = document.querySelectorAll('.calculator__helpers button');

const tiltConfig = {
    max: 25,
    perspective: 1000
};

calculator.addEventListener('mouseenter', onMouseEnter);
calculator.addEventListener('mousemove', onMouseMove);
calculator.addEventListener('mouseleave', onMouseLeave);

function onMouseEnter(){
    calculator.style.transition = 'transform 300ms cubic-bezier(.03,.98,.52,.99)';
}

function onMouseMove(event){
    const calcWidth = calculator.offsetWidth;
    const calcHeight = calculator.offsetHeight;
    const centerX = calculator.offsetLeft + calcWidth / 2;
    const centerY = calculator.offsetTop + calcHeight / 2;
    const mouse = {
        x: event.clientX - centerX,
        y: event.clientY - centerY
    };
    const rotateX = tiltConfig.max * mouse.y / (calcHeight / 2);
    const rotateY = (-1) * tiltConfig.max * mouse.x / (calcWidth / 2);

    calculator.style.transform = `perspective(${tiltConfig.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
};

function onMouseLeave(){
    calculator.style.transform = `perspective(${tiltConfig.perspective}px) rotateX(0deg) rotateY(0deg)`
};

window.onload = () => initialize();

const ALLOWED_TO_TYPE = 'allowed';
const NOT_ALLOWED_TO_TYPE = 'not allowed';

let accumulator = '';
let shouldTypeOperator = false;
let currOperator = null;
let computedData;
let calculateState;
let calculateStarted = false;

const selectNumbers = (operator) => (string) => {
    console.log(operator);
    console.log(string);
    return String(string).split(operator)
};


const addEventToElem = elem => event => cb => {
    for(let e of elem){
        e.addEventListener(event, cb);
    }
};

const reset = e => {
    if(e.target.textContent === 'C'){
        display.textContent = '0';
        accumulator = '';
        calculateStarted = false;
        calculateState = ALLOWED_TO_TYPE;
    }
}

const calculateCurrentNumbers = () => computedData(accumulator).reduce((a,b) => currOperator(+a, +b));

const getNumbersFromInput = event => {
    if(event.target.textContent === '='){
        if(typeof computedData === 'function'){
            display.textContent = accumulator = calculateCurrentNumbers();
            calculateState = NOT_ALLOWED_TO_TYPE;
            return;
        }
    } else if((event.target.textContent === '0' || event.target.textContent === '.') && !calculateStarted){
        return;
    } else{
        if(calculateState === NOT_ALLOWED_TO_TYPE) return;
        display.textContent = accumulator += event.target.textContent;

        if(currOperator &&  typeof computedData == 'function'){
            accumulator = calculateCurrentNumbers();
        }

        shouldTypeOperator = true;
        calculateState = ALLOWED_TO_TYPE;
        calculateStarted = true;
    }
};

const getOperator = event => {
    if(!shouldTypeOperator) return;

    const operators = {
        '+': (a,b) => a + b,
        '-': (a,b) => a - b,
        '/': (a,b) => a / b,
        '*': (a,b) => a * b
    };

    calculateState = ALLOWED_TO_TYPE;
    computedData = selectNumbers(event.target.textContent);
    display.textContent = accumulator += event.target.textContent;
    currOperator  = operators[Object.keys(operators).find(e => e === event.target.textContent.trim())];
    shouldTypeOperator = false;
};

function initialize() {
    addEventToElem(numbers)('click')(getNumbersFromInput);
    addEventToElem(operators)('click')(getOperator);
    addEventToElem(helpers)('click')(reset);
};