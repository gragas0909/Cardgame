
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

const cardValues = {
  'Ace': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'Jack': 10,
  'Queen': 10,
  'King': 10
};


class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getValue() {
    return cardValues[this.rank];
  }

  getHTML() {
    return `<div class="card">
              <div class="rank">${this.rank}</div>
              <div class="suit">${this.suit}</div>
            </div>`;
  }

  isSpecial() {
    return false;
  }
}


class SpecialCard extends Card {
  constructor(rank, description, longDescription) {
    super('Special', rank);
    this.description = description;
    this.longDescription = longDescription;
  }

  getHTML() {
    return `<div class="card special">
              <div class="rank">${this.rank}</div>
              <div class="suit">Special</div>
              <span class="tooltiptext">
                ${this.description}<br><br>${this.longDescription}
              </span>
            </div>`;
  }

  isSpecial() {
    return true;
  }
}


class HiddenCard extends SpecialCard {
  constructor() {
    super('?', 'Hidden Value', 'Acts as a normal valued card, but its value remains hidden.');
    this.hiddenValue = Math.floor(Math.random() * 10) + 1;
    this.revealed = false;
  }

  getValue() {
    return this.revealed ? this.hiddenValue : 0;
  }

  reveal() {
    this.revealed = true;
  }

  getHTML() {
    const displayRank = this.revealed ? this.hiddenValue : '?';
    return `<div class="card special">
              <div class="rank">${displayRank}</div>
              <div class="suit">Special</div>
              <span class="tooltiptext">
                ${this.description}<br><br>${this.longDescription}
              </span>
            </div>`;
  }
}

class AllUpCard extends SpecialCard {
  constructor() {
    super('All Up!', 'Value Boost', 'Increases the value of all cards played by the player so far this round by 2.');
  }

  getValue() {
    return 0;
  }
}

class WildCard extends SpecialCard {
  constructor() {
    super('Wild', 'Random Value', 'Adds a random value (1-10) to your total.');
    this.randomValue = Math.floor(Math.random() * 10) + 1;
  }

  getValue() {
    return this.randomValue;
  }
}

class ChangeCard extends SpecialCard {
  constructor() {
    super('Change', 'Swap Card', 'Replaces one of your previously drawn normal cards with a new random one.');
  }

  applyEffect(player, deck) {
    const nonSpecialCards = player.hand.cards.filter(card => !card.isSpecial());
    if (nonSpecialCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * nonSpecialCards.length);
    const cardToReplace = nonSpecialCards[randomIndex];
    const index = player.hand.cards.indexOf(cardToReplace);
    const newCard = deck.dealCard();
    if (index !== -1) {
      player.hand.cards[index] = newCard;
    }
  }

  getValue() {
    return 0;
  }
}

class RoyaltyCard extends SpecialCard {
  constructor() {
    super('Royalty', 'Instant Win', 'A rare card. 5% chance to win the game instantly when drawn!');
  }

  getValue() {
    return 0; 
  }

  applyEffect(player) {
    if (Math.random() < 0.05) {
      document.getElementById('game-status-message').textContent = 'You drew the Royalty card! Instant Win!';
      document.getElementById('hit-button').disabled = true;
      document.getElementById('stand-button').disabled = true;
      document.getElementById('new-game-button').disabled = false;

     
      player.updateWinCount();
    } else {
      document.getElementById('game-status-message').textContent = 'You drew the Royalty card! No instant win this time.';
    }
  }
}


class Deck {
  constructor() {
    this.cards = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
    this.specialCards = [
      new WildCard(),
      new HiddenCard(),
      new AllUpCard(),
      new ChangeCard(),
      new RoyaltyCard() 
    ];
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard() {
    return this.cards.pop();
  }

  dealSpecialCard() {
    return this.specialCards.length ? this.specialCards.pop() : null;
  }
}


class Hand {
  constructor() {
    this.cards = [];
    this.allUpActive = false;
  }

  addCard(card) {
    this.cards.push(card);
    if (card instanceof AllUpCard) this.allUpActive = true;
  }

  getTotalValue() {
    let total = 0;
    let aces = 0;
    for (let card of this.cards) {
      let cardValue = card.getValue();
      if (this.allUpActive && !card.isSpecial()) cardValue += 2;
      total += cardValue;
      if (card.rank === 'Ace') aces++;
    }
    while (total > 21 && aces) {
      total -= 10;
      aces--;
    }
    return total;
  }

