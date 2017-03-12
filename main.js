class PicrossField {
	constructor(element) {
		// this.doc = doc;
		// this.fieldName = fieldName;
		this.cvs = element;
		this.ctx = element.getContext("2d");
		this.canvasWidth = 0;
		this.canvasHeight = 0;
		this.resolution = 1.5;
		this.cellWidth = 20;
		this.cellHeight = 20;
		this.linePixel = 2;
		this.borderPixel = 4;
		this.pixelMap = [];
		this.hintArray = [];

		this.Cell = class {
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
		};
	}

	fieldGenerator(pictureArray) {
		this.pixelMap = [];
		this.hintArray = this.hintGenerator(pictureArray);
		let hint = [];
		this.hintArray.forEach(function(v, i) {
			let max = 1;
			v.forEach(function(w, j) {
				if(w.length > max) {
					max = w.length;
				}
			});
			hint[i] = max;
		});

		const picx = pictureArray[0].length;
		const picy = pictureArray.length;
		this.canvasWidth = this.cellWidth * (hint[1] + picx) + this.linePixel * (hint[1] + picx - 2) + this.borderPixel * 2;
		this.canvasHeight = this.cellHeight * (hint[0] + picy) + this.linePixel * (hint[0] + picy - 2) + this.borderPixel * 2;
		this.canvasInitialize();
		// セル描画
		// 小枠
		let xIni = this.cellWidth * hint[1] + this.linePixel * (hint[1] - 1) + this.borderPixel - this.linePixel;
		let yIni = this.cellHeight * hint[0] + this.linePixel * (hint[0] - 1) + this.borderPixel - this.linePixel;
		this.ctx.fillStyle = "rgb(0,0,0)";
		pictureArray.forEach((v, i) => {
			this.pixelMap.push([]);
			v.forEach((w, j) => {
				// this.ctx.fillStyle = "rgb(0,0,0)";
				this.ctx.fillRect(xIni + (this.cellWidth + this.linePixel) * j, yIni + (this.cellHeight + this.linePixel) * i, this.cellWidth + this.linePixel * 2, this.cellHeight + this.linePixel * 2);
				// this.ctx.fillStyle = "rgb(255,0,0)";
				const coordinate = [xIni + (this.cellWidth + this.linePixel) * j + this.linePixel, yIni + (this.cellHeight + this.linePixel) * i + this.linePixel];
				this.ctx.clearRect(coordinate[0], coordinate[1], this.cellWidth, this.cellHeight);
				this.pixelMap[i].push(new this.Cell(this, [j, i], coordinate));
			});
		});
		// 大枠
		/*
			1
		  4	□ 2
			3
		*/
		xIni = this.cellWidth * hint[1] + this.linePixel * (hint[1] - 1);
		yIni = this.cellHeight * hint[0] + this.linePixel * (hint[0] - 1);
		const borderWidth = this.cellWidth * picx + this.linePixel * (picx - 1) + this.borderPixel * 2;
		const borderHeight = this.cellHeight * picy + this.linePixel * (picy - 1) + this.borderPixel * 2;
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.ctx.fillRect(xIni, yIni, borderWidth, this.borderPixel);
		this.ctx.fillRect(xIni + borderWidth - this.borderPixel, yIni, this.borderPixel, borderHeight);
		this.ctx.fillRect(xIni, yIni + borderHeight - this.borderPixel, borderWidth, this.borderPixel);
		this.ctx.fillRect(xIni, yIni, this.borderPixel, borderHeight);
		// hint
		this.ctx.fillStyle = "rgb(0,0,0)";
	    this.ctx.font = this.cellWidth * this.resolution + " 'sans-serif'";
	    this.ctx.textAlign = "center";
	    this.ctx.textBaseline = "middle";
		xIni = this.cellWidth * hint[1] + this.linePixel * (hint[1] - 1) + this.borderPixel + this.cellWidth / 2;
		yIni = this.cellHeight * hint[0] + this.linePixel * (hint[0] - 1) + this.borderPixel + this.cellHeight / 2;
	    // hintx
		this.hintArray[0].forEach((v, i) => {
			v.forEach((w, j) => {
				this.ctx.fillText(w, xIni + (this.cellWidth + this.linePixel) * i, (this.cellHeight + this.linePixel) * (hint[0] - 1 - j) + this.cellHeight / 2, this.cellWidth * this.resolution);
			});
		});
		// hinty
		this.hintArray[1].forEach((v, i) => {
			v.forEach((w, j) => {
				this.ctx.fillText(w, (this.cellWidth + this.linePixel) * (hint[1] - 1 - j) + this.cellWidth / 2, yIni + (this.cellHeight + this.linePixel) * i, this.cellWidth * this.resolution);
			});
		});
		// mouse event
		xIni = this.cellWidth * hint[1] + this.linePixel * (hint[1] - 1) + this.borderPixel - this.linePixel;
		yIni = this.cellHeight * hint[0] + this.linePixel * (hint[0] - 1) + this.borderPixel - this.linePixel;
		const cellCalc = (x, y) => {
			const cx = Math.floor((x - xIni) / (this.cellWidth + this.linePixel) / this.resolution) - 1;
			const cy = Math.floor((y - yIni) / (this.cellWidth + this.linePixel) / this.resolution) - 1;
			if(!(cx >= 0 && cx < picx && cy >= 0 && cy < picy))return false;
			return [cx, cy];
		};
		let prevCell = [];
		const mouseMove = (event) => {
			const currCell = cellCalc(event.layerX, event.layerY);
			if(currCell[0] === prevCell[0] && currCell[1] === prevCell[1])return;
			if(!currCell)return;
			if(event.button === 0) {
				this.pixelMap[currCell[1]][currCell[0]].turn();
			}
			if(event.button === 2) {
				this.pixelMap[currCell[1]][currCell[0]].regulate();
			}
			this.pixelMap[currCell[1]][currCell[0]].update();
			prevCell = currCell;
		};
		const eventEnd = (event) => {
			this.cvs.removeEventListener("mousemove", mouseMove);
			this.cvs.removeEventListener("mouseup", eventEnd);
		};
		const eventStart = (event) => {
			// event.button: left -> 0, right -> 2
			const currCell = cellCalc(event.layerX, event.layerY);
			if(!currCell)return;
			if(event.button === 0) {
				this.pixelMap[currCell[1]][currCell[0]].turn();
			}
			if(event.button === 2) {
				this.pixelMap[currCell[1]][currCell[0]].regulate();
			}
			this.pixelMap[currCell[1]][currCell[0]].update();
			prevCell = currCell;
			this.cvs.addEventListener("mousemove", mouseMove);
			this.cvs.addEventListener("mouseup", eventEnd);
		};
		this.cvs.addEventListener("mousedown", eventStart);
	}

	hintGenerator(pictureArray) {
		let hintx = [];
		let hinty = [];
		let pre = null;
		let count = 0;
		// hinty
		pictureArray.forEach(function(v, i) {
			hinty.push([]);
			count = 0;
			v.forEach(function(w, j) {
				if(w === 1) {
					count++;
					if(j === v.length - 1) {
						hinty[i].push(count);
					}
				} else {
					if(count) {
						hinty[i].push(count);
					}
					count = 0;
				}
			});
			if(hinty[i].length === 0){
				hinty[i] = [0];
			}
		});
		// hintx
		pictureArray[0].forEach(function(w, j) {
			hintx.push([]);
			count = 0;
			pictureArray.forEach(function(v, i) {
				if(v[j] === 1) {
					count++;
					if(i === v.length - 1) {
						hintx[j].push(count);
					}
				} else {
					if(count) {
						hintx[j].push(count);
					}
					count = 0;
				}
			});
			if(hintx[j].length === 0){
				hintx[j] = [0];
			}
		});
		return [hintx, hinty];
		/*
				hintx
				□□□□□□□□□
		hinty	□□□□□□□□□
				□□□□□□□□□
				□□□□□□□□□
		*/
	}

	canvasInitialize() {
		this.cvs.setAttribute("width", this.canvasWidth * this.resolution);
		this.cvs.setAttribute("height", this.canvasHeight * this.resolution);
		this.ctx.scale(this.resolution, this.resolution);
	}
}


const picture = [
[0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
[0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
[0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
[0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
[0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
[0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
[1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];


var game = new PicrossField(document.getElementById("canvasField"));
game.fieldGenerator(picture);
