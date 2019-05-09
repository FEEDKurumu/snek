$(document).ready(function() {
  //creates empty grid with borders
  makeGrid();
  //keydown event runs keyPressed function
  $(document).on("keydown", keyPressed);
  //click event on start button runs anonymous function
  $("#start").on("click", function() {
    //if game is not already running
    if(!data.running){
      //resets/starts game
      resetGame();
      //hides start button
      $("#start").hide();
    }
  });
})

//data object holds game info
var data = {
  //score
  score: 0,
  //game state
  running: false,
  //key pressed recently
  keypress: false,
  //snake direction
  direction: "up",
  //array of snake body
  snake: []
}

//interval for move function
var interval;

//creates empty grid
function makeGrid() {
  var count = 0
  //loops from 1 to 20
  for(var i = 1; i < 22; i++){
    //creates new row
    var newRow = $("<div>").addClass("gridRow");
    //loops from 1 to 20
    for(var j = 1; j < 22; j++){
      //creates new tile
      var newTile = $("<div>").addClass("tile").attr('id', "" + j + "-" + i);
      //if tile is an edge tile
      if(i == 1 || j == 1 || i == 21 || j == 21){
        //adds edge class
        newTile.addClass("edge");
      }
      else {
        if(count % 2 == 0){
          newTile.addClass("empty");
        }
        else{
          newTile.addClass("empty2");
        }
        count++
      }
      //appends tile to row
      newRow.append(newTile);
    }
    //appends row to wrapper element
    $("#wrapper").append(newRow);
  }
  return
}

//resets/starts game
function resetGame() {
  //empties wrapper(holds grid)
  $("#wrapper").empty();
  makeGrid();
  data.score = 0;
  updateScore();
  data.running = true;
  data.keypress = false;
  //initial snake direction
  data.direction = "up";
  data.snake = [];
  //creates initial snake body
  data.snake.push("3-18");
  data.snake.push("3-17");
  //creates point on grid
  makePoint();
  //creates interval to run move function every 65 ms
  interval = setInterval(move, 65);
  return
}

//shows snake body
function showSnake() {
  //loops through snake array
  data.snake.forEach(function(e){
    $("#" + e).addClass("snake");
  })
  return
}

//moves snake body
function move() {
  //gets front position of snake body
  var current = data.snake[data.snake.length - 1];
  var x = current.split("-")[0];
  var y = current.split("-")[1];
  //if direction, add to x or y
  if(data.direction == "right"){
    x = parseInt(x) + 1
  }
  else if(data.direction == "left"){
    x = parseInt(x) - 1
  }
  else if(data.direction == "down"){
    y = parseInt(y) + 1
  }
  else if(data.direction == "up"){
    y = parseInt(y) - 1
  }
  var next = x + "-" + y;
  //checks game loss
  checkLoss(next);
  //pushes next tile to snake array
  data.snake.push(next);
  //checks if next tile is a point
  if($("#" + next).hasClass("point")){
    addPoint(next);
  }
  else {
    //removes tile from start of snake array
    var removed = data.snake.shift(0);
    $("#" + removed).removeClass("snake");
  }
  showSnake();
  data.keypress = false;
  return
}

//keydown event
function keyPressed(e) {
  var ltArrow = 37;
  var upArrow = 38;
  var rtArrow = 39;
  var dnArrow = 40;
  var space = 32;
  if (e) {
    var thisKey = e.which;
  }
  else {
    var thisKey = window.event.keyCode;
  }
  //resets game with space bar
  if(thisKey == space){
    if(!data.running){
      resetGame();
    }
  }
  //if left arrow pressed
  if (thisKey == ltArrow) {
    //if current direction is not right
    if(data.direction != "right"){
      //sets direction to left
      data.direction = "left"
    }
  }
  else if (thisKey == upArrow) {
    if(data.direction != "down"){
      data.direction = "up"
    }
  }
  else if (thisKey == rtArrow) {
    if(data.direction != "left"){
      data.direction = "right"
    }
  }
  else if (thisKey == dnArrow) {
    if(data.direction != "up"){
      data.direction = "down"
    }
  }
  data.keypress = true;
  return
}

//creates point tile
function makePoint() {
  while(true) {
    //random number between 2 and 19
    var x = Math.floor(Math.random() * 17) + 2;
    var y = Math.floor(Math.random() * 17) + 2;
    //if random tile isn't part of snake
    if(data.snake.indexOf(x + "-" + y) < 0){
      //creates the point tile
      $("#" + x + "-" + y).addClass("point");
      break
    }
  }
  return
}

//checks game loss
function checkLoss(next) {
  //if next tile is edge or part of snake
  if($("#" + next).hasClass("edge") || $("#" + next).hasClass("snake")){
    //stops move function
    clearInterval(interval);
    data.running = false;
    $("#start").show();
  }
  return
}

//adds point to score
function addPoint(next) {
  data.score++
  //removes point tile
  $("#" + next).removeClass("point");
  //adds new point tile
  makePoint();
  updateScore();
  return
}

//updates score element
function updateScore() {
  $("#score").html("Score: " + data.score);
}