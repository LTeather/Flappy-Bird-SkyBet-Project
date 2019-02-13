// Global variable decloration
const initViewportWidth = document.documentElement.clientWidth;
const initViewportHeight = document.documentElement.clientHeight;
const initNoOfPipes = Math.round((initViewportHeight - 150) / 50);
var pipeSpeed = 200;
var pipeDistance =(initViewportHeight/1.9);
var pipeSpawnRate = (pipeDistance/pipeSpeed) * 1000;
var pipeBeingChecked = 0;

var highscore = 0;
var themeStr = "";
var start = false;

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['VT323']
    }
};

// Create our 'main' state that will contain the game
var mainState = {
  preload: function() {
      // Load the bird sprites
      game.load.image('bird_bet',    'assets/images/bird_bet.png');
      game.load.image('bird_bingo',  'assets/images/bird_bingo.png');
      game.load.image('bird_casino', 'assets/images/bird_casino.png');
      game.load.image('bird_poker',  'assets/images/bird_poker.png');
      game.load.image('bird_vegas',  'assets/images/bird_vegas.png');

      // Load pipe sprites
      game.load.image('pipe_bet',    'assets/images/pipe_bet.png');
      game.load.image('pipe_bingo',  'assets/images/pipe_bingo.png');
      game.load.image('pipe_casino', 'assets/images/pipe_casino.png');
      game.load.image('pipe_poker',  'assets/images/pipe_poker.png');
      game.load.image('pipe_vegas',  'assets/images/pipe_vegas.png');

      // Load land sprites
      game.load.image('land_bet',    'assets/images/land_bet.png');
      game.load.image('land_bingo',  'assets/images/land_bingo.png');
      game.load.image('land_casino', 'assets/images/land_casino.png');
      game.load.image('land_poker',  'assets/images/land_poker.png');
      game.load.image('land_vegas',  'assets/images/land_vegas.png');

      // Load blank land sprites
      game.load.image('land_blank_bet',    'assets/images/land_blank_bet.png');
      game.load.image('land_blank_bingo',  'assets/images/land_blank_bingo.png');
      game.load.image('land_blank_casino', 'assets/images/land_blank_casino.png');
      game.load.image('land_blank_poker',  'assets/images/land_blank_poker.png');
      game.load.image('land_blank_vegas',  'assets/images/land_blank_vegas.png');

      // Load sky sprites
      game.load.image('sky_bet',     'assets/images/sky_bet.png');
      game.load.image('sky_bingo',   'assets/images/sky_bingo.png');
      game.load.image('sky_casino',  'assets/images/sky_casino.png');
      game.load.image('sky_poker',   'assets/images/sky_poker.png');
      game.load.image('sky_vegas',   'assets/images/sky_vegas.png');

      // Load secret sprite
      game.load.image('secret',      'assets/images/secretSprite.png');

      // Load splash sprite
      game.load.image('splash',      'assets/images/splash.png');

      // Load jump sound
      game.load.audio('jump',        'assets/sounds/jump.wav');
      game.load.audio('death',       'assets/sounds/death.wav');

      //  Load the Google WebFont Loader script
      game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function() {
        themeTXT = localStorage.getItem('site');
        if (themeTXT == null) {
          themeTXT = "bet";
        }

        this.endGameChangeVars();

        // Gets the theme from the text file and sets it
        switch(themeTXT) {
            case "bet":
                themeStr = "bet";
                break;
            case "bingo":
                themeStr = "bingo";
                break;
            case "casino":
                themeStr = "casino";
                break;
            case "poker":
                themeStr = "poker";
                break;
            case "vegas":
                themeStr = "vegas";
                break;
        }

        // Change the background color of the game to match the theme
        switch(themeTXT) {
            case "bet":
                game.stage.backgroundColor = '#7d0b00';
                break;
            case "bingo":
                game.stage.backgroundColor = '#73007d';
                break;
            case "casino":
                game.stage.backgroundColor = '#007d5a';
                break;
            case "poker":
                game.stage.backgroundColor = '#00787d';
                break;
            case "vegas":
                game.stage.backgroundColor = '#7d0f00';
                break;
        }

      // Set the physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      for(var i = 0; i < 8; i++) {
          this.land = game.add.sprite(i * 336, initViewportHeight - 112, 'land_blank_' + themeStr);
          game.physics.arcade.enable(this.land);
          this.land.body.velocity.x = -pipeSpeed;
      }

      for(var i = 0; i < 10; i++) {
          this.sky = game.add.sprite(i * 276, initViewportHeight - 222, 'sky_' + themeStr);
      }

      // Setup the jump sound effect
      this.jumpSound  = game.add.audio('jump');
      this.deathSound = game.add.audio('death');

      // Display the bird at the position x=100 and y=245
      this.bird = game.add.sprite(100, initViewportHeight / 3, 'bird_' + themeStr);

      // Add physics to the bird
      // Needed for: movements, gravity, collisions, etc.
      game.physics.arcade.enable(this.bird);

      // Add gravity to the bird to make it fall
      this.bird.body.gravity.y = 0;

      // Move the anchor to the left and downward
      this.bird.anchor.setTo(-0.2, 0.5);

      // Allows capturing of mouse input
      game.input.mouse.capture = true;

      // Adds scoreboard
      this.score = 0;

      this.labelScore = game.add.text(initViewportWidth / 2, 50, "0",
        { font: "45px VT323", fill: "#f1f1f1" });

      this.labelScore.fontSize = 60;
      this.labelScore.stroke = '#000000';
      this.labelScore.strokeThickness = 5;

      this.labelScore.anchor.setTo(0.5, 0.5);

      // Call the 'jump' function when the spacekey is hit
      var spaceKey = game.input.keyboard.addKey(
                      Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.add(this.jump, this);

      // Call the 'jump' function when screen is clicked
      game.input.onDown.add(this.jump, this);

      // Create an empty group
      this.pipes = game.add.group();
      this.floors = game.add.group();

      // Create & display the start screen image/info
      this.splash = game.add.sprite(initViewportWidth / 2, initViewportHeight / 2, 'splash');
      this.splash.anchor.setTo(0.5, 0.5);
      if(initViewportWidth < 1000) {
          this.splash.scale.setTo(0.5, 0.5);
      }

      // Creates floors
      this.timer = game.time.events.loop(1645, this.addFloor, this);

      this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      game.input.addPointer();
  },

  update: function() {
      // If the bird is out of the screen (too high or too low)
      // Call the 'restartGame' function
      if (this.bird.y < 0 || this.bird.y > initViewportHeight - 175) {
        this.restartGame();
      }

      // Checks to see if pipes group has pipes and checks to see if bird has passed pipe hole
      if (this.pipes.children.length > pipeBeingChecked && this.bird.alive == true) {
        if (this.pipes.children[pipeBeingChecked].x < this.bird.x) {
          this.score += 1;
          this.labelScore.text = this.score;
          pipeBeingChecked += (initNoOfPipes-2);
        }
      }

      // Makes the bird rotate for effect
      if(start == true) {
        if (this.bird.angle < 20)
            this.bird.angle += 1;
      }

      //Checks pipe collisions with bird
      game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

      if (start == false) {
        if (this.spaceKey.isDown || game.input.activePointer.leftButton.isDown || game.input.pointer1.isDown || game.input.onTap.isDown) {
            start = true;
            this.startScreen();
        }
      }
  },

  highscoreCheck: function(score) {
    if(score > highscore)
        highscore = this.score;
  },

  startScreen: function() {
    // Adds bird's gravity back
    this.bird.body.gravity.y = 1000;

    // Creates pipes
    this.timer = game.time.events.loop(pipeSpawnRate, this.addRowOfPipes, this);

    // Destroy the slash image
    this.splash.destroy();
  },

  // Make the bird jump
  jump: function() {
      if (this.bird.alive == false)
          return;

      // Add a vertical velocity to the bird
      this.bird.body.velocity.y = -350;

      // Animate the bird so when jumps, looks like moving/flapping
      game.add.tween(this.bird).to({angle: -20}, 100).start();

      // Play the jump sound effect
      this.jumpSound.play();
  },

  // Adds a single pipe
  addOnePipe: function(x, y, type) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, type);

    // Add the pipe to our previously created group
    this.pipes.add(pipe);
    this.pipes.z = -1;

    // Enable physics on the pipe
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -pipeSpeed;

    // Automatically kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
    game.world.bringToTop(this.labelScore);
  },

  // Adds a whole row of pipes
  addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * (initNoOfPipes -3)) + 1;

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < initNoOfPipes + 1; i++) {
        if (i != hole && i != hole + 1 && i != hole + 2) {
          this.addOnePipe(initViewportWidth, i * 50, 'pipe_' + themeStr);
        }
    }
  },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false) {
            return;
        }

        // Play death sound
        this.deathSound.play();

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes & floors, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);

        this.floors.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

  // Adds a single floor
  addFloor: function() {
    // Create a floor at the position x and y
    var floor = game.add.sprite(initViewportWidth + 336, initViewportHeight - 112, 'land_' + themeStr);

    // Add the floor to our previously created group
    this.floors.add(floor);

    // Enable physics on the floor
    game.physics.arcade.enable(floor);

    // Add velocity to the floor to make it move left
    floor.body.velocity.x = -pipeSpeed;

    // Automatically kill the floor when it's no longer visible
    // floor.checkWorldBounds = true;
    // floor.outOfBoundsKill = true;
  },

  endGameChangeVars: function() {
    pipeSpeed = 200;
    pipeDistance = (initViewportHeight/1.9);
    pipeSpawnRate = (pipeDistance/pipeSpeed) * 1000;
    start = false;
    pipeBeingChecked = 0;
  },

  // Restart the game
  restartGame: function() {
      // Kill the player
      this.hitPipe();

      // Check if the score is a new highscore
      this.highscoreCheck(this.score);

      // Play death sound
      this.deathSound.play();

      if(this.score > 0)
        var thing = this.score;
      else
        var thing = 0;

      // Set the score and highscore in the gameover screen
      document.getElementById("score").innerText     = "Score: "     + thing;
      document.getElementById("highScore").innerText = "Highscore: " + highscore;
      document.getElementById('myBtn').click();

      game.paused = true;
  },
};

// Initialize Phaser, and creates the game to be the same as viewport size
var game = new Phaser.Game(initViewportWidth, initViewportHeight);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
