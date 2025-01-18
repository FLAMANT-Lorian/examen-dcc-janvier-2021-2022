import {fonts} from "./fonts";
import {settings as s} from "./settings";

const ulCardElement = document.querySelector(s.ulCardSelector);
const ulWrongCard = document.querySelector(s.ulWrongCard)
const datalistFontElement = document.getElementById(s.dataListId);
const pScoreElement = document.querySelector(s.pScoreSelector);
const pTimerElement = document.querySelector(s.pTimerSelector);
const maxTimePerCard = parseInt(pTimerElement.dataset.maxTime);
const formElement = document.getElementById(s.formId);
const inputFontElement = document.getElementById(s.fontElement);
const inputFamilyElement = document.getElementById(s.familyElement);
const formEndGame = document.getElementById('play-again');

let guessedCard = 0;
let remainingTime = maxTimePerCard;
let timerID = null;
let numberOfCard = 0;

function generateCardElement(font) {
    ulCardElement.insertAdjacentHTML("afterbegin", `<li data-font-name="${font.name}" data-family="${font.family}" class="app__item">
          <div class="app__item__info"><span class="app__item__info__name">${font.name}</span>
            <span class="app__item__info__info">${font.family} - ${font.author}</span>
          </div>
         <img class="app__item__font" src="./assets/fonts/${font.file}.svg" alt="Aa, abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ">
        </li>`);
}

function generateDatalistOption(font) {
    datalistFontElement.insertAdjacentHTML("beforeend", `<option value="${font.name}"></option>`);
}

function displayScore() {
    pScoreElement.textContent = pScoreElement.dataset.text + guessedCard + ' / ' + fonts.length;
}

function formatTime(remainingTime) {
    const min = Math.trunc(remainingTime / 60);
    const sec = Math.trunc(remainingTime % 60);
    return `${min < 10 ? '0' : ''}${min}' ${sec < 10 ? '0' : ''}${sec}''`;
}

function updateTimer() {
    const liLastChildElement = document.querySelector(s.ulCardSelector + " " + s.liCardClass);
    remainingTime--;
    if (remainingTime === 0) {
        liLastChildElement.classList.add('app__item--move', 'app__item--move--error');
        liCardTableTransitionEnd(liLastChildElement);
        remainingTime = maxTimePerCard;
    }
    displayRemainingTime();
}

function displayRemainingTime() {
    pTimerElement.textContent = pTimerElement.dataset.text + formatTime(remainingTime);
}

function displayButtonToRestartTheGame() {
    formEndGame.classList.remove('play--again--hidden');
    clearInterval(timerID);
    formEndGame.addEventListener('submit', (evt)=>{
        formEndGame.classList.add('play--again--hidden');
        location.reload();
    })
}

function liCardTableTransitionEnd(liLastChildElement) {
    liLastChildElement.addEventListener('transitionend', () => {
        if (liLastChildElement.className.includes('error')) {
            liLastChildElement.className = "app__item";
            ulWrongCard.insertAdjacentElement('afterbegin', liLastChildElement.cloneNode(true));
            if (numberOfCard >= 19){
                displayButtonToRestartTheGame();
            } else {
                numberOfCard++;
            }
        }
        liLastChildElement.remove();
        inputFontElement.value = "";
        inputFamilyElement.value = "";
    })
}

function playGame() {
    formElement.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const liLastChildElement = document.querySelector('.app li:last-child');
        if (inputFontElement.value === fonts[0].name && inputFamilyElement.value === fonts[0].family) {
            guessedCard += 1;
            liLastChildElement.classList.add('app__item--move', 'app__item--move--success');
        } else if (inputFamilyElement.value === fonts[0].family || inputFontElement.value === fonts[0].name) {
            guessedCard += 0.5;
            liLastChildElement.classList.add('app__item--move', 'app__item--move--error');
        } else {
            liLastChildElement.classList.add('app__item--move', 'app__item--move--error');
        }
        liCardTableTransitionEnd(liLastChildElement);
        displayScore();
        remainingTime = maxTimePerCard;
    })
}

for (const font of fonts) {
    generateCardElement(font);
    generateDatalistOption(font);
}

displayScore();
displayRemainingTime();
timerID = setInterval(() => {
    updateTimer();
}, 1000);
playGame();