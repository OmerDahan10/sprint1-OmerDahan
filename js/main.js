'use strict';
const MINE = '💣';
const FLAG = '🚩';
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var timeInterval;
var gLife = 3;
var gLevel = { size: 4, mines: 2 };
var gBoard;
var firstPress = true;
var isHint = false;
var gHint = 3;
var storageLevel = 'Easy';
var gSafe = 3;
var sevenBoomOn = false;

function init() {
    gBoard = createMat(gLevel.size);
    printMat(gBoard, '.board');

    createMines(gLevel.mines);
    printMat(gBoard, '.board');
    renderNeighbors(gBoard);
    gGame.isOn = true;
    renderBest();


}

function firstPs() {
    
    firstPress = false;
    var sec = 0;
    var min = 0;
    timeInterval = setInterval(() => {
        gGame.secsPassed++;
        sec++;
        if (sec < 60) document.querySelector('.time').innerText = `${min} : ${sec}`;
        else {
            sec = 0;
            min++;
            document.querySelector('.time').innerText = `${min} : ${sec}`;
        }

    }, 1000);
    sec = 0;
    min = 0;
    document.querySelector('.time').innerText = `0:0`;
}


function openCell(i, j, ev) {

    if (ev.which === 1) {

        if (!gGame.isOn) return;
        if (gBoard[i][j].isShown) return;
        if (gBoard[i][j].isMarked) return;
        if (!isHint) gBoard[i][j].isShown = true;

        if (gBoard[i][j].minesAroundCount > 0 && !gBoard[i][j].isMine) {
            renderCell({ i: i, j: j }, gBoard[i][j].minesAroundCount);
            if (!isHint) gGame.shownCount++
        } else if (gBoard[i][j].isMine) {
            if (firstPress) {
                gBoard[i][j].isShown = false;
                return;
            }
            renderCell({ i: i, j: j }, MINE);
            if (!isHint) {
                gLife--;
                renderLife();
            }
            GameOver();

        } else {
            renderCell({ i: i, j: j }, '');
            if (!isHint) gGame.shownCount++;
            openNegs(gBoard, i, j);

        }
    } else if (!gBoard[i][j].isMarked) {
        if (gGame.markedCount === gLevel.mines) return;
        gBoard[i][j].isMarked = true;
        renderCell({ i: i, j: j }, FLAG, true);
        gGame.markedCount++;
    } else {
        gBoard[i][j].isMarked = false;
        renderCell({ i: i, j: j }, '', true);
        gGame.markedCount--;
    }


    checkWin();
    if (firstPress === true) firstPs();

}

function createMines(length) {
    for (var t = 0; t < length; t++) {
        var i = getRandomInt(0, gBoard.length);
        var j = getRandomInt(0, gBoard.length);
        if (gBoard[i][j].isMine) t--;
        else gBoard[i][j].isMine = true;

    }
}

function GameOver() {
    if (gLife === 0) {
        renderLife();
        document.querySelector('.reset').innerText = '🤬';
        clearInterval(timeInterval);
        gGame.isOn = false;
        console.log('you lost');
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine) renderCell({ i: i, j: j }, MINE);
            }
        }
    }
}

function level(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    if (size === 4) storageLevel = 'Eazy';
    else if (size === 8) storageLevel = 'Hard'
    else storageLevel = 'Extreme';
    gBoard = createMat(gLevel.size);
    //console.log(gBoard)
    createMines(gLevel.mines)
    printMat(gBoard, '.board');
    renderNeighbors(gBoard);

}

function checkWin() {
    if (gGame.shownCount === Math.pow(gLevel.size, 2) - gLevel.mines) {
        gGame.isOn = false;
        document.querySelector('.reset').innerText = '🤑';
        clearInterval(timeInterval);
        checkBest();
        console.log('you win');
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isMarked = true;
                    renderCell({ i: i, j: j }, FLAG);
                }
            }
        }

    }
}

function restart() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    clearInterval(timeInterval);
    firstPress = true;
    gLife = 3;
    renderLife();
    gHint = 3;
    renderHint();
    document.querySelector('.reset').innerText = '😁';
    gSafe = 3;
    document.querySelector('.safe span').innerText = 3;
    sevenBoomOn = false;


    init();


}

function hint() {
    if (gHint === 0) return;
    isHint = true;
    gHint--;
    renderHint();
}

function renderHint() {
    if (gHint === 3) {
        document.querySelector('.hint').innerText = '💡💡💡';
    } else if (gHint === 2) document.querySelector('.hint').innerText = '💡💡';
    else if (gHint === 1) document.querySelector('.hint').innerText = '💡';
    else document.querySelector('.hint').innerText = 'No Hint';
}

function renderLife() {
    if (gLife === 3) {
        document.querySelector('.life').innerText = '❤️❤️❤️';
    } else if (gLife === 2) document.querySelector('.life').innerText = '❤️❤️';
    else if (gLife === 1) document.querySelector('.life').innerText = '❤️';
    else document.querySelector('.life').innerText = 'No Life';
}

function checkBest() {
    if (storageLevel === 'Easy') {
        if (localStorage.getItem('Easy') > gGame.secsPassed || localStorage.getItem('Easy') == null) {
            localStorage.setItem('Easy', gGame.secsPassed);
            renderBest();
        }
    } else if (storageLevel === 'Hard') {
        if (localStorage.getItem('Hard') > gGame.secsPassed || localStorage.getItem('Hard') == null) {
            localStorage.setItem('Hard', gGame.secsPassed);
            renderBest();
        }
    } else if (storageLevel === 'Extreme') {
        if (localStorage.getItem('Extreme') > gGame.secsPassed || localStorage.getItem('Extreme') == null) {
            localStorage.setItem('Extreme', gGame.secsPassed);
            renderBest();
        }
    }
}

function renderBest() {
    if (sevenBoomOn) return;
    var level = ['Easy', 'Hard', 'Extreme'];
    for (var i = 0; i < 3; i++) {
        var sec = localStorage.getItem(level[i]) % 60;
        var min = parseInt(localStorage.getItem(level[i]) / 60);
        document.querySelector(`.${level[i]}`).innerText = `${min}:${sec}`;

    }

}

function safeClick() {
    if (gSafe === 0) return;
    gSafe--;
    document.querySelector('.safe span').innerText--;
    var found = false;
    for (var i = 0; i < gLevel.size; i++) {
        if (found) break;
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false) {
                var cell = document.querySelector(`.cell${i}-${j}`);
                cell.classList.add('safe');
                found = true;
                break;
            }
        }
    }
    setTimeout(() => {
        cell.classList.remove('safe');

    }, 1000);
}

function sevenBoom() {
    sevenBoomOn = true;
    var count = 1;
    restart()
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (count % 7 === 0) gBoard[i][j].isMine = true;
            else gBoard[i][j].isMine = false;
            count++;
        }
    }



}