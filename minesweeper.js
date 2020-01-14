document.addEventListener('DOMContentLoaded', function(){
    
    var gridSize = parseInt(prompt("Set size"));

    var container = document.getElementById('container');
    
    var bombs = [];
    while(bombs.length < gridSize ** 1.3){
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
            document.getElementById(allIds[i].toString()).innerHTML = bCount
        }
        for(var j = 0; j < zeros.length; j++){
            if(!openedCells.includes(zeros[j])){
                showOtherZeros(zeros[j]);
            }
        }
    }

    
    function game(event){
        var id = parseInt(event.target.getAttribute('id'));
        console.log(getIdsAround(id),isInLastCol(id))
        if(isBomb(id)){
            console.log("loooser")
            for(i = 0; i < bombs.length; i++){
                var bo = document.getElementById(bombs[i])
                bo.innerHTML = "B"
                document.removeEventListener('click', game)
            }
        }
        else {
            var bCount = bombCount(id)
            event.target.innerHTML = bCount
            if(bCount === 0){
                showOtherZeros(id)
            }
        }
    }
    
    document.addEventListener('click', game)
    
})