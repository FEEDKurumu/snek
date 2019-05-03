$(document).ready(function() {
  makeGrid();
  $(document).on("keydown", changeDirection);
  $("#start").on("click", function() {
    if(data.running == false){
      resetGame();
    }
  });
})

var data = {
  score: 0,
  running: false,
  keypress: false,
  direction: "up",
  snake: []
}

var interval;

function makeGrid() {
  for(var i = 1; i < 21; i++){
    var newRow = $("<div>").addClass("gridRow");
    for(var j = 1; j < 21; j++){
      var newTile = $("<div>").addClass("tile empty").attr('id', "" + i + "-" + j);
      if(i == 1 || j == 1 || i == 20 || j == 20){
        newTile.addClass("edge");
      }
      newRow.append(newTile);
    }
    $("#wrapper").append(newRow);
  }
  return
}

function resetGame() {
  $("#wrapper").empty();
  $("#score").empty();
  makeGrid();
  data.score = 0;
  data.running = true;
  data.keypress = false;
  data.snake = [];
  data.direction = "up";
  data.snake.push("18-3");
  data.snake.push("18-4");
  makePoint();
  interval = setInterval(move, 50);
  return
}

function showSnake() {
  data.snake.forEach(function(e){
    $("#" + e).addClass("snake");
  })
  return
}

function move() {
  var current = data.snake[data.snake.length - 1];
  console.log(current);
  var next;
  if(data.direction == "right"){
    next = current.split("-")[0] + "-" + (parseInt(current.split("-")[1]) + 1)
  }
  else if(data.direction == "left"){
    next = current.split("-")[0] + "-" + (parseInt(current.split("-")[1]) - 1)
  }
  else if(data.direction == "down"){
    next = (parseInt(current.split("-")[0]) + 1) + "-" + current.split("-")[1]
  }
  else if(data.direction == "up"){
    next = (parseInt(current.split("-")[0]) - 1) + "-" + current.split("-")[1]
  }
  data.snake.push(next)
  if($("#" + next).hasClass("point")){
    addPoint(next);
  }
  else {
    var removed = data.snake.shift(0);
    $("#" + removed).removeClass("snake");
  }
  checkLoss(data.snake[data.snake.length - 1])
  showSnake();
  return
}

function changeDirection(e) {
  var ltArrow = 37;
  var upArrow = 38;
  var rtArrow = 39;
  var dnArrow = 40;
  if(data.keypress == false) {
    if (e) {
      var thisKey = e.which;
    }
    else {
      var thisKey = window.event.keyCode;
    }
    if (thisKey == ltArrow) {
      if(data.direction != "right"){
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
    setTimeout(function(){
      data.keypress = false;
    }, 50)
  }
  return
}

function makePoint() {
  while(true) {
    var x = Math.floor(Math.random() * 17) + 2;
    var y = Math.floor(Math.random() * 17) + 2;
    if(data.snake.indexOf(x + "-" + y) < 0){
      $("#" + x + "-" + y).addClass("point");
      break
    }
  }
  return
}

function checkLoss(next) {
  if($("#" + next).hasClass("edge") || $("#" + next).hasClass("snake")){
    clearInterval(interval);
    data.running = false;
  }
  return
}

function addPoint(next) {
  data.score++
  $("#" + next).removeClass("point");
  makePoint();
  updateScore();
  return
}

function updateScore() {
  $("#score").html("<p>" + data.score + "</p>");
}