<?php
session_start();
session_destroy();
header('Location:/Cardgame/Cardgame/View/index.php');
exit;
?>
