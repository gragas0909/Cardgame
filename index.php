<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blackjack</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="coin-balance">
        <p id="coin-balance">Coin Balance: 0</p>
    </div>
    <div class="game-container">
        <h1>Crazy Blackjack</h1>
        <div class="player-hand">
            <h2>Player's Hand:</h2>
            <p id="player-hand-value"></p>
            <div id="player-cards"></div>
        </div>
        <div class="dealer-hand">
            <h2>Dealer's Hand:</h2>
            <p id="dealer-hand-value"></p>
            <div id="dealer-cards"></div>
        </div>
        <div class="game-controls">
            <button id="hit-button">Hit</button>
            <button id="stand-button">Stand</button>
            <button id="new-game-button">New Game</button>
        </div>
        <div class="game-status">
            <p id="game-status-message"></p>
        </div>
    </div>
    <div class="buffs-container">
        <h2>Buffs:</h2>
        <button id="double-coins-button">Double Coins (20 coins, 3 rounds)</button>
        <button id="extra-card-button">Extra Card (30 coins, 2 rounds)</button>
        <button id="insurance-button">Insurance (10 coins, 1 round)</button>
    </div>
    <div class="login-redirect">
    <?php
    if (isset($_SESSION['username'])) {
        echo '<a href="logout.php" id="login-link" class="login-btn">Logout</a>';
    } else {
        echo '<a href="register.html" id="login-link" class="login-btn">Register</a>';
        echo '<a href="login.html" id="login-link" class="login-btn">Login</a>';
    }
    ?>
</div>

    <script src="script.js"></script>
</body>
</html>
