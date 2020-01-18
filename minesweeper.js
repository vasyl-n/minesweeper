const config = {
    easy: {
        name: 'Piece of Cake',
        gridSize: 7,
        numOfMines: 5
    },
    medium: {
        name: 'Right in the Middle',
        gridSize: 14,
        numOfMines: 22
    },
    hard: {
        name: 'Nothing is Impossible',
        gridSize: 19,
        numOfMines: 60
    }
}

let moves = 0;

const openCellBackgroundColor = "gray";

document.addEventListener('DOMContentLoaded', function(){
    
    var gridSize;
    var container = document.getElementById('game-container');
    var bombs = [];
    var openedCells = []
    var timerCount = 0;
    var ticker = new AdjustingInterval(getTime, 10);
    var timerStarted = false;
    var settingsOn = false;
    var currentDifficulty;

    var gearAnimationTimer = new AdjustingInterval(rotateGear, 100);
    var gearAngle = 0
    function rotateGear() {
        gearAngle += 2
        document.getElementById('gear-img').style.transform = `rotate(${gearAngle}deg)`;
    }
    gearAnimationTimer.start()
    var startGame = function(size = config.medium.gridSize, nMines = config.medium.numOfMines, difficulty = "medium") {
        document.getElementById("header").innerHTML = "Sweep the Mines"

        settingsOn = false;
        if (size) {
            gridSize = size;
        }
        currentDifficulty = difficulty;
        bombs = [];
        timerCount = 0;
        ticker.stop()
        moves = 0;
        openedCells = [];
        timerStarted = false;
        document.getElementById("moves-value").innerHTML = 0;
        document.getElementById('face-img').removeEventListener('click', startGame);
        document.getElementById('face-img').setAttribute("src", "happy.png")
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
                console.log(cells[i])
                cells[i].classList.add("cell-compressed");
            }
        }
    }

    function isBomb(id){
        if(bombs.indexOf(id) >= 0){
            return true;
        } else {
            return false;
        }
    }
    
    function isZero(id){
        if(id < 1 || id > gridSize * gridSize){return false}
        if(bombCount(id) === 0){
            return true;
        } else {
            return false;
        }
    }
    
    function bombCount(id){
        var count = 0;
        if(isOnBottomBomb(id)){
            count += 1
        }
        if(isNextBomb(id)){
            count += 1
        }
        if(isOnTopBomb(id)){
            count += 1
        }
        if(isPrevousBomb(id)){
            count += 1
        }
        if(isTopNextBomb(id)){
            count += 1
        }
        if(isTopPrevBomb(id)){
            count += 1
        }
        if(isBottomNextBomb(id)){
            count += 1
        }
        if(isBottomPrevBomb(id)){
            count += 1
        }
        return count
    }
    
    function isBottomNextBomb(id){
        id = id + gridSize
        return isNextBomb(id)
    }
    
    function isBottomPrevBomb(id){
        id = id + gridSize
        if (id >= gridSize * gridSize) return false
        return isPrevousBomb(id)
    }
    function isTopNextBomb(id){
        id = id - gridSize
        if (id <= 0) return false
        return isNextBomb(id)
    }
    function isTopPrevBomb(id){
        id = id - gridSize
        return isPrevousBomb(id)
    }
    
    function isOnBottomBomb(id){
        return isBomb(id + gridSize)
    }
    
    function isOnTopBomb(id){
        return isBomb(id - gridSize)
    }
    
    function isNextBomb(id){
        if(isBomb(id+1) && !isInLastCol(id)){
            return true;
        } else {return false}
    }
    
    function isPrevousBomb(id){
        if(isBomb(id-1) && !isInFirstCol(id)){
            return true;
        } else {return false}
    }
    
    function isBottomNext(id, callback){
        id = id + gridSize
        return isNext(id, callback)
    }
    
    function isBottomPrev(id, callback){
        id = id + gridSize
        return isPrevous(id, callback)
    }
    function isTopNext(id, callback){
        id = id - gridSize
        return isNext(id, callback)
    }
    function isTopPrev(id, callback){
        id = id - gridSize
        return isPrevous(id, callback)
    }
    
    function isOnBottom(id, callback){
        return callback(id + gridSize)
    }
    
    function isOnTop(id, callback){
        return callback(id - gridSize)
    }
  
    function isNext(id, callback){
        if(callback(id+1) && !isInLastCol(id)){
            return true;
        } else {return false}
    }
    
    function isPrevous(id, callback){
        if(callback(id-1) && !isInFirstCol(id)){
            return true;
        } else {return false}
    }
    
    function isInFirstCol(id){
        var ar = [];
        for(var i = 1; i < gridSize**2; i+=gridSize){
            ar.push(i)
        } return ar.includes(id)
    }
    
    function isInLastCol(id){
        var ar = [];
        for(var i = gridSize; i <= gridSize**2; i+=gridSize){
            ar.push(i)
        } return ar.includes(id)
    }
    
    function getZerosAround(id){
        var arr = [];
        if(!isInLastCol(id)){arr.push(id+1)}
        if(!isInFirstCol(id)){arr.push(id-1)}
        if(id > gridSize){arr.push(id-gridSize)}
        if(id < gridSize*gridSize-gridSize){arr.push(id+gridSize)}
        if(!isInLastCol(id) && id < gridSize*gridSize-gridSize){arr.push(id+gridSize + 1)}
        if(!isInLastCol(id) && id > gridSize){arr.push(id - gridSize + 1)}
        if(!isInFirstCol(id) && id > gridSize){arr.push(id - gridSize - 1)}
        if(!isInFirstCol(id) && id < gridSize*gridSize-gridSize){arr.push(id + gridSize - 1)}
        
        return arr.filter(function(x){
            return isZero(x)
        })
    }
    
    function getIdsAround(id){
        var arr = [];
        if(!isInLastCol(id)){arr.push(id+1)}
        if(!isInFirstCol(id)){arr.push(id-1)}
        if(id > gridSize){arr.push(id-gridSize)}
        if(id <= gridSize*gridSize-gridSize){arr.push(id+gridSize)}
        if(!isInLastCol(id) && id < gridSize*gridSize-gridSize){arr.push(id+gridSize + 1)}
        if(!isInLastCol(id) && id > gridSize){arr.push(id - gridSize + 1)}
        if(!isInFirstCol(id) && id > gridSize){arr.push(id - gridSize - 1)}
        if(!isInFirstCol(id) && id <= gridSize*gridSize-gridSize){arr.push(id + gridSize - 1)}
        return arr
    }
    
    function showOtherZeros(id){
        openedCells.push(id)
        var zeros = getZerosAround(id);
        var allIds = getIdsAround(id);
        for(var i = 0; i < allIds.length; i++){
            var bCount = bombCount(allIds[i])
            if (bCount !== 0) {
                if(!openedCells.includes(allIds[i])){
                    openedCells.push(allIds[i])
                }
                document.getElementById(allIds[i].toString()).innerHTML = bCount
            }
            document.getElementById(allIds[i].toString()).style.background = openCellBackgroundColor;
        }
        for(var j = 0; j < zeros.length; j++){
            if(!openedCells.includes(zeros[j])){
                showOtherZeros(zeros[j]);
            }
        }
    }

    function getTime() {
        let num = timerCount++
        num = num.toString();
        const splited = num.split('')
        if (splited.length > 2) {
            splited.splice(splited.length - 2, 0, ":")
        } else {
            splited.splice(0, 0, "0:")
        }
        document.getElementById("time-value").innerHTML = splited.join("");
    };

    function game(event){
        var id = parseInt(event.target.getAttribute('id'));
        if (!openedCells.includes(id)) {
            document.getElementById("moves-value").innerHTML = ++moves;
        }
        if(isBomb(id)){
            ticker.stop();
            document.getElementById('face-img').setAttribute("src", "sad.png")
            document.getElementById('face-img').addEventListener('click', () => startGame(gridSize, config[currentDifficulty].numOfMines, currentDifficulty))

            var cells = document.getElementsByClassName("cell");
            for (var i = 1; i <= cells.length; i++) {
                cells[i - 1].removeEventListener('click', game);
                var cell = document.getElementById(i)
                if (bombs.indexOf(i) >= 0) {
                    cell.innerHTML = "<img class='mine' src='mine.png'>"
                    cell.style.background = openCellBackgroundColor;
                } else {    
                    var bCount = bombCount(i)
                    if(bCount !== 0){
                        cell.innerHTML = bCount
                        cell.style.background = openCellBackgroundColor;
                    }
                    if(bCount === 0){
                        cell.style.background = openCellBackgroundColor;
                        showOtherZeros(i)
                    }
                }
            }
        }
        else {
            if (!timerStarted) {
                ticker.start();
                timerStarted = true;
            }
            var bCount = bombCount(id)
            if(bCount !== 0){
                openedCells.push(id)
                event.target.innerHTML = bCount
                event.target.style.background = openCellBackgroundColor;
            }
            if(bCount === 0){
                event.target.style.background = openCellBackgroundColor;
                showOtherZeros(id)
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
        if (openedCount >= numOfCells - currentConfig.numOfMines) {
            document.getElementById("header").innerHTML = "Congrats!"
            ticker.stop();
            for (var i = 1; i <= gridSize* gridSize; i++) {
                const cell = document.getElementById(i)
                cell.removeEventListener('click', game);
            }
            document.getElementById('face-img').addEventListener('click', () => startGame(gridSize, config[currentDifficulty].numOfMines, currentDifficulty))
        }
    }

    function showSettings() {
        if(!settingsOn) {
            document.getElementById('game-container').style.display = "none";
            document.getElementById('settings-container').style.display = "block";
            settingsOn = true;
        } else {   
            document.getElementById('game-container').style.display = "block";
            document.getElementById('settings-container').style.display = "none";
            settingsOn = false;
        }
        document.getElementById('easy').addEventListener('click', () => startGame(config.easy.gridSize, config.easy.numOfMines, "easy"))
        document.getElementById('medium').addEventListener('click', () => startGame(config.medium.gridSize, config.medium.numOfMines, "medium"))
        document.getElementById('hard').addEventListener('click', () => startGame(config.hard.gridSize, config.hard.numOfMines, "hard"))
    }
    
    startGame();
    document.getElementById('gear-img').addEventListener('click', showSettings)
    
})

function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}