  getHTML() {
    return this.cards.map(card => card.getHTML()).join('');
  }

  clear() {
    this.cards = [];
    this.allUpActive = false;
  }

  revealHiddenCards() {
    this.cards.forEach(card => {
      if (card instanceof HiddenCard) card.reveal();
    });
  }
}


class Player {
  constructor(name) {
    this.name = name;
    this.hand = new Hand();
    this.winCount = 0;
  }

  hit(deck) {
    let card = Math.random() < 0.3 ? deck.dealSpecialCard() : null;
    if (!card) card = deck.dealCard();
    this.hand.addCard(card);

    if (card instanceof ChangeCard) {
      card.applyEffect(this, deck);
    }

    
    if (card instanceof RoyaltyCard) {
      card.applyEffect(this);
    }
  }

  getHandHTML() {
    return this.hand.getHTML();
  }

  getHandValue() {
    return this.hand.getTotalValue();
  }

  updateWinCount() {
    this.winCount++;
    document.getElementById('win-counter').textContent = `Wins: ${this.winCount}`;
  }
}


class Dealer {
  constructor() {
    this.hand = new Hand();
  }

  hit(deck) {
    this.hand.addCard(deck.dealCard());
  }

  getHandHTML() {
    return this.hand.cards.map((card, i) => i === 0 ? card.getHTML() : `<div class="card">
              <div class="rank">?</div>
              <div class="suit">?</div>
            </div>`).join('');
  }

  getHandValue() {
    return this.hand.getTotalValue();
  }
}


class Game {
  constructor() {
    this.deck = new Deck();
    this.deck.shuffle();
    this.player = new Player('Player');
    this.dealer = new Dealer();
    this.hitHandler = this.hitHandler.bind(this);
    this.standHandler = this.standHandler.bind(this);
    this.newGameHandler = this.newGameHandler.bind(this);
    this.setupEventListeners();
  }

  start() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('game-status-message').textContent = '';
    this.player.hand.clear();
    this.dealer.hand.clear();
    this.deck = new Deck();
    this.deck.shuffle();
    this.player.hit(this.deck);
    this.player.hit(this.deck);
    this.dealer.hit(this.deck);
    this.dealer.hit(this.deck);
    document.getElementById('player-hand-value').textContent = `Total: ${this.player.getHandValue()}`;
    document.getElementById('dealer-hand-value').textContent = `Total: ${this.dealer.hand.cards[0].getValue()}`;
    document.getElementById('player-cards').innerHTML = this.player.getHandHTML();
    document.getElementById('dealer-cards').innerHTML = this.dealer.getHandHTML();
  }

  setupEventListeners() {
    document.getElementById('hit-button').addEventListener('click', this.hitHandler);
    document.getElementById('stand-button').addEventListener('click', this.standHandler);
    document.getElementById('new-game-button').addEventListener('click', this.newGameHandler);
  }

  hitHandler() {
    this.player.hit(this.deck);
    document.getElementById('player-hand-value').textContent = `Total: ${this.player.getHandValue()}`;
    document.getElementById('player-cards').innerHTML = this.player.getHandHTML();
    if (this.player.getHandValue() > 21) {
      document.getElementById('game-status-message').textContent = 'Player busts! Dealer wins!';
      document.getElementById('hit-button').disabled = true;
      document.getElementById('stand-button').disabled = true;
    }
  }

  standHandler() {
    while (this.dealer.getHandValue() < 17) this.dealer.hit(this.deck);
    this.player.hand.revealHiddenCards();
    document.getElementById('player-cards').innerHTML = this.player.getHandHTML();
    document.getElementById('player-hand-value').textContent = `Total: ${this.player.getHandValue()}`;
    document.getElementById('dealer-hand-value').textContent = `Total: ${this.dealer.getHandValue()}`;
    document.getElementById('dealer-cards').innerHTML = this.dealer.hand.getHTML();
    const p = this.player.getHandValue();
    const d = this.dealer.getHandValue();
    if (d > 21 || p > d) {
      document.getElementById('game-status-message').textContent = 'Player wins!';
      this.player.updateWinCount();
    } else if (d > p) {
      document.getElementById('game-status-message').textContent = 'Dealer wins!';
    } else {
      document.getElementById('game-status-message').textContent = 'Push!';
    }
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
  }

  newGameHandler() {
    this.start();
  }
}


const game = new Game();
game.start();
