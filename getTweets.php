<?php 

include "includes/twitteroauth.php";

$consumer_key = "Smf5sMgKZqD1T3ZFoIvegYNfn";
$consumer_secret = "iIn2Rk0IDzaM849PD3UOJALW2VHMr0NEsWAskIlWKbbUnCu3oC";
$access_token = "1084163370343952386-XhpWABCFZD4jwDet0wvolfefl9b5u4";
$access_token_secret = "ErsXgbw35gI7w8GC9KB3hvC9fNbwFhjU1DZrGOu2O8FVD";

$twitter = new TwitterOAuth($consumer_key,$consumer_secret,$access_token,$access_token_secret);


$tweets = $twitter->get('https://api.twitter.com/1.1/search/tweets.json?q=SbpShu&result_type=recent&count=5');

$returnAr = array();

foreach ($tweets->statuses as $key => $tweet) { 
    $returnAr[] = $tweet;
}

echo json_encode($returnAr);    
?>
