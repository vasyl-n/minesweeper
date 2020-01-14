const config = [
    {
        name: 'Peace of Cake',
        gridSize: 7,
        numOfMines: 15
    },
    {
        name: 'Right in the Middle',
        gridSize: 14,
        numOfMines: 22
    },
    {
        name: 'Nothing is Impossible',
        gridSize: 7,
        numOfMines: 15
    },
]
let moves = 0;

const openCellBackgroundColor = "linear-gradient(45deg, black, transparent)";

document.addEventListener('DOMContentLoaded', function(){
    
    var gridSize = 10;

    var container = document.getElementById('game-container');
    
    var bombs = [];
    // while(bombs.length < gridSize ** 1.3){
    while(bombs.length < gridSize ** 1){
        var rand = Math.ceil(Math.random() * (gridSize **2))
        if(bombs.indexOf(rand) < 0){
            bombs.push(rand)
        }
    }

    console.log(bombs)
    
    var counter = 1
    for(var i = 0; i < gridSize; i++){
        var row = document.createElement('div');
        row.setAttribute('class', 'row')
        for(var j = 0; j < gridSize; j++){
            var cell = document.createElement('div');
            cell.setAttribute('class', 'cell')
            cell.setAttribute('id', counter.toString())
            counter += 1
            row.appendChild(cell);
        };
        container.appendChild(row)
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
        return isPrevousBomb(id)
    }
    function isTopNextBomb(id){
        id = id - gridSize
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
    
    
    var openedCells = []
    function showOtherZeros(id){
        openedCells.push(id)
        var zeros = getZerosAround(id);
        var allIds = getIdsAround(id);
        for(var i = 0; i < allIds.length; i++){
            var bCount = bombCount(allIds[i])
            if (bCount !== 0) {
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



// For testing purposes, we'll just increment
// this and send it out to the console.
var justSomeNumber = 0;

// Define the work to be done
var doWork = function() {
    let num = justSomeNumber++
    num = num.toString();
    const splited = num.split('')
    if (splited.length > 2) {
        splited.splice(splited.length - 2, 0, ":")
    } else {
        splited.splice(0, 0, "0:")
    }
    document.getElementById("time-value").innerHTML = splited.join("");
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 10, doError);
var timerStarted = false;
    function game(event){
        var id = parseInt(event.target.getAttribute('id'));
        document.getElementById("moves-value").innerHTML = ++moves;
        if(isBomb(id)){
            ticker.stop();
            console.log("loooser")
            document.getElementById('game-container').removeEventListener('click', game);
            for(i = 0; i < bombs.length; i++){
                var bo = document.getElementById(bombs[i])
                bo.innerHTML = "<img class='mine' src='mine.png'>"
                event.target.style.background = openCellBackgroundColor;
                document.removeEventListener('click', game)
            }
        }
        else {
            if (!timerStarted) {
                ticker.start();
                timerStarted = true;
            }
            var bCount = bombCount(id)
            if(bCount !== 0){
                event.target.innerHTML = bCount
                event.target.style.background = openCellBackgroundColor;
            }
            if(bCount === 0){
                showOtherZeros(id)
            }
            
        }
    }
    
    document.getElementById('game-container').addEventListener('click', game)
    
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
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}