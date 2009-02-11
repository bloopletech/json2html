<?
$prefix = substr($_GET["url"], 0, 4);
if($prefix != "http") die();
echo file_get_contents($_GET["url"]);
//header("Location: ".$_GET["url"]);
?>