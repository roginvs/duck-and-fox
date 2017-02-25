'use strict';
/*
TODO:
- lastFoxAngleDelta rename to lastFoxAngleDeltaSign and set it to +1 or -1
- Winning animation
- Make fox transparent on image
- Center dot? 3/4r circle?
- Legeng with instructions
- Grass and water
*/

const playgroundSize = 500;
const iconsSize = 10;

const tickIntervalMicroseconds = 50;


const duckSpeed = playgroundSize / (1000 / tickIntervalMicroseconds) / 16;

const lakeRadius = playgroundSize / 3;
const foxAngleSpeed = duckSpeed * 4 / lakeRadius;
const lakeCenterX = playgroundSize / 2;
const lakeCenterY = playgroundSize / 2;

let lastFoxAngleDelta = 0;

window.onload = () => {
    const playground = document.getElementById('playground');
    playground.style.width = playgroundSize + 'px';
    playground.style.height = playgroundSize + 'px';
    const duck = document.getElementById('duck');
    duck.style.width = iconsSize + 'px';
    duck.style.height = iconsSize + 'px';
    const fox = document.getElementById('fox');
    fox.style.width = iconsSize + 'px';
    fox.style.height = iconsSize + 'px';


    const lake = document.getElementById('lake');
    lake.style.width = lakeRadius * 2 + 'px';
    lake.style.height = lakeRadius * 2 + 'px';
    lake.style.left = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.top = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.borderRadius = lakeRadius + 'px';


    let mouseX = lakeCenterX;
    let mouseY = lakeCenterY;

    let duckX = lakeCenterX;
    let duckY = lakeCenterY;

    let foxAngle = 0;

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
                rotateRad = duckDeltaY > 0 ? Math.PI / 2 : -Math.PI / 2;
            }
            duck.style.transform = `rotate(${rotateRad}rad) scaleX(${duckDeltaX < 0 ? -1 : 1})`;
        } else {
            duck.style.transform = '';
        }

        duck.style.left = (duckX - iconsSize / 2) + 'px';
        duck.style.top = (duckY - iconsSize / 2) + 'px';

        let duckAngle = 0;
        if (duckX != lakeCenterX && duckY != lakeCenterY) {
            let duckRadius = Math.sqrt((duckX - lakeCenterX) ** 2 + (duckY - lakeCenterY) ** 2);
            duckAngle = Math.acos((duckX - lakeCenterX) / duckRadius);
            if (duckY - lakeCenterY < 0) {
                duckAngle = 2 * Math.PI - duckAngle;
            }
        }

        let foxAngleDelta = duckAngle - foxAngle;
        if (foxAngleDelta > Math.PI || foxAngleDelta < - Math.PI) {
            foxAngleDelta = - foxAngleDelta;
        }
        if (Math.abs(foxAngleDelta) > foxAngleSpeed) {
            foxAngleDelta = foxAngleDelta > 0 ? foxAngleSpeed : -foxAngleSpeed;
        }

        foxAngle = foxAngle + foxAngleDelta;

        if (foxAngle < 0) {
            foxAngle = foxAngle + 2 * Math.PI;
        }
        if (foxAngle > 2 * Math.PI) {
            foxAngle = foxAngle - 2 * Math.PI;
        }
        let foxScale = 3;
        fox.style.transform = `rotate(${foxAngle + Math.PI / 2}rad) ` +
            `scaleX(${(foxAngleDelta != 0 ? foxAngleDelta >= 0 : lastFoxAngleDelta >= 0) ? foxScale : -foxScale}) ` +
            `scaleY(${foxAngle >= Math.PI ? foxScale : -foxScale})`;
        lastFoxAngleDelta = foxAngleDelta != 0 ? foxAngleDelta : lastFoxAngleDelta;
        let foxX = Math.cos(foxAngle) * (lakeRadius + iconsSize / 2) + lakeCenterX;
        let foxY = Math.sin(foxAngle) * (lakeRadius + iconsSize / 2) + lakeCenterY;
        fox.style.left = (foxX - iconsSize / 2) + 'px';
        fox.style.top = (foxY - iconsSize / 2) + 'px';

        if (Math.sqrt((duckX - lakeCenterX) ** 2 + (duckY - lakeCenterY) ** 2) - lakeRadius > 0) {
            if (Math.abs((foxAngle - duckAngle)*lakeRadius > iconsSize/2 ) ) {
                alert('Done!');
            }
            duckX = lakeCenterX;
            duckY = lakeCenterY;            
        }
    }, tickIntervalMicroseconds);

}
