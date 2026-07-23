document.addEventListener(
"DOMContentLoaded",
()=>{


const character =
document.querySelector(".character-img");


if(!character) return;



// 등장 효과

character.classList.add("character-enter");



// 클릭 반응

document
.querySelectorAll(".menu-btn")
.forEach(btn=>{


btn.addEventListener(
"mouseenter",
()=>{


character.classList.add(
"character-active"
);


});


btn.addEventListener(
"mouseleave",
()=>{


character.classList.remove(
"character-active"
);


});


});



});