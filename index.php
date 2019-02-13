<!DOCTYPE html>
<html lang="en">
	<head>
    <style>
        @import url('https://fonts.googleapis.com/css?family=VT323');</style>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
		<script type="text/javascript" src="assets/js/phaser.min.js"></script>
		<script type="text/javascript" src="assets/js/main.js"></script>
		<link rel="stylesheet" type="text/css" href="css/main.css">
        <link rel="icon" href="favicon.ico" type="image/x-icon"/>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>        
		<meta charset="UTF-8">
		<meta http-equiv="refresh" content="<?php echo $sec?>; URL='<?php echo $page?>'">
		<title>Betty Bird</title>
	</head>
	<body>
		<button id="myBtn">Open Modal</button>
		
		<!-- The Modal -->
		<div id="myModal" class="modal">

        <div class="modal-content">

                <span class="close"></span>
                <div class="scoreBoard">
                    <div class ="score" id="score">Your Score: </div>
                    <div class="highScore" id="highScore">High Score: </div>
                </div><br>
                <button class="menubtn"id="restartBtn">Reset Game</button><br>
                <form action="/SHU-Sky-Bet/navigation.html" method="get">
                    <button class="menubtn" id="returnBtn">Return to Sky Bet</button><br>
                </form>
                    <div class ="header">Current Status</div><br>
                    
						<div class="container">
                            <div class="picture">
								<img id="pic" src=""/>
                            </div>
							<div class="username" id="uname">								
							</div>
                            <div class="username" id="@">								
							</div>
							<div class="clearfix"></div>
							<div class="tweet" id="update">							
								</div>
								<div class="time" id="time1">
							</div>	
						</div>

                        <br><div class="header">Past Updates</div><br>

                        <div class="container">
							<div class="picture">
								<img src="" id="pic2" />
							</div>
							<div class="username" id="uname2">								
							</div>
                            <div class="username" id="@@">								
							</div>
							<div class="clearfix"></div>
							<div class="tweet" id="recent1">							
								</div>
								<div class="time" id = "time2">
							</div>	
						</div><br>

                        <div class="container">
							<div class="picture">
								<img src="" id="pic3" />
							</div>
							<div class="username" id="uname3">								
							</div>
                            <div class="username" id="@@@">								
							</div>
							<div class="clearfix"></div>
							<div class="tweet" id="recent2">							
								</div>
								<div class="time" id="time3">
							</div>	
						</div><br>

                        <div class="container">
							<div class="picture">
								<img src=""id="pic4" />
							</div>
							<div class="username" id="uname4">								
							</div>
                            <div class="username" id="@@@@">								
							</div>
							<div class="clearfix"></div>
							<div class="tweet" id="recent3">							
								</div>
								<div class="time" id="time4">
							</div>	
						</div>

                        <div class="stop">
                            <br><img src="assets/images/stop.png">
                        </div>

                        <script type="text/javascript">
	// Get the modal
	var modal = document.getElementById('myModal');
	
	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

    var resetBtn = document.getElementById("restartBtn");
	
	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
		modal.style.display = "block";
		fetch('gettweets.php')
  	.then(function(response) {
    return response.json();
  	})
  .then(function(myJson) {
		var tweetArray = myJson;

        //populats all tweets in the modal
        populateCommon(tweetArray[0]);
		populateFirstElement(tweetArray[0]);
        populateSecondElement(tweetArray[1]);
        populateThirdElement(tweetArray[2]);
        populateForthElement(tweetArray[3]);


  });
	}
    //populates first tweet
   function populateFirstElement(tweet){
       if(tweet.text.includes('#Online')){
        document.getElementById('update').innerHTML = tweet.text;
        document.getElementById('time1').innerHTML = formatTime(tweet);
        document.getElementById('returnBtn').style.display = "block";
        document.getElementById('pic').style.display = "block";
       }else if(tweet.text.includes('#Offline')){
        document.getElementById('pic').style.display = "none";
        document.getElementById('update').innerHTML = "<span style='color: #FF0000'>Service Offline</span>";
        document.getElementById('time1').innerHTML = formatTime(tweet);
        document.getElementById('uname').innerHTML = "";
        document.getElementById('@').innerHTML = "";
        document.getElementById('pic').src = "";
        document.getElementById('returnBtn').style.display = "none";
       }else{document.getElementById('update').innerHTML = "No Recent Updates, refer Below";
        document.getElementById('uname').innerHTML = "";
        document.getElementById('@').innerHTML = "";
        document.getElementById('pic').src = "";}
    }

    //populates second tweet
    function populateSecondElement(tweet){
        if(tweet.text.includes('#Online') || tweet.text.includes('#Offline')){
        document.getElementById('recent1').innerHTML = tweet.text;     
        document.getElementById('time2').innerHTML = formatTime(tweet);
        }

    }

    //populates third tweet
    function populateThirdElement(tweet){
        if(tweet.text.includes('#Online') || tweet.text.includes('#Offline')){
        document.getElementById('recent2').innerHTML = tweet.text; 
        document.getElementById('time3').innerHTML = formatTime(tweet);
        }

    }

    //populates forth tweet
    function populateForthElement(tweet){
        if(tweet.text.includes('#Online') || tweet.text.includes('#Offline')){
        document.getElementById('recent3').innerHTML = tweet.text;
        document.getElementById('time4').innerHTML = formatTime(tweet);
        }

    }

    //populates all tweets with Username, Screen name and Twitter profile picture
    function populateCommon(tweet){
        document.getElementById('uname').innerHTML = tweet.user.name;
        document.getElementById('@').innerHTML = "@" + tweet.user.screen_name;
        document.getElementById('pic').src = tweet.user.profile_image_url;
        
        document.getElementById('uname2').innerHTML = tweet.user.name;
        document.getElementById('@@').innerHTML = "@" + tweet.user.screen_name;
        document.getElementById('pic2').src = tweet.user.profile_image_url;
        
        document.getElementById('uname3').innerHTML = tweet.user.name;
        document.getElementById('@@@').innerHTML = "@" + tweet.user.screen_name;
        document.getElementById('pic3').src = tweet.user.profile_image_url;
        
        document.getElementById('uname4').innerHTML = tweet.user.name;
        document.getElementById('@@@@').innerHTML = "@" + tweet.user.screen_name;
        document.getElementById('pic4').src = tweet.user.profile_image_url;

        
    }
    
    //pulls created_at from Twitter API and formats it
    function formatTime(tweet){
        var str = tweet.created_at;
        var createdAt = str.split(" ", 6);
        var time = createdAt[3].split(":", 3);
        console.log(createdAt);
        console.log(time);
        var ampm = "pm";
        if(time[0] < 12){
            time[0] - 12;
            ampm = "am";
        }
        var timeString = "Posted At: " + time[0] + ":" + time[1] + ampm + " - " + createdAt[2] + " " + createdAt[1] + " " + createdAt[5];
        return timeString;
    }

    //Restarts game when reset button is clicked
    resetBtn.onclick = function() {
	modal.style.display = "none";
    game.state.start('main');
    game.paused = false;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
		modal.style.display = "none";
		game.state.start('main');
		game.paused = false;

  }
}
    </script>
