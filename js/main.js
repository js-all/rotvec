"use strict";
///<reference path="../node_modules/@types/mathjs/index.d.ts" />
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var cw = 8000;
var ch = 8000;
var data = "";
canvas.height = ch;
canvas.width = cw;
ctx.translate(cw / 2, ch / 2);
var t = 0;
document.body.appendChild(canvas);
var rotVecs = [
    { c: (0.1 * cw).toString(), n: 1 },
    { c: (0.1 * cw).toString(), n: -2 },
    { c: (0.02 * cw).toString(), n: 5 },
    { c: (0.015 * cw).toString(), n: -5.001 }
];
var drawnPoints = [];
function draw() {
    // first part ---------------------------------------------
    // for performances data
    var date1 = window.performance.now();
    //draw the grid and erase the canvas
    ctx.clearRect(-cw / 2, -ch / 2, cw, ch);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 20;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(-(cw / 2), 0);
    ctx.lineTo(cw, 0);
    ctx.moveTo(0, -(ch / 2));
    ctx.lineTo(0, ch);
    ctx.stroke();
    ctx.closePath();
    // setting up the drawing of the arrows
    var act = math.complex('0 + 0i');
    ctx.beginPath();
    ctx.arc(act.re, act.im, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.moveTo(act.re, act.im);
    // drawing of the arrows
    for (var _i = 0, rotVecs_1 = rotVecs; _i < rotVecs_1.length; _i++) {
        var i = rotVecs_1[_i];
        act = math.add(act, math.evaluate(i.c + " * " + math.e + "^((" + i.n + ") * 2 * " + Math.PI + " * i * " + t + ")"));
        ctx.lineTo(act.re, act.im);
        ctx.arc(act.re, act.im, 8, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.closePath();
    var date12 = window.performance.now();
    // secound part -------------------------------------------
    // for performances data
    // store the point optained by the sum of every arrow and controll the number of stored points
    drawnPoints.push({ x: act.re, y: act.im });
    if (drawnPoints.length > 1600) {
        drawnPoints.splice(0, 1);
    }
    var date2 = window.performance.now();
    // drawing of stored points
    if (drawnPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = cw * 0.0025;
        for (var _a = 0, drawnPoints_1 = drawnPoints; _a < drawnPoints_1.length; _a++) {
            var i = drawnPoints_1[_a];
            ctx.lineTo(i.x, i.y);
            //ctx.lineWidth -= (cw * 0.01) / drawnPoints.length
        }
        ctx.stroke();
        ctx.closePath();
    }
    // for performances data
    var date22 = window.performance.now();
    data += date12 - date1 + "," + (date22 - date2) + "," + ((date12 - date1) + (date22 - date2)) + "," + t + ";";
    if (t <= 10) {
        requestAnimationFrame(draw);
    }
    else {
        drawChart();
    }
}
var int = setInterval(function () { return t += 0.0025; }, 1);
function drawChart() {
    clearInterval(int);
    data = data.slice(0, data.length - 2);
    ctx.clearRect(-cw / 2, -ch / 2, cw, ch);
    ctx.translate(-(cw / 2), -(ch / 2));
    ctx.scale(1, -1);
    ctx.translate(0, -ch);
    var sepData = data.split(';');
    var dsepData = [];
    for (var _i = 0, sepData_1 = sepData; _i < sepData_1.length; _i++) {
        var i = sepData_1[_i];
        dsepData.push(i.split(','));
    }
    var NData = [];
    for (var _a = 0, dsepData_1 = dsepData; _a < dsepData_1.length; _a++) {
        var i = dsepData_1[_a];
        var k = [];
        for (var _b = 0, i_1 = i; _b < i_1.length; _b++) {
            var j = i_1[_b];
            k.push(parseFloat(j));
        }
        NData.push(k);
    }
    NData[0][0] = 0;
    NData[0][2] = 0;
    var maxArr = [[], [], [], []];
    for (var _c = 0, NData_1 = NData; _c < NData_1.length; _c++) {
        var i = NData_1[_c];
        maxArr[0].push(i[0]);
        maxArr[1].push(i[1]);
        maxArr[2].push(i[2]);
        maxArr[3].push(i[3]);
    }
    var Ndata = [];
    var tempA = [];
    for (var _d = 0, maxArr_1 = maxArr; _d < maxArr_1.length; _d++) {
        var i = maxArr_1[_d];
        var si = smoothArray(i);
        tempA.push(si);
    }
    for (var i = 0; i < NData.length; i++) {
        Ndata.push([tempA[0][i], tempA[1][i], tempA[2][i], tempA[3][i]]);
    }
    var max1 = Math.max.apply(Math, maxArr[0]);
    var max2 = Math.max.apply(Math, maxArr[1]);
    var max3 = Math.max.apply(Math, maxArr[2]);
    var max = Math.max(max1, max2, max3);
    var maxt = Math.max.apply(Math, maxArr[3]);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 20;
    ctx.moveTo(0, 0);
    for (var _e = 0, Ndata_1 = Ndata; _e < Ndata_1.length; _e++) {
        var i = Ndata_1[_e];
        //@ts-ignore
        ctx.lineTo(i[3] / maxt * 8000, i[0] / max * 8000);
        ctx.stroke();
    }
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, 0);
    for (var _f = 0, Ndata_2 = Ndata; _f < Ndata_2.length; _f++) {
        var i = Ndata_2[_f];
        //@ts-ignore
        ctx.lineTo(i[3] / maxt * 8000, i[1] / max * 8000);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(0, 0);
    for (var _g = 0, Ndata_3 = Ndata; _g < Ndata_3.length; _g++) {
        var i = Ndata_3[_g];
        //@ts-ignore
        ctx.lineTo(i[3] / maxt * 8000, i[2] / max * 8000);
    }
    ctx.stroke();
    ctx.closePath();
}
draw();
var _$$c = canvas;
var _$$cw = _$$c.width;
var _$$ch = _$$c.height;
function _$$adaptSize() {
    var rhl = _$$cw / _$$ch;
    var rlh = _$$ch / _$$cw;
    if (window.innerWidth > window.innerHeight * rhl) {
        _$$c.style.width = 'inherit';
        _$$c.style.height = window.innerHeight - 2 + 'px';
    }
    if (window.innerHeight > window.innerWidth * rlh) {
        _$$c.style.height = 'inherit';
        _$$c.style.width = window.innerWidth - 2 + 'px';
    }
}
_$$adaptSize();
window.addEventListener('resize', _$$adaptSize);
function smoothArray(array) {
    var res = [];
    for (var j = 0; j < array.length; j++) {
        var i = array[j];
        var beforeP = array[j - 1] !== undefined ? array[j - 1] : i;
        var afterP = array[j + 1] !== undefined ? array[j + 1] : i;
        res.push((beforeP + i + afterP) / 3);
    }
    return res;
}
