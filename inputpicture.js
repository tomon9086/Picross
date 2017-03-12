cvs = document.getElementById("inputCanvas");
ctx = document.getElementById("inputCanvas").getContext("2d");
canvasWidth = 0;
canvasHeight = 0;
resolution = 1.5;
cellWidth = 20;
cellHeight = 20;
linePixel = 2;
borderPixel = 4;
pixelMap = [];
hintArray = [];
let width = document.getElementById("numOfCol").value;
let height = document.getElementById("numOfRow").value;

class Cell {
	constructor(field, cellCoord, startCoord) {
		this.field = field;
		this.startCoord = startCoord;
		this.cellCoord = cellCoord;
		this.isSculpted = false;
		this.isRegulated = false;
		this.style = "";
	}

	// defrag() {
	// 	this.isSculpted = false;
	// 	this.isRegulated = false;
	// }

	turn() {
		if(this.isRegulated)return;
		this.isSculpted = !this.isSculpted;
		if(this.isSculpted){
			this.style = "rgb(0,0,0)";
		} else {
			this.style = "rgb(255,255,255)";
		}
	}

	regulate() {
		this.isRegulated = !this.isRegulated;
		this.isSculpted = false;
		if(this.isRegulated){
			this.style = "rgb(200,200,200)";
		} else {
			this.style = "rgb(255,255,255)";
		}
	}

	update() {
		this.field.ctx.fillStyle = this.style;
		this.field.ctx.fillRect(this.startCoord[0], this.startCoord[1], this.field.cellWidth, this.field.cellHeight);
	}
}

const cellCalc = (x, y) => {
	const cx = Math.floor(x / (cellWidth + linePixel) / resolution);
	const cy = Math.floor(y / (cellWidth + linePixel) / resolution);
	if(!(cx >= 0 && cx < width && cy >= 0 && cy < height))return false;
	return [cx, cy];
};
const mouseMove = (event) => {
	const currCell = cellCalc(event.layerX, event.layerY);
	if(currCell[0] === prevCell[0] && currCell[1] === prevCell[1])return;
	if(!currCell)return;
	if(event.button === 0) {
		pixelMap[currCell[1]][currCell[0]].turn();
	}
	if(event.button === 2) {
		pixelMap[currCell[1]][currCell[0]].regulate();
	}
	pixelMap[currCell[1]][currCell[0]].update();
	prevCell = currCell;
};
const eventEnd = (event) => {
	cvs.removeEventListener("mousemove", mouseMove);
	cvs.removeEventListener("mouseup", eventEnd);
};
const eventStart = (event) => {
	// event.button: left -> 0, right -> 2
	const currCell = cellCalc(event.layerX, event.layerY);
	if(!currCell)return;
	if(event.button === 0) {
		pixelMap[currCell[1]][currCell[0]].turn();
	}
	if(event.button === 2) {
		pixelMap[currCell[1]][currCell[0]].regulate();
	}
	pixelMap[currCell[1]][currCell[0]].update();
	prevCell = currCell;
	cvs.addEventListener("mousemove", mouseMove);
	cvs.addEventListener("mouseup", eventEnd);
};

function fieldGenerator() {
	cvs.removeEventListener("mousedown", eventStart);
	width = document.getElementById("numOfCol").value;
	height = document.getElementById("numOfRow").value;
	pixelMap = [];

	canvasWidth = cellWidth * width + linePixel * (width - 1) + borderPixel * 2;
	canvasHeight = cellHeight * height + linePixel * (height - 1) + borderPixel * 2;
	canvasInitialize();
	// セル描画
	// 小枠
	ctx.fillStyle = "rgb(0,0,0)";
	for(let i = 0; i < height; i++) {
		pixelMap.push([]);
		for(let j = 0; j < width; j++) {
			// ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(borderPixel - linePixel + (cellWidth + linePixel) * j, borderPixel - linePixel + (cellHeight + linePixel) * i, cellWidth + linePixel * 2, cellHeight + linePixel * 2);
			// ctx.fillStyle = "rgb(255,0,0)";
			const coordinate = [linePixel + (cellWidth + linePixel) * j + linePixel, linePixel + (cellHeight + linePixel) * i + linePixel];
			ctx.clearRect(coordinate[0], coordinate[1], cellWidth, cellHeight);
			pixelMap[i].push(new Cell(this, [j, i], coordinate));
		}
	}
	// 大枠
	/*
		1
	  4	□ 2
		3
	*/
	const borderWidth = cellWidth * width + linePixel * (width - 1) + borderPixel * 2;
	const borderHeight = cellHeight * height + linePixel * (height - 1) + borderPixel * 2;
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0, 0, borderWidth, borderPixel);
	ctx.fillRect(borderWidth - borderPixel, 0, borderPixel, borderHeight);
	ctx.fillRect(0, borderHeight - borderPixel, borderWidth, borderPixel);
	ctx.fillRect(0, 0, borderPixel, borderHeight);
	// mouse event
	let prevCell = [];
	cvs.addEventListener("mousedown", eventStart);
}

function canvasInitialize() {
	cvs.setAttribute("width", canvasWidth * resolution);
	cvs.setAttribute("height", canvasHeight * resolution);
	ctx.scale(resolution, resolution);
}

function exportArray() {
	let exportMap = [];
	pixelMap.forEach(function(v, i) {
		exportMap.push([]);
		v.forEach(function(w, j) {
			exportMap[i][j] = w.isSculpted ? 1 : 0;
		});
	});
	console.table(exportMap);
	document.getElementById("exportArea").innerText = JSON.stringify(exportMap);
}

fieldGenerator();
