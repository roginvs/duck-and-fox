'use strict';
/*
TODO:
- Winning animation
- Make fox transparent on image
- Center dot? 3/4r circle?
- Legeng with instructions
- Grass and water
*/
var playgroundSize = 500;
var iconsSize = 10;
var tickIntervalMicroseconds = 50;
var duckSpeed = playgroundSize / (1000 / tickIntervalMicroseconds) / 16;
var lakeRadius = playgroundSize / 3;
var foxAngleSpeed = duckSpeed * 4 / lakeRadius;
var lakeCenterX = playgroundSize / 2;
var lakeCenterY = playgroundSize / 2;
window.onload = function () {
    var mouseX = lakeCenterX;
    var mouseY = lakeCenterY;
    var duckX = lakeCenterX;
    var duckY = lakeCenterY;
    var foxAngle = 0;
    var playgroundOrNull = document.getElementById('playground');
    if (!playgroundOrNull) {
        return;
    }
    ;
    var playground = playgroundOrNull;
    playground.style.width = playgroundSize + 'px';
    playground.style.height = playgroundSize + 'px';
    var duckOrNull = document.getElementById('duck');
    if (!duckOrNull) {
        return;
    }
    var duck = duckOrNull;
    duck.style.width = iconsSize + 'px';
    duck.style.height = iconsSize + 'px';
    var foxOrNull = document.getElementById('fox');
    if (!foxOrNull) {
        return;
    }
    var fox = foxOrNull;
    fox.style.width = iconsSize + 'px';
    fox.style.height = iconsSize + 'px';
    var lakeOrNull = document.getElementById('lake');
    if (!lakeOrNull) {
        return;
    }
    var lake = lakeOrNull;
    lake.style.width = lakeRadius * 2 + 'px';
    lake.style.height = lakeRadius * 2 + 'px';
    lake.style.left = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.top = (playgroundSize / 2 - lakeRadius) + 'px';
    lake.style.borderRadius = lakeRadius + 'px';
    var youwonOrNull = document.getElementById('youwon');
    if (!youwonOrNull) {
        return;
    }
    var youwon = youwonOrNull;
    playground.onmousemove = function (e) {
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
    };
    var lastFoxAngleDeltaSign = 0;
    var animationTimerId;
    function stopAnimation() {
        if (animationTimerId) {
            clearInterval(animationTimerId);
        }
        playground.onclick = function (e) {
            startAnimation();
        };
    }
    function startAnimation() {
        youwon.style.display = "none";
        playground.onclick = function (e) { };
        animationTimerId = setInterval(function () {
            var duckDeltaXBeforeSpeedLimit = mouseX - duckX;
            var duckDeltaYBeforeSpeedLimit = mouseY - duckY;
            var speedRatio = Math.sqrt(Math.pow(duckDeltaXBeforeSpeedLimit, 2) + Math.pow(duckDeltaYBeforeSpeedLimit, 2)) / duckSpeed;
            var duckDeltaX = speedRatio > 1 ? duckDeltaXBeforeSpeedLimit / speedRatio : duckDeltaXBeforeSpeedLimit;
            var duckDeltaY = speedRatio > 1 ? duckDeltaYBeforeSpeedLimit / speedRatio : duckDeltaYBeforeSpeedLimit;
            //duckDeltaX = -2;
            // duckDeltaY = 4.5;
            duckX = duckX + duckDeltaX;
            duckY = duckY + duckDeltaY;
            if (duckDeltaX != 0 || duckDeltaY != 0) {
                var rotateRad = duckDeltaX != 0 ?
                    Math.atan(duckDeltaY / duckDeltaX) :
                    (duckDeltaY > 0 ? Math.PI / 2 : -Math.PI / 2);
                duck.style.transform = "rotate(" + rotateRad + "rad) scaleX(" + (duckDeltaX < 0 ? -1 : 1) + ")";
            }
            else {
                duck.style.transform = '';
            }
            duck.style.left = (duckX - iconsSize / 2) + 'px';
            duck.style.top = (duckY - iconsSize / 2) + 'px';
            var duckAngle = 0;
            if (duckX != lakeCenterX && duckY != lakeCenterY) {
                var duckRadius = Math.sqrt(Math.pow((duckX - lakeCenterX), 2) + Math.pow((duckY - lakeCenterY), 2));
                duckAngle = Math.acos((duckX - lakeCenterX) / duckRadius);
                if (duckY - lakeCenterY < 0) {
                    duckAngle = 2 * Math.PI - duckAngle;
                }
            }
            var foxAngleDelta = duckAngle - foxAngle;
            if (foxAngleDelta > Math.PI || foxAngleDelta < -Math.PI) {
                foxAngleDelta = -foxAngleDelta;
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
            var foxScale = 3;
            fox.style.transform = "rotate(" + (foxAngle + Math.PI / 2) + "rad) " +
                ("scaleX(" + ((foxAngleDelta != 0 ? foxAngleDelta >= 0 : lastFoxAngleDeltaSign >= 0) ? foxScale : -foxScale) + ") ") +
                ("scaleY(" + (foxAngle >= Math.PI ? foxScale : -foxScale) + ")");
            lastFoxAngleDeltaSign = foxAngleDelta != 0 ? foxAngleDelta : lastFoxAngleDeltaSign;
            var foxX = Math.cos(foxAngle) * (lakeRadius + iconsSize / 2) + lakeCenterX;
            var foxY = Math.sin(foxAngle) * (lakeRadius + iconsSize / 2) + lakeCenterY;
            fox.style.left = (foxX - iconsSize / 2) + 'px';
            fox.style.top = (foxY - iconsSize / 2) + 'px';
            if (Math.sqrt(Math.pow((duckX - lakeCenterX), 2) + Math.pow((duckY - lakeCenterY), 2)) - lakeRadius > 0) {
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
};
//# sourceMappingURL=index.js.map