///<reference path="../node_modules/@types/mathjs/index.d.ts" />

const canvas = document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw = 8000;
const ch = 8000;
let data: string = "";
canvas.height = ch;
canvas.width = cw;
ctx.translate(cw / 2, ch / 2)
let t = 0;

document.body.appendChild(canvas);

interface rotVec {
    c: string,
    n: number
}

const rotVecs: rotVec[] = [
    { c: (0.1 * cw).toString(), n: 1 },
    { c: (0.1 * cw).toString(), n: -2 },
    { c: (0.02 * cw).toString(), n: 5 },
    { c: (0.015 * cw).toString(), n: -5.001 },
    { c: (0.015 * cw).toString(), n: -12.001 }
];
const drawnPoints: { x: number, y: number }[] = [];
function draw() {
    // first part ---------------------------------------------
    // for performances data
    const date1 = window.performance.now();
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
    let act = math.complex('0 + 0i');
    ctx.beginPath();
    ctx.arc(act.re, act.im, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.moveTo(act.re, act.im);
    // drawing of the arrows
    for (let i of rotVecs) {
        act = <math.Complex>math.add(act, math.evaluate(`${i.c} * ${math.e}^((${i.n}) * 2 * ${Math.PI} * i * ${t})`));
        ctx.lineTo(act.re, act.im);
        ctx.arc(act.re, act.im, 8, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.closePath();
    const date12 = window.performance.now();
    // secound part -------------------------------------------
    // for performances data
    // store the point optained by the sum of every arrow and controll the number of stored points
    drawnPoints.push({ x: act.re, y: act.im });
    if (drawnPoints.length > 200) {
        drawnPoints.splice(0, 1);
    }
    const date2 = window.performance.now();
    // drawing of stored points
    if (drawnPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        ctx.strokeStyle = "cyan"
        ctx.lineWidth = cw * 0.0025
        for (let i of drawnPoints) {
            ctx.lineTo(i.x, i.y);
            ctx.lineWidth -= (cw * 0.01) / drawnPoints.length
            ctx.stroke();
        }
        ctx.closePath();
    }
    // for performances data
    const date22 = window.performance.now();
    data += `${date12 - date1},${date22 - date2},${(date12 - date1) + (date22 - date2)},${t};`;
    if (t <= 2) { requestAnimationFrame(draw); }
    else { drawChart() }
}
const int = setInterval(() => t += 0.0025, 1);

function drawChart() {
    clearInterval(int);
    data = data.slice(0, data.length - 2);
    ctx.clearRect(-cw / 2, -ch / 2, cw, ch);
    ctx.translate(-(cw / 2), -(ch / 2));
    ctx.scale(1, -1);
    ctx.translate(0, -ch)
    const sepData = data.split(';');
    const dsepData: string[][] = []
    for (let i of sepData) {
        dsepData.push(i.split(','))
    }
    const NData: number[][] = [];
    for (let i of dsepData) {
        let k = [];
        for (let j of i) {
            k.push(parseFloat(j));
        }
        NData.push(k);
    }
    for (let i = 0; i < NData[0].length; i++) {
        NData[0][i] = 0;
    }
    const maxArr: number[][] = [[], [], [], []];
    for (let i of NData) {
        for (let j = 0; j < i.length; j++) {
            maxArr[j].push(i[j]);

        }
    }
    const Ndata: number[][] = [];
    const tempA: number[][] = [];
    for (let i of maxArr) {
        const si = smoothArray(i);
        tempA.push(si);
    }
    for (let i = 0; i < NData.length; i++) {
        Ndata.push([tempA[0][i], tempA[1][i], tempA[2][i], tempA[3][i]]);


    }
    const maxs: number[] = [];
    for (let i of maxArr) [
        maxs.push(Math.max(...i))
    ]
    const max = Math.max(...maxs);
    const maxt = Math.max(...maxArr[maxArr.length - 1])
    for (let i = 0; i < maxArr.length - 1; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(" + hslToRgb((1 / (maxArr.length - 1) * i), 1, .5).join(',') + ")"
        ctx.lineWidth = 20;
        ctx.moveTo(0, 0);
        for (let e of Ndata) {
            //@ts-ignore
            ctx.lineTo(e[e.length - 1] / maxt * 8000, e[i] / max * 8000);
            ctx.stroke();
        }
        ctx.closePath();
    }
}

draw();


const _$$c: HTMLCanvasElement = canvas;
const _$$cw = _$$c.width;
const _$$ch = _$$c.height;
function _$$adaptSize() {
    let rhl = _$$cw / _$$ch;
    let rlh = _$$ch / _$$cw;
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

function smoothArray(array: number[]) {
    const res: number[] = [];
    for (let j = 0; j < array.length; j++) {
        const i = array[j];
        const beforeP = array[j - 1] !== undefined ? array[j - 1] : i;
        const afterP = array[j + 1] !== undefined ? array[j + 1] : i;
        res.push((beforeP + i + afterP) / 3)
    }
    return res;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    var r: number, g: number, b: number;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
