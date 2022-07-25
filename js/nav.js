"use strict";

function toggleNavDropdown(e){
    if(e && e.target){
        if(e.target.getAttribute("aria-expanded")=="true"){
            closeNavDropdown();
        }else{
            openNavDropdown();
        }
    }
}

function openNavDropdown(){
    let el = document.querySelector("#nav-button-mobile");
    let dropList = document.querySelector("#mobile-nav-drop");

    el.setAttribute("aria-expanded", "true");
    dropList.setAttribute("aria-hidden", "false");
    if(dropList.clientHeight===0){
        dropList.style.height = dropList.scrollHeight+"px";
    }
    // activate inner items
    let inners = dropList.querySelectorAll("li");
    for(let i=0;i<inners.length;i++){
        let input = inners[i].querySelector("input, button");
        if(input){
            input.setAttribute("tabindex", "0");
        }
    }
}

function closeNavDropdown(){
    let el = document.querySelector("#nav-button-mobile");
    let dropList = document.querySelector("#mobile-nav-drop");

    el.setAttribute("aria-expanded", "false");
    dropList.setAttribute("aria-hidden", "true");
    if(dropList.style.height){
        dropList.removeAttribute("style");
    }

    let inners = dropList.querySelectorAll("li");
    for(let i=0;i<inners.length;i++){
        let input = inners[i].querySelector("input, button");
        if(input){
            input.setAttribute("tabindex", "-1");
        }
    }
}


// dropdown close on click anywhere but dropdown
document.querySelector("body").addEventListener("click", function(e){
    if(e.target!==document.querySelector("#nav-button-mobile")){
        closeNavDropdown();
    } 
});
// mobile nav
document.querySelector("#nav-button-mobile").addEventListener("click", toggleNavDropdown);