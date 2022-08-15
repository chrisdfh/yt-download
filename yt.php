<?php
$ans = null;
$sal = null;

$raw_data = json_decode(file_get_contents("php://input"),true);
$url = $raw_data['url'];
exec("youtube-dl -j $url",$sal,$ans);

echo json_encode($sal[0]);


?>
