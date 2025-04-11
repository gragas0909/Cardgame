<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blackjack</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="top-bar">
    <div class="win-counter">
      <p id="win-counter">Wins: 0</p>
    </div>
    <div class="login-redirect">
      <?php
      if (isset($_SESSION['username'])) {
        echo '<a href="logout.php" class="login-btn">Logout</a>';
      } else {
        echo '<a href="register.html" class="login-btn">Register</a>';
        echo '<a href="login.html" class="login-btn">Login</a>';
      }
      ?>
    </div>
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

  <script src="script.js"></script>
</body>
</html>
