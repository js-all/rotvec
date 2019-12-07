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
    { c: (0.015 * cw).toString(), n: -5.001 }
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
    if (drawnPoints.length > 1600) {
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
            //ctx.lineWidth -= (cw * 0.01) / drawnPoints.length
        }
        ctx.stroke();
        ctx.closePath();
    }
    // for performances data
    const date22 = window.performance.now();
    data += `${date12 - date1},${date22 - date2},${(date12 - date1) + (date22 - date2)},${t};`;
    if (t <= 10) { requestAnimationFrame(draw); }
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
    NData[0][0] = 0;
    NData[0][2] = 0;
    const maxArr: number[][] = [[], [], [], []];
    for (let i of NData) {
        maxArr[0].push(i[0]);
        maxArr[1].push(i[1]);
        maxArr[2].push(i[2]);
        maxArr[3].push(i[3]);
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
    const max1 = Math.max(...maxArr[0])
    const max2 = Math.max(...maxArr[1])
    const max3 = Math.max(...maxArr[2])
    const max = Math.max(max1, max2, max3);
    const maxt = Math.max(...maxArr[3])
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 20;
    ctx.moveTo(0, 0);
    for (let i of Ndata) {
        //@ts-ignore
        ctx.lineTo(i[3] / maxt * 8000, i[0] / max * 8000);
        ctx.stroke();
    }
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, 0);
    for (let i of Ndata) {
        //@ts-ignore
        ctx.lineTo(i[3] / maxt * 8000, i[1] / max * 8000);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(0, 0);
    for (let i of Ndata) {
        //@ts-ignore
        ctx.lineTo(i[3] / maxt * 8000, i[2] / max * 8000);
    }
    ctx.stroke();
    ctx.closePath();
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


