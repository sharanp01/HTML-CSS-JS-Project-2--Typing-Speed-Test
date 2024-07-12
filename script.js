
const typingText = document.querySelector(".typing-text p");
const input = document.querySelector(".wrapper .input-field");
const time = document.querySelector(".time span");
const mistakes = document.querySelector(".mistake span");
const wpm = document.querySelector(".wpm span");
const cpm = document.querySelector(".cpm span");
const btn = document.querySelector("button");
const easyBtn = document.getElementById("easy");
const hardBtn = document.getElementById("hard");

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistake = 0;
let totalCharTyped = 0;
let isTyping = false;
let difficulty = "normal";

async function fetchParagraph(difficulty) {
  let apiURL;
  if (difficulty === "easy") {
    apiURL = "https://api.example.com/easy";
  } else if (difficulty === "hard") {
    apiURL = "https://baconipsum.com/api/?type=all-meat&paras=1";
  }
  const response = await fetch(apiURL);
  const data = await response.json();
  return data[0];
}

async function loadParagraph() {
  const paragraph = await fetchParagraph(difficulty);
  typingText.innerHTML = "";
  for (const char of paragraph) {
    typingText.innerHTML += `<span>${char}</span>`;
  }
  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => input.focus());
  typingText.addEventListener("click", () => {
    input.focus();
  });
}

function initTyping() {
  const char = typingText.querySelectorAll("span");
  const typedChar = input.value.charAt(charIndex);
  if (charIndex < char.length && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTime, 1000);
      isTyping = true;
    }
    if (typedChar === "") {
      if (charIndex > 0) {
        char[charIndex].classList.remove("active");
        charIndex--;
        if (char[charIndex].classList.contains("incorrect")) {
          mistake--;
          char[charIndex].classList.remove("incorrect");
        }
        char[charIndex].classList.remove("correct");
        char[charIndex].classList.add("active");
      }
    } else {
      if (char[charIndex].innerText === typedChar) {
        char[charIndex].classList.add("correct");
      } else {
        mistake++;
        char[charIndex].classList.add("incorrect");
      }
      charIndex++;
      totalCharTyped++;
      if (charIndex < char.length) {
        char[charIndex].classList.add("active");
      } else {
        input.value = ""; // Clear the input field
        charIndex = 0; // Reset the character index
        loadParagraph(); // Load a new paragraph
      }
    }
    mistakes.innerText = mistake;
    cpm.innerText = totalCharTyped - mistake;
  } else {
    clearInterval(timer);
    input.value = "";
  }
}

function initTime() {
  if (timeLeft > 0) {
    timeLeft--;
    time.innerText = timeLeft;
    let wpmVal = Math.round(
      ((totalCharTyped - mistake) / 5 / (maxTime - timeLeft)) * 60
    );
    wpm.innerText = wpmVal;
  } else {
    clearInterval(timer);
  }
}

function reset() {
  loadParagraph();
  clearInterval(timer);
  input.value = "";
  timeLeft = maxTime;
  charIndex = 0;
  mistake = 0;
  totalCharTyped = 0;
  isTyping = false;
  wpm.innerText = 0;
  cpm.innerText = 0;
  mistakes.innerText = 0;
  time.innerText = timeLeft;
}

input.addEventListener("input", initTyping);
btn.addEventListener("click", reset);
easyBtn.addEventListener("click", () => {
  difficulty = "easy";
  reset();
});
hardBtn.addEventListener("click", () => {
  difficulty = "hard";
  reset();
});

loadParagraph();
