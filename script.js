const typingText = document.querySelector(".typing-text p");
const input = document.querySelector(".wrapper .input-field");
const time = document.querySelector(".time span");
const mistakes = document.querySelector(".mistake span");
const wpm = document.querySelector(".wpm span");
const cpm = document.querySelector(".cpm span");
const btn = document.querySelector("button");
let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistake = 0;
let isTyping = false; 


function loadParagraph(){
    const paragraph = ["The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "The early bird catches the worm.",
  "A picture is worth a thousand words.",
  "Actions speak louder than words.",
  "Beauty is in the eye of the beholder."];
  const randomIndex = Math.floor(Math.random()*paragraph.length);
  typingText.innerHTML = '';
  for(const char of paragraph[randomIndex]){
    typingText.innerHTML += `<span>${char}</span>`

  }
typingText.querySelectorAll('span')[0].classList.add('active');
document.addEventListener('keydown', ()=>input.focus());
typingText.addEventListener('click',()=>{
    input.focus()
})

}

function initTyping(){
const char = typingText.querySelectorAll('span');
const typedChar = input.value.charAt(charIndex);
if(charIndex < char.length && timeLeft > 0){
     if(!isTyping){
        timer = setInterval(initTime,1000);
        isTyping = true;

}
    if(char[charIndex].innerText === typedChar){
        char[charIndex].classList.add('correct');
        
    }
    else{
        mistake++;
        char[charIndex].classList.add('incorrect');
       
    }
    charIndex++;
    char[charIndex].classList.add('active');
    mistakes.innerText = mistake;
    cpm.innerText = charIndex - mistake;
}

else{
clearInterval(timer);
input.value = ' ';
}
}

 function initTime(){
    if(timeLeft>0){
        timeLeft--;
        time.innerText = timeLeft;
        let wpmVal = Math.round(((charIndex - mistake)/5) /
         (maxTime - timeLeft)*60);
        wpm.innerText = wpmVal;
    }
    else{
        clearInterval(timer);
    }

}

function reset(){
    loadParagraph();
    clearInterval(timer);
    input.value = ' ';
    timeLeft = maxTime;
    charIndex = 0 ;
    mistake = 0 ;
    isTyping = false;
    wpm.innerText = 0 ;
    cpm.innerText = 0 ;
    mistakes.innerText = 0;
    time.innerText = timeLeft;
}
input.addEventListener('input', initTyping);
btn.addEventListener('click',reset);
loadParagraph();