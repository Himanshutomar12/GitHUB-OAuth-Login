<?php
$option = $_POST["1"];
function callApiGet($url){
    $ch = curl_init(urldecode($url));
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Accept: application/json',
        )
    ));
    return curl_exec($ch);
}

if($option == "getaccesstokes"){
    $client_id = "54a6b9967e87ed971168";
    $client_secret = "d514f6eb7bd6d2ab739ae3ecf3196afcfb8fe6e4";
    $code = $_POST["2"];
    $url = "https://github.com/login/oauth/access_token?client_id=".$client_id."&client_secret=".$client_secret."&code=".$code;
    $response = callApiGet($url);
    echo $response;
} else if($option == "getusers"){
    $url = "https://github.com/user?access_token=".$_POST["2"]."";
    $response = callApiGet($url);
    echo $response;
}

?>