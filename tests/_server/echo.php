<?php
error_reporting(0);
header("Content-type: application/json");

$received = $_GET;

if ( $_POST ) {
  $received = $_POST;
}

echo json_encode($received);
?>
