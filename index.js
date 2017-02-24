'use strict';

let playgroundSize = 500;
let iconsSize = 10;

let lakeRadius = playgroundSize / 3;
let lakeCenterX = playgroundSize / 2;
let lakeCenterY = playgroundSize / 2;

window.onload = () => {
    let playground = document.getElementById('playground');
    playground.style.width = playgroundSize + 'px';
    playground.style.height = playgroundSize + 'px';
    let duck = document.getElementById('duck');
    duck.style.width = iconsSize + 'px';
    duck.style.height = iconsSize + 'px';

    let lake = document.getElementById('lake');
    lake.style.width = lakeRadius*2 + 'px';
    lake.style.height = lakeRadius*2 + 'px';
    lake.style.left = (playgroundSize/2 - lakeRadius) + 'px';
    lake.style.top = (playgroundSize/2 - lakeRadius) + 'px';
    lake.style.borderRadius = lakeRadius + 'px';
    

    let mouseX = lakeCenterX;
    let mouseY = lakeCenterY;

    let duckX = lakeCenterX;
    let duckY = lakeCenterY;

    playground.onmousemove = e => {
        mouseX = e.pageX - playground.offsetLeft;
        if (mouseX < 0) {
            mouseX = 0;
        }
        if (mouseX > playgroundSize - 1) {
            mouseX = playgroundSize - 1;
        }
        mouseY = e.pageY - playground.offsetTop;
        mouseX = e.pageX - playground.offsetLeft;
        if (mouseY < 0) {
            mouseY = 0;
        }
        if (mouseY > playgroundSize - 1) {
            mouseY = playgroundSize - 1;
        }
    }
    
}
