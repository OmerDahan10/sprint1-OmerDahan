'use strict';

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {

            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td class="${className}" onmouseup="openCell(${i},${j},event)"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push(createCell());
        }
        mat.push(row)
    }
    return mat
}

function countNeighbors(gBoard, rowIdx, colIdx) {


    var neighborsCounter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j];

            if (cell.isMine) neighborsCounter++



        }
    }

    return neighborsCounter
}

function openNegs(gBoard, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j];
            if (cell.isMine) continue;
            if (cell.isMarked) continue;

            if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isShown === false) {
                if (!isHint) {
                    gBoard[i][j].isShown = true;
                    gGame.shownCount++;

                }
                renderCell({ i: i, j: j }, '');
                openNegs(gBoard, i, j);
            } else if (gBoard[i][j].minesAroundCount > 0 && gBoard[i][j].isShown === false) {
                renderCell({ i: i, j: j }, gBoard[i][j].minesAroundCount);
                if (!isHint) {

                    gBoard[i][j].isShown = true;
                    gGame.shownCount++;
                }

            }



        }
    }

}

function renderNeighbors(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var count = countNeighbors(gBoard, i, j)

            gBoard[i][j].minesAroundCount = count;

        }
    }
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function renderCell(location, value, isFlag = false) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerText = value;
    if (!isFlag) {
        if (!elCell.classList.contains('opened')) elCell.classList.add('opened');
    }
    if (isHint) {
        setTimeout(() => {
            elCell.classList.remove('opened');
            elCell.innerText = '';
            isHint = false;

        }, 1000)

    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

