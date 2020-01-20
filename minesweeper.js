import { config, OPEN_CELL_BACKGROUND } from "./gameConfig.js"
import Interval from './interval.js';
import { isBomb, bombCount, showOtherZeros, getTime, showSettings, rotateGear } from './helpers.js'

let moves = 0;
var gridSize;
var container = document.getElementById('game-container');
var bombs = [];
var openedCells = []
var ticker = new Interval(getTime, 10);
var timerStarted = false;
var settingsOn = false;
var currentDifficulty;
var gearAnimationTimer = new Interval(rotateGear, 100);

export const startGame = function(size = config.medium.gridSize, nMines = config.medium.numOfMines, difficulty = "medium") {
    document.getElementById("header").innerHTML = "Sweep the Mines"
    settingsOn = false;
    if (size) {
        gridSize = size;
    }
    currentDifficulty = difficulty;
    bombs = [];
    ticker.stop()
    moves = 0;
    openedCells = [];
    timerStarted = false;
    document.getElementById("moves-value").innerHTML = 0;
    document.getElementById('face-img').removeEventListener('click', startGame);
    document.getElementById('face-img').setAttribute("src", "assets/happy.png")
    document.getElementById("time-value").innerHTML = "0:00";
    container.innerHTML = "";
    

    while(bombs.length < nMines){
        var rand = Math.ceil(Math.random() * (gridSize **2))
        if(bombs.indexOf(rand) < 0){
            bombs.push(rand)
        }
    }

    var counter = 1
    for(var i = 0; i < gridSize; i++){
        var row = document.createElement('div');
        row.setAttribute('class', 'row')
        for(var j = 0; j < gridSize; j++){
            var cell = document.createElement('div');
            cell.setAttribute('class', 'cell')
            cell.setAttribute('id', counter.toString())
            cell.addEventListener('click', game)
            counter += 1
            row.appendChild(cell);
        };
        container.appendChild(row)
    }
    document.getElementById('settings-container').style.display = "none";
    document.getElementById('game-container').style.display = "block";
    document.getElementById('container').style.display = "block";
    if (size === config.hard.gridSize) {
        var cells = document.getElementsByClassName("cell");
        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.add("cell-compressed");
        }
    }
}

function game(event){
    var id = parseInt(event.target.getAttribute('id'));
    if (!openedCells.includes(id)) {
        document.getElementById("moves-value").innerHTML = ++moves;
    }
    if(isBomb(id, bombs)){
        // playBombTone();
        ticker.stop();
        document.getElementById('face-img').setAttribute("src", "assets/sad.png")
        document.getElementById('face-img').addEventListener('click', () => startGame(gridSize, config[currentDifficulty].numOfMines, currentDifficulty))

        var cells = document.getElementsByClassName("cell");
        for (var i = 1; i <= cells.length; i++) {
            cells[i - 1].removeEventListener('click', game);
            var cell = document.getElementById(i)
            if (bombs.indexOf(i) >= 0) {
                cell.innerHTML = "<img class='mine' src='assets/mine.png'>"
                cell.style.background = OPEN_CELL_BACKGROUND;
            } else {    
                var bCount = bombCount(i, bombs, gridSize)
                if(bCount !== 0){
                    cell.innerHTML = bCount
                    cell.style.background = OPEN_CELL_BACKGROUND;
                }
                if(bCount === 0){
                    cell.style.background = OPEN_CELL_BACKGROUND;
                    showOtherZeros(i, bombs, gridSize, openedCells)
                }
            }
        }
    }
    else {
        if (!timerStarted) {
            ticker.start();
            timerStarted = true;
        }
        var bCount = bombCount(id, bombs, gridSize)
        if(bCount !== 0){
            // playNumberTone()
            openedCells.push(id)
            event.target.innerHTML = bCount
            event.target.style.background = OPEN_CELL_BACKGROUND;
        }
        if(bCount === 0){
            // playEmptyCellTone()
            event.target.style.background = OPEN_CELL_BACKGROUND;
            showOtherZeros(id, bombs, gridSize, openedCells)
        }
    }
    const currentConfig = Object.keys(config).reduce((acc, el) => {
        if (acc !== null) return acc;
        if (config[el].gridSize === gridSize) {
            acc = config[el]
        }
        return acc;
    }, null)

    const numOfCells = currentConfig.gridSize * currentConfig.gridSize;
    let openedCount = openedCells.length;
    if (openedCount >= numOfCells - currentConfig.numOfMines && ! isBomb(id, bombs)) {
        document.getElementById("header").innerHTML = "Congrats!"
        ticker.stop();
        for (var i = 1; i <= gridSize* gridSize; i++) {
            const cell = document.getElementById(i)
            cell.removeEventListener('click', game);
        }
        document.getElementById('face-img').addEventListener('click', () => startGame(gridSize, config[currentDifficulty].numOfMines, currentDifficulty))
    }
}

document.addEventListener('DOMContentLoaded', function(){
    startGame();
    document.getElementById('gear-img').addEventListener('click', () => showSettings(settingsOn))
    gearAnimationTimer.start()
})
