'use strict';

const playgroundSize = 500;
const iconsSize = 10;

const tickIntervalMicroseconds = 250;

const foxSpeed = playgroundSize / (1000 / tickIntervalMicroseconds) / 4;
const duckSpeed = foxSpeed / 4;

const lakeRadius = playgroundSize / 3;
const lakeCenterX = playgroundSize / 2;
const lakeCenterY = playgroundSize / 2;

window.onload = () => {
    let playground = document.getElementById('playground');
    playground.style.width = playgroundSize + 'px';
    playground.style.height = playgroundSize + 'px';
    let duck = document.getElementById('duck');
    duck.style.width = iconsSize + 'px';
    duck.style.height = iconsSize + 'px';

    let lake = document.getElementById('lake');
    lake.style.width = lakeRadius * 2 + 'px';
    lake.style.height = lakeRadius * 2 + 'px';
    lake.style.left = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.top = (playgroundSize / 2 - lakeRadius) + 'px';
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


    setInterval(() => {

        let duckDeltaX = mouseX - duckX;
        let duckDeltaY = mouseY - duckY;
        let speedRatio = Math.sqrt(duckDeltaX ** 2 + duckDeltaY ** 2) / duckSpeed;
        if (speedRatio > 1) {
            duckDeltaX = duckDeltaX / speedRatio;
            duckDeltaY = duckDeltaY / speedRatio;
        }

        //duckDeltaX = -2;
       // duckDeltaY = 4.5;
        duckX = duckX + duckDeltaX;
        duckY = duckY + duckDeltaY;

        if (duckDeltaX != 0 || duckDeltaY != 0) {
            let rotateRad;
            if (duckDeltaX != 0) {
                rotateRad = Math.atan(duckDeltaY / duckDeltaX);
            } else {
                rotateRad = duckDeltaY > 0 ? Math.Pi / 2 : -Math.Pi / 2;
            }            
            duck.style.transform = `rotate(${rotateRad}rad) scaleX(${duckDeltaX < 0 ? -1 : 1})`;
        } else {
            duck.style.transform = '';
        }

        duck.style.left = (duckX - iconsSize / 2) + 'px';
        duck.style.top = (duckY - iconsSize / 2) + 'px';

        if (Math.sqrt((duckX - lakeCenterX) ** 2 + (duckY - lakeCenterY) ** 2) - lakeRadius > 0) {
            duckX = lakeCenterX;
            duckY = lakeCenterY;
            console.info('Well done!');
        }
    }, tickIntervalMicroseconds);

}
