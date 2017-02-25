'use strict';
/*
TODO:
- Winning animation
- Make fox transparent on image
- Center dot? 3/4r circle?
- Legeng with instructions
- Grass and water
*/

const playgroundSize = 500;
const iconsSize = 20;

const tickIntervalMicroseconds = 50;

const duckSpeed = playgroundSize / (1000 / tickIntervalMicroseconds) / 16;

const lakeRadius = playgroundSize / 3;
const foxAngleSpeed = duckSpeed * 4 / lakeRadius;
const lakeCenterX = playgroundSize / 2;
const lakeCenterY = playgroundSize / 2;


window.onload = () => {
    let mouseX = lakeCenterX;
    let mouseY = lakeCenterY;

    let duckX = lakeCenterX;
    let duckY = lakeCenterY;

    let foxAngle = 0;

    const playgroundOrNull = document.getElementById('playground');
    if (!playgroundOrNull) {
        return
    };
    const playground = playgroundOrNull;
    playground.style.width = playgroundSize + 'px';
    playground.style.height = playgroundSize + 'px';

    const duckOrNull = document.getElementById('duck');
    if (!duckOrNull) {
        return
    }
    const duck = duckOrNull;
    duck.style.width = iconsSize + 'px';
    duck.style.height = iconsSize + 'px';

    const foxOrNull = document.getElementById('fox');
    if (!foxOrNull) {
        return
    }
    const fox = foxOrNull;
    fox.style.width = iconsSize + 'px';
    fox.style.height = iconsSize + 'px';


    const lakeOrNull = document.getElementById('lake');
    if (!lakeOrNull) {
        return
    }
    const lake = lakeOrNull;
    lake.style.width = lakeRadius * 2 + 'px';
    lake.style.height = lakeRadius * 2 + 'px';
    lake.style.left = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.top = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.borderRadius = lakeRadius + 'px';

    const youwonOrNull = document.getElementById('youwon');
    if (! youwonOrNull) {
        return
    }
    const youwon = youwonOrNull;

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

    let lastFoxAngleDeltaSign = 0;

    let animationTimerId: number | undefined;
    function stopAnimation() {
        if (animationTimerId) {
            clearInterval(animationTimerId);
        }
        playground.onclick = e => {
            startAnimation();
        };
    }
    function startAnimation() {
        youwon.style.display = "none";
        playground.onclick = e => { };
        animationTimerId = setInterval(() => {
            const duckDeltaXBeforeSpeedLimit = mouseX - duckX;
            const duckDeltaYBeforeSpeedLimit = mouseY - duckY;
            const speedRatio = Math.sqrt(duckDeltaXBeforeSpeedLimit ** 2 + duckDeltaYBeforeSpeedLimit ** 2) / duckSpeed;
            const duckDeltaX = speedRatio > 1 ? duckDeltaXBeforeSpeedLimit / speedRatio : duckDeltaXBeforeSpeedLimit;
            const duckDeltaY = speedRatio > 1 ? duckDeltaYBeforeSpeedLimit / speedRatio : duckDeltaYBeforeSpeedLimit;

            //duckDeltaX = -2;
            // duckDeltaY = 4.5;
            duckX = duckX + duckDeltaX;
            duckY = duckY + duckDeltaY;

            if (duckDeltaX != 0 || duckDeltaY != 0) {
                const rotateRad = duckDeltaX != 0 ?
                    Math.atan(duckDeltaY / duckDeltaX) :
                    (duckDeltaY > 0 ? Math.PI / 2 : -Math.PI / 2);
                duck.style.transform = `rotate(${rotateRad}rad) scaleX(${duckDeltaX < 0 ? -1 : 1})`;
            } else {
                duck.style.transform = '';
            }

            duck.style.left = (duckX - iconsSize / 2) + 'px';
            duck.style.top = (duckY - iconsSize / 2) + 'px';

            let duckAngle = 0;
            if (duckX != lakeCenterX && duckY != lakeCenterY) {
                const duckRadius = Math.sqrt((duckX - lakeCenterX) ** 2 + (duckY - lakeCenterY) ** 2);
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
            const foxScale = 3;
            fox.style.transform = `rotate(${foxAngle + Math.PI / 2}rad) ` +
                `scaleX(${(foxAngleDelta != 0 ? foxAngleDelta >= 0 : lastFoxAngleDeltaSign >= 0) ? foxScale : -foxScale}) ` +
                `scaleY(${foxAngle >= Math.PI ? foxScale : -foxScale})`;
            lastFoxAngleDeltaSign = foxAngleDelta != 0 ? foxAngleDelta : lastFoxAngleDeltaSign;
            const foxX = Math.cos(foxAngle) * (lakeRadius + iconsSize / 2) + lakeCenterX;
            const foxY = Math.sin(foxAngle) * (lakeRadius + iconsSize / 2) + lakeCenterY;
            fox.style.left = (foxX - iconsSize / 2) + 'px';
            fox.style.top = (foxY - iconsSize / 2) + 'px';

            if (Math.sqrt((duckX - lakeCenterX) ** 2 + (duckY - lakeCenterY) ** 2) - lakeRadius > 0) {
                if (Math.abs((foxAngle - duckAngle) * lakeRadius) > iconsSize / 2) {
                    youwon.style.display = "";
                    stopAnimation();
                }
                duckX = lakeCenterX;
                duckY = lakeCenterY;
            }
        }, tickIntervalMicroseconds);
    }
    startAnimation();
}
