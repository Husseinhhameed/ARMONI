var playing = false;
var score;
var trialsleft;
var step; // for random steps
var action; // for setInterval
var fruits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; // for fruits

$(function () {
  // click on start or reset button
  $("#front").show();
  $("#startReset").click(function () {
    if (playing == true) {
      // if we are playing
      location.reload(); // reload page
    } else {
      // if we are not playing from before
      $("#front").hide();
      $("#score").show();
      playing = true;
      // set score to 0
      score = 0;
      $("#scoreValue").html(score);

      // show trials left box
      $("#trialsleft").show();
      trialsleft = 3;
      addhearts();

      // hide game over box
      $("#gameOver").hide();

      // change button to reset game
      $("#startReset").html("Reset Game");

      // start action
      startAction();
    }
  });

  // slice a fruit
  $("#fruit1").mouseover(function () {
    score++; // increase score
    $("#scoreValue").html(score);

    // play sound
    $("#slicesound")[0].play();

    // stop fruit
    clearInterval(action);

    // hide fruit
    $("#fruit1").hide("explode", 500); // slice fruit

    // send new fruit
    setTimeout(startAction, 500);
  });

  // functions

  // add hearts
  function addhearts() {
    $("#trialsleft").empty();
    for (i = 0; i < trialsleft; i++) {
      $("#trialsleft").append(
        '<img src="https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png" , class="life">'
      );
    }
  }

  function startAction() {
    // generate random fruit
    $("#fruit1").show();
  
    // choose random fruit
    chooseRandom();
    // random position
    var containerWidth = $("#fruitcontainer").width();
    $("#fruit1").css({
      left: Math.round((containerWidth - 50) * Math.random()), // Adjust position based on container width
      top: -50,
    });
    // generate random step
    step = 0.5 + Math.round(1 * Math.random()); // change steps to be even slower
    // descend fruits down by 10ms
    action = setInterval(function () {
      // move fruit by one step
      $("#fruit1").css("top", $("#fruit1").position().top + step);
  
      // check if the fruit is too low
      if ($("#fruit1").position().top > $("#fruitcontainer").height() - 50) {
        // yes it is low
        // check trials left
        if (trialsleft > 1) {
          // generate a fruit
          $("#fruit1").show();
          // choose random fruit
          chooseRandom();
          // random position
          $("#fruit1").css({
            left: Math.round((containerWidth - 50) * Math.random()), // Adjust position based on container width
            top: -50,
          });
          // generate random step
          step = 0.5 + Math.round(1 * Math.random()); // change steps to be even slower
  
          // reduce trials by one
          trialsleft--;
          // populate trials left box by one
          addhearts();
        } else {
          // game over
          playing = false; // we are not playing anymore
          $("#score").hide();
          $("#startreset").html("Start Game");
          $("#gameOver").show();
          $("#gameOver").html(
            "<p>Game Over!</p><p>Your score is " + score + "</p>"
          );
          $("#trialsleft").hide();
          stopAction(); // stops Action
        }
      }
    }, 10);
  }
  
  // choose random fruits
  function chooseRandom() {
    $("#fruit1").attr(
      "src",
      "https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/" +
        fruits[Math.round(9 * Math.random())] +
        ".png"
    );
  }

  // Stop Action
  function stopAction() {
    clearInterval(action);
    $("#fruit1").hide();
  }
});
