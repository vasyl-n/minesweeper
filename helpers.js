import { OPEN_CELL_BACKGROUND, config } from "./gameConfig.js"

function isBottomNextBomb(id, bombs, gridSize){
  id = id + gridSize
  return isNextBomb(id, bombs, gridSize)
}

function isBottomPrevBomb(id, bombs, gridSize){
  id = id + gridSize
  if (id >= gridSize * gridSize) return false
  return isPrevousBomb(id, bombs, gridSize)
}

function isTopNextBomb(id, bombs, gridSize){
  id = id - gridSize
  if (id <= 0) return false
  return isNextBomb(id, bombs, gridSize)
}
function isTopPrevBomb(id, bombs, gridSize){
  id = id - gridSize
  return isPrevousBomb(id, bombs, gridSize)
}

function isOnBottomBomb(id, bombs, gridSize){
  return isBomb(id + gridSize, bombs)
}

function isOnTopBomb(id, bombs, gridSize){
  return isBomb(id - gridSize, bombs)
}

function isNextBomb(id, bombs, gridSize){
  if(isBomb(id+1, bombs) && !isInLastCol(id, gridSize)){
      return true;
  } else {return false}
}

function isPrevousBomb(id, bombs, gridSize){
  if(isBomb(id-1, bombs) && !isInFirstCol(id, gridSize)){
      return true;
  } else {return false}
}

function isBomb(id, bombs){
  if(bombs.indexOf(id) >= 0){
      return true;
  } else {
      return false;
  }
}

function bombCount(id, bombs, gridSize){
  var count = 0;
  if(isOnBottomBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isNextBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isOnTopBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isPrevousBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isTopNextBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isTopPrevBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isBottomNextBomb(id, bombs, gridSize)){
      count += 1
  }
  if(isBottomPrevBomb(id, bombs, gridSize)){
      count += 1
  }
  return count
}


function isZero(id, bombs, gridSize){
  if(id < 1 || id > gridSize * gridSize){return false}
  if(bombCount(id, bombs, gridSize) === 0){
      return true;
  } else {
      return false;
  }
}

function isInFirstCol(id, gridSize){
  var ar = [];
  for(var i = 1; i < gridSize**2; i+=gridSize){
      ar.push(i)
  } return ar.includes(id)
}

function isInLastCol(id, gridSize){
  var ar = [];
  for(var i = gridSize; i <= gridSize**2; i+=gridSize){
      ar.push(i)
  } return ar.includes(id)
}

function getZerosAround(id, bombs, gridSize){
  var arr = [];
  if(!isInLastCol(id, gridSize)){arr.push(id+1)}
  if(!isInFirstCol(id, gridSize)){arr.push(id-1)}
  if(id > gridSize){arr.push(id-gridSize)}
  if(id < gridSize*gridSize-gridSize){arr.push(id+gridSize)}
  if(!isInLastCol(id, gridSize) && id < gridSize*gridSize-gridSize){arr.push(id+gridSize + 1)}
  if(!isInLastCol(id, gridSize) && id > gridSize){arr.push(id - gridSize + 1)}
  if(!isInFirstCol(id, gridSize) && id > gridSize){arr.push(id - gridSize - 1)}
  if(!isInFirstCol(id, gridSize) && id < gridSize*gridSize-gridSize){arr.push(id + gridSize - 1)}
  
  return arr.filter(function(x){
      return isZero(x, bombs, gridSize)
  })
}

function getIdsAround(id, gridSize){
  var arr = [];
  if(!isInLastCol(id, gridSize)){arr.push(id+1)}
  if(!isInFirstCol(id, gridSize)){arr.push(id-1)}
  if(id > gridSize){arr.push(id-gridSize)}
  if(id <= gridSize*gridSize-gridSize){arr.push(id+gridSize)}
  if(!isInLastCol(id, gridSize) && id < gridSize*gridSize-gridSize){arr.push(id+gridSize + 1)}
  if(!isInLastCol(id, gridSize) && id > gridSize){arr.push(id - gridSize + 1)}
  if(!isInFirstCol(id, gridSize) && id > gridSize){arr.push(id - gridSize - 1)}
  if(!isInFirstCol(id, gridSize) && id <= gridSize*gridSize-gridSize){arr.push(id + gridSize - 1)}
  return arr
}

function showOtherZeros(id, bombs, gridSize, openedCells){
  openedCells.push(id)
  var zeros = getZerosAround(id, bombs, gridSize);
  var allIds = getIdsAround(id, gridSize);
  for(var i = 0; i < allIds.length; i++){
      var bCount = bombCount(allIds[i], bombs, gridSize)
      if (bCount !== 0) {
          if(!openedCells.includes(allIds[i])){
              openedCells.push(allIds[i])
          }
          document.getElementById(allIds[i].toString()).innerHTML = bCount
      }
      document.getElementById(allIds[i].toString()).style.background = OPEN_CELL_BACKGROUND;
  }
  for(var j = 0; j < zeros.length; j++){
      if(!openedCells.includes(zeros[j])){
          showOtherZeros(zeros[j], bombs, gridSize, openedCells);
      }
  }
}

function getTimeInner() {
  let timerCount = 0;
  return () => {
    let num = timerCount++
    num = num.toString();
    const splited = num.split('')
    if (splited.length > 2) {
      splited.splice(splited.length - 2, 0, ":")
    } else {
      splited.splice(0, 0, "0:")
    }
    document.getElementById("time-value").innerHTML = splited.join("");
  }
};

function showSettings(settingsOn) {
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

function getRotateGear() {
  var gearAngle = 0
  return () => {
    gearAngle += 2
    document.getElementById('gear-img').style.transform = `rotate(${gearAngle}deg)`;
  }
}

const rotateGear = getRotateGear();
const getTime = getTimeInner()

export { isBomb, bombCount, showOtherZeros, getTime, showSettings, rotateGear }