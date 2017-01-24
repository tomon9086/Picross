class PicrossField {
	constructor(doc, fieldName) {
		this.doc = doc;
		this.fieldName = fieldName;
		this.pixelMap = [];
	}

	fieldGenerator(pictureArray) {
		this.pixelMap = [];
		var hintArray = this.hintGenerator(pictureArray);
		var hint = [];
		hintArray.forEach(function(v, i) {
			var max = 1;
			v.forEach(function(w, j) {
				w.forEach(function(x, k) {
					if(k > max) {
						max = k + 1;
					}
				});
			});
			hint[i] = max;
		});

		var fieldHTML = "";
		for(let i = 0; i < pictureArray[1].length + hint[0]; i++) {
			fieldHTML += '<tr class="fieldRow">';
			// fieldHTML += '<div class="fieldRow">';
			if(i >= hint[0]) { this.pixelMap.push([]); }
			for(let j = 0; j < pictureArray[0].length + hint[1]; j++) {
				if(i < hint[0] && j < hint[1]) {
					fieldHTML += '<td class="hintCell"></td>';
				} else if(i < hint[0]) {
					fieldHTML += '<td class="hintCell" id="hintx_' + (j - hint[1]) + '_' + (hint[0] - i - 1) + '"></td>';
				} else if(j < hint[1]) {
					fieldHTML += '<td class="hintCell" id="hinty_' + (i - hint[0]) + '_' + (hint[1] - j - 1) + '"></td>';
				} else {
					fieldHTML += '<td class="picrossCell"><input type="button" class="picrossPixel" id="pixel_' + (j - hint[1]) + '_' + (i - hint[0]) + '" onclick="game.pixelClicked(' + (j - hint[1]) + ', ' + (i - hint[0]) + ');" /></td>';
					// fieldHTML += '<input type="button" class="picrossPixel" id="pixel_' + i + '_' + j + '" onclick="picrossPixelClicked(' + i + ', ' + j + ');" />';
					this.pixelMap[i - hint[0]].push(0);
				}
			}
			fieldHTML += '</tr>';
			// fieldHTML += '</div>';
		}
		this.doc.getElementById(this.fieldName).innerHTML = fieldHTML;
		this.pixelMap.forEach((v, i) => {
			v.forEach((w, j) => {
				this.doc.getElementById("pixel_" + j + "_" + i).style.backgroundColor = "#FFFFFF";
			});
		});

		hintArray[0].forEach((v, i) => {
			v.forEach((w, j) => {
				this.doc.getElementById("hintx_" + i + "_" + j).innerHTML = w;
			});
		});
		hintArray[1].forEach((v, i) => {
			v.forEach((w, j) => {
				this.doc.getElementById("hinty_" + i + "_" + j).innerHTML = w;
			});
		});
	}

	hintGenerator(pictureArray) {
		var hintx = [];
		var hinty = [];
		var pre = null;
		var count = 0;
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
	}

	pixelClicked(x, y) {
		var pixel = this.doc.getElementById("pixel_" + x + "_" + y);
		if(pixel.style.backgroundColor === "rgb(255, 255, 255)") {
			pixel.style.backgroundColor = "#000000";
			pixelMap[y][x] = 1;
		} else {
			pixel.style.backgroundColor = "#FFFFFF";
			pixelMap[y][x] = 0;
		}
		// console.table(pixelMap);
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

var game = new PicrossField(document, "field");
game.fieldGenerator(picture);
