const glitchTitles = document.querySelectorAll(".glitch");

function triggerGlitch(){
    glitchTitles.forEach(title=>{
        title.classList.add("active");
        setTimeout(()=>{
            title.classList.remove("active");
        },150);
    });
}

// 랜덤 시간마다 발생
function randomGlitch(){
    const delay = 
        Math.random()*3000 + 2000;
    setTimeout(()=>{
        triggerGlitch();
        randomGlitch();
    },delay);
}

randomGlitch